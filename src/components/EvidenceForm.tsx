import { useState } from 'react';
import MainLayout from './MainLayout';
import EvidencePreview from './EvidencePreview';
import { compressImage } from '../utils/imageCompress';
import { generatePdfFromElement } from '../utils/pdfFromElement';
import type { ProjectData, EvidenceItem, DefaultEvidenceItem } from '../types/evidence';
import '../assets/style_Evidence.css';

interface EvidenceFormProps {
  docTitle: string;
  pageTitle: string;
  activeMenu: string;
  defaultItems: DefaultEvidenceItem[];
  logoLeftSrc?: string;
  logoRightSrc?: string;
}

const emptyProject: ProjectData = {
  proyek: '',
  kontrak: '',
  suratPesanan: '',
  district: '',
  lokasi: '',
  pelaksana: '',
};

let idCounter = 0;
const generateId = () => `item-${Date.now()}-${idCounter++}`;

export default function EvidenceForm({
  docTitle,
  pageTitle,
  activeMenu,
  defaultItems,
  logoLeftSrc,
  logoRightSrc,
}: EvidenceFormProps) {
  const [project, setProject] = useState<ProjectData>(emptyProject);
  const [docHeading, setDocHeading] = useState('LAMPIRAN EVIDENT PEKERJAAN');
  const [items, setItems] = useState<EvidenceItem[]>(
    defaultItems.map((d) => ({ id: d.id, label: d.label, dataUrl: null }))
  );
  const [mode, setMode] = useState<'form' | 'preview'>('form');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProjectChange = (field: keyof ProjectData, value: string) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleLabelChange = (id: string, value: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, label: value } : it)));
  };

  const handlePhotoChange = async (id: string, file: File | null) => {
    if (!file) return;
    const compressedDataUrl = await compressImage(file);
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, dataUrl: compressedDataUrl } : it)));
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { id: generateId(), label: '', dataUrl: null }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handlePreview = () => {
    if (docHeading.trim() === '') {
      alert('Mohon isi judul dokumen terlebih dahulu.');
      return;
    }
    const projectBelumLengkap = Object.values(project).some((v) => v.trim() === '');
    if (projectBelumLengkap) {
      alert('Mohon lengkapi semua data proyek terlebih dahulu.');
      return;
    }
    if (items.length === 0) {
      alert('Tambahkan minimal 1 evidence foto terlebih dahulu.');
      return;
    }
    const adaLabelKosong = items.some((it) => it.label.trim() === '');
    if (adaLabelKosong) {
      alert('Mohon isi keterangan untuk setiap foto evidence.');
      return;
    }
    setMode('preview');
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const safeName = (project.proyek || 'proyek').replace(/\s+/g, '_');
      await generatePdfFromElement('pdf-preview-content', `${docTitle}_${safeName}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Gagal membuat PDF, coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (mode === 'preview') {
    return (
      <MainLayout pageTitle={pageTitle} activeMenu={activeMenu}>
        <div className="evidence-preview-actions">
          <button className="evidence-btn-secondary" onClick={() => setMode('form')}>
            ← Kembali Edit
          </button>
          <button className="evidence-submit-btn" onClick={handleDownload} disabled={isProcessing}>
            {isProcessing ? 'Memproses...' : `Unduh ${docTitle} (PDF)`}
          </button>
        </div>

        <div id="pdf-preview-content">
          <EvidencePreview
            docTitle={docHeading}
            project={project}
            items={items}
            logoLeftSrc={logoLeftSrc}
            logoRightSrc={logoRightSrc}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle={pageTitle} activeMenu={activeMenu}>
      <div className="evidence-form">
        <div className="evidence-heading-field">
          <label htmlFor="doc-heading-input">Judul Dokumen</label>
          <input
            id="doc-heading-input"
            type="text"
            value={docHeading}
            onChange={(e) => setDocHeading(e.target.value)}
            placeholder="Contoh: LAMPIRAN EVIDENT PEKERJAAN"
          />
        </div>

        <div className="evidence-form-fields">
          <label>
            Proyek
            <input
              type="text"
              value={project.proyek}
              onChange={(e) => handleProjectChange('proyek', e.target.value)}
              placeholder="Ketik disini"
            />
          </label>
          <label>
            Kontrak
            <input
              type="text"
              value={project.kontrak}
              onChange={(e) => handleProjectChange('kontrak', e.target.value)}
              placeholder="Ketik disini"
            />
          </label>
          <label>
            Surat Pesanan
            <input
              type="text"
              value={project.suratPesanan}
              onChange={(e) => handleProjectChange('suratPesanan', e.target.value)}
              placeholder="Ketik disini"
            />
          </label>
          <label>
            District
            <input
              type="text"
              value={project.district}
              onChange={(e) => handleProjectChange('district', e.target.value)}
              placeholder="Ketik disini"
            />
          </label>
          <label>
            Lokasi
            <input
              type="text"
              value={project.lokasi}
              onChange={(e) => handleProjectChange('lokasi', e.target.value)}
              placeholder="Ketik disini"
            />
          </label>
          <label>
            Pelaksana
            <input
              type="text"
              value={project.pelaksana}
              onChange={(e) => handleProjectChange('pelaksana', e.target.value)}
              placeholder="Ketik disini"
            />
          </label>
        </div>

        <div className="evidence-sections">
          {items.map((item) => (
            <div key={item.id} className="evidence-section-card">
              <button
                type="button"
                className="evidence-remove-btn"
                onClick={() => handleRemoveItem(item.id)}
                title="Hapus evidence ini"
              >
                ×
              </button>

              <input
                type="text"
                className="evidence-label-input"
                placeholder="Ketik disini"
                value={item.label}
                onChange={(e) => handleLabelChange(item.id, e.target.value)}
              />

              <label htmlFor={`evidence-file-${item.id}`} className="evidence-upload-box">
                {item.dataUrl ? (
                  <img src={item.dataUrl} alt={item.label} className="evidence-photo-preview" />
                ) : (
                  <>
                    <span className="evidence-upload-icon">⬆</span>
                    <span className="evidence-upload-text">Unggah foto disini</span>
                  </>
                )}
              </label>
              <input
                id={`evidence-file-${item.id}`}
                type="file"
                accept="image/*"
                className="evidence-upload-input"
                onChange={(e) => handlePhotoChange(item.id, e.target.files?.[0] ?? null)}
              />
              {item.dataUrl && (
                <label htmlFor={`evidence-file-${item.id}`} className="evidence-change-photo-link">
                  Ganti foto
                </label>
              )}
            </div>
          ))}

          <button type="button" className="evidence-add-card" onClick={handleAddItem}>
            + Tambah Evidence
          </button>
        </div>

        <button className="evidence-submit-btn" onClick={handlePreview}>
          Lihat Preview
        </button>
      </div>
    </MainLayout>
  );
}