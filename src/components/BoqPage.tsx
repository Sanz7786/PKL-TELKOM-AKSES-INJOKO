import PdfHeader from './PdfHeader';
import type { LogoSize } from '../config/brand';
import type { ProjectData } from '../types/evidence';
import { formatTanggalKata, parseDateLocal } from '../utils/terbilang';
import '../assets/style_Evidence.css';
import '../assets/style_Boq.css';

interface BoqPageProps {
  showLogos: boolean;
  logoSize: LogoSize;
  docTitle: string; // judul halaman, mis. "BILL OF QUANTITY COMMISIONING TEST"
  project: ProjectData;
  /** Preview RINGAN gambar tabel BOQ (hasil scan/screenshot), untuk ditampilkan di layar */
  boqImageDataUrl: string | null;
  tanggalISO: string;
  nama: string;
  nik: string;
  jabatanBaris1: string;
  jabatanBaris2: string;
  kota: string;
  signatureDataUrl: string | null;
}

export default function BoqPage({
  showLogos,
  logoSize,
  docTitle,
  project,
  boqImageDataUrl,
  tanggalISO,
  nama,
  nik,
  jabatanBaris1,
  jabatanBaris2,
  kota,
  signatureDataUrl,
}: BoqPageProps) {
  const tgl = parseDateLocal(tanggalISO);
  const tglSingkat = tgl ? formatTanggalKata(tgl).singkat : '…';

  return (
    <div className="pdf-page pdf-boq-page">
      <PdfHeader showLogos={showLogos} logoSize={logoSize} />

      <h1 className="pdf-title">{docTitle}</h1>

      <div className="pdf-info-table">
        <div className="pdf-info-row">
          <span className="pdf-info-label">PROYEK</span>
          <span>: {project.proyek}</span>
        </div>
        <div className="pdf-info-row">
          <span className="pdf-info-label">KONTRAK</span>
          <span>: {project.kontrak}</span>
        </div>
        <div className="pdf-info-row">
          <span className="pdf-info-label">SURAT PESANAN</span>
          <span>: {project.suratPesanan}</span>
        </div>
        <div className="pdf-info-row">
          <span className="pdf-info-label">DISTRICT</span>
          <span>: {project.district}</span>
        </div>
        <div className="pdf-info-row">
          <span className="pdf-info-label">LOKASI</span>
          <span>: {project.lokasi}</span>
        </div>
        <div className="pdf-info-row">
          <span className="pdf-info-label">PELAKSANA</span>
          <span>: {project.pelaksana}</span>
        </div>
      </div>

      {/*
        Dulu di sini ada tabel BOQ yang diisi baris per baris secara manual.
        Atas permintaan pembimbing, bagian ini sekarang cukup diisi dengan
        SATU gambar (screenshot/scan tabel BOQ dari Excel), ditampilkan
        proporsional (tidak gepeng/ketarik) di dalam bingkai berukuran tetap.
        Saat export PDF, gambar ASLI (resolusi penuh) yang dipakai — lihat
        prop `originals` pada generatePdfFromElement di BoqForm.tsx.
      */}
      <div className="pdf-boq-image-frame">
        {boqImageDataUrl ? (
          <img src={boqImageDataUrl} alt="Tabel BOQ" data-evidence-id="boq-image" />
        ) : (
          <div className="pdf-boq-image-placeholder">Belum ada gambar BOQ</div>
        )}
      </div>

      <div className="pdf-boq-sign-wrap">
        <div className="pdf-boq-sign-block">
          <p>
            {kota || '…'}, {tglSingkat}
          </p>
          <p>{jabatanBaris1}</p>
          <p>{jabatanBaris2}</p>

          <div className="pdf-boq-sign-space">
            {signatureDataUrl && <img src={signatureDataUrl} alt="Tanda tangan" />}
          </div>

          <p className="pdf-boq-sign-name">{nama}</p>
          <p>NIK. {nik}</p>
        </div>
      </div>
    </div>
  );
}