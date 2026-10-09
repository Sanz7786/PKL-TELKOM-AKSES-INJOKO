import { useState } from 'react';
import MainLayout from './MainLayout';
import BoqPage from './BoqPage';
import SimpleExportOptionsPanel, {
  DEFAULT_SIMPLE_EXPORT_OPTIONS,
  type SimpleExportOptions,
} from './SimpleExportOptions';
import { QUALITY_PRESETS, buildPdfFileName } from './ExportOptions';
import { compressImage } from '../utils/imageCompress';
import { generatePdfFromElement } from '../utils/pdfFromElement';
import type { ProjectData } from '../types/evidence';
import '../assets/style_Boq.css';

interface BoqFormProps {
  /** 'LACT' atau 'BAUT' — dipakai untuk nama file yang diunduh */
  docTitle: string;
  /** Judul yang tampil di kop halaman aplikasi, mis. "Buat LACT — BOQ" */
  pageTitle: string;
  /** 'lact-builder' atau 'baut-builder' — supaya sidebar menyorot menu yang benar */
  activeMenu: string;
  /** Judul dokumen di kop halaman PDF, mis. "BILL OF QUANTITY COMMISIONING TEST" */
  defaultDocHeading: string;
}

const emptyProject: ProjectData = {
  proyek: '',
  kontrak: '',
  suratPesanan: '',
  district: '',
  lokasi: '',
  pelaksana: '',
};

export default function BoqForm({ docTitle, pageTitle, activeMenu, defaultDocHeading }: BoqFormProps) {
  const [project, setProject] = useState<ProjectData>(emptyProject);
  const [docHeading, setDocHeading] = useState(defaultDocHeading);

  // Gambar tabel BOQ (screenshot/scan dari Excel), menggantikan tabel entri manual.
  // `boqImageFile` menyimpan file ASLI (dipakai saat export PDF supaya tetap tajam),
  // `boqImagePreview` menyimpan versi ringan untuk ditampilkan di layar.
  const [boqImageFile, setBoqImageFile] = useState<File | null>(null);
  const [boqImagePreview, setBoqImagePreview] = useState<string | null>(null);

  const [tanggalISO, setTanggalISO] = useState('');
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [jabatanBaris1, setJabatanBaris1] = useState('WASPANG');
  const [jabatanBaris2, setJabatanBaris2] = useState('PT. TELKOM AKSES');
  const [kota, setKota] = useState('');
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  const [mode, setMode] = useState<'form' | 'preview'>('form');
  const [isProcessing, setIsProcessing] = useState(false);
  const [exportOpts, setExportOpts] = useState<SimpleExportOptions>(
    DEFAULT_SIMPLE_EXPORT_OPTIONS
  );

  const handleProjectChange = (field: keyof ProjectData, value: string) => {
    setProject((prev) => ({ ...prev, [field]: value }));
  };

  const handleBoqImageChange = async (file: File | null) => {
    if (!file) return;
    try {
      const preview = await compressImage(file);
      setBoqImageFile(file);
      setBoqImagePreview(preview);
    } catch (err) {
      console.error(err);
      alert(`Gambar BOQ "${file.name}" tidak bisa dibuka. Pastikan formatnya JPG atau PNG.`);
    }
  };

  const handleSignatureChange = async (file: File | null) => {
    if (!file) return;
    try {
      const preview = await compressImage(file);
      setSignatureDataUrl(preview);
    } catch (err) {
      console.error(err);
      alert(`Foto tanda tangan "${file.name}" tidak bisa dibuka. Pastikan formatnya JPG atau PNG.`);
    }
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
    if (!boqImagePreview) {
      alert('Mohon unggah gambar tabel BOQ terlebih dahulu.');
      return;
    }
    if (!tanggalISO || nama.trim() === '' || nik.trim() === '' || kota.trim() === '') {
      alert('Mohon lengkapi Tanggal, Kota, Nama, dan NIK untuk blok tanda tangan.');
      return;
    }
    setMode('preview');
  };

  const handleDownload = async () => {
    setIsProcessing(true);
    try {
      const safeName = (project.lokasi || project.proyek || 'dokumen').trim().replace(/\s+/g, '_');
      // Gambar BOQ asli (resolusi penuh) dipakai saat export, supaya teks di tabel tetap tajam
      const originals: Record<string, Blob> = boqImageFile
        ? { 'boq-image': boqImageFile }
        : {};
      await generatePdfFromElement(
        'pdf-boq-content',
        buildPdfFileName(exportOpts, `${docTitle}_BOQ_${safeName}`),
        originals,
        undefined,
        QUALITY_PRESETS[exportOpts.quality]
      );
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
            {isProcessing ? 'Memproses...' : `Unduh BOQ ${docTitle} (PDF)`}
          </button>
        </div>

        {/* Panel opsi berada DI LUAR div ber-id pdf-..., jadi tidak ikut masuk PDF */}
        <SimpleExportOptionsPanel value={exportOpts} onChange={setExportOpts} />

        <div id="pdf-boq-content">
          <BoqPage
            showLogos={exportOpts.showLogos}
            logoSize={exportOpts.logoSize}
            docTitle={docHeading}
            project={project}
            boqImageDataUrl={boqImagePreview}
            tanggalISO={tanggalISO}
            nama={nama}
            nik={nik}
            jabatanBaris1={jabatanBaris1}
            jabatanBaris2={jabatanBaris2}
            kota={kota}
            signatureDataUrl={signatureDataUrl}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle={pageTitle} activeMenu={activeMenu}>
      <div className="evidence-form">
        <div className="evidence-heading-field">
          <label htmlFor="boq-heading">Judul Dokumen</label>
          <input
            id="boq-heading"
            type="text"
            value={docHeading}
            onChange={(e) => setDocHeading(e.target.value)}
            placeholder="Contoh: BILL OF QUANTITY COMMISIONING TEST"
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

        <div className="evidence-heading-field">
          <label htmlFor="boq-image-upload">Gambar Tabel BOQ (screenshot/scan dari Excel)</label>
          <label htmlFor="boq-image-upload" className="boq-image-upload-box">
            {boqImagePreview ? (
              <img src={boqImagePreview} alt="Pratinjau tabel BOQ" />
            ) : (
              <>
                <span className="evidence-upload-icon">⬆</span>
                <span className="evidence-upload-text">Unggah gambar tabel BOQ disini</span>
              </>
            )}
          </label>
          <input
            id="boq-image-upload"
            type="file"
            accept="image/*"
            className="evidence-upload-input"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              e.target.value = '';
              handleBoqImageChange(file);
            }}
          />
          {boqImagePreview && (
            <label htmlFor="boq-image-upload" className="evidence-change-photo-link">
              Ganti gambar
            </label>
          )}
        </div>

        <div className="evidence-form-fields" style={{ marginTop: 20 }}>
          <label>
            Tanggal
            <input type="date" value={tanggalISO} onChange={(e) => setTanggalISO(e.target.value)} />
          </label>
          <label>
            Kota (untuk baris tanda tangan)
            <input
              type="text"
              value={kota}
              onChange={(e) => setKota(e.target.value)}
              placeholder="Contoh: Surabaya"
            />
          </label>
          <label>
            Nama Penandatangan
            <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Ketik disini" />
          </label>
          <label>
            NIK
            <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} placeholder="Ketik disini" />
          </label>
          <label>
            Jabatan — Baris 1
            <input
              type="text"
              value={jabatanBaris1}
              onChange={(e) => setJabatanBaris1(e.target.value)}
              placeholder="Contoh: WASPANG"
            />
          </label>
          <label>
            Jabatan — Baris 2
            <input
              type="text"
              value={jabatanBaris2}
              onChange={(e) => setJabatanBaris2(e.target.value)}
              placeholder="Contoh: PT. TELKOM AKSES"
            />
          </label>
        </div>

        <div className="evidence-heading-field">
          <label htmlFor="boq-sign-upload">Tanda Tangan (opsional, foto atau scan)</label>
          <input
            id="boq-sign-upload"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              e.target.value = '';
              handleSignatureChange(file);
            }}
          />
          {signatureDataUrl && (
            <img src={signatureDataUrl} alt="Pratinjau tanda tangan" style={{ maxWidth: 220, maxHeight: 90, marginTop: 8, display: 'block' }} />
          )}
        </div>

        <button className="evidence-submit-btn" onClick={handlePreview}>
          Lihat Preview
        </button>
      </div>
    </MainLayout>
  );
}