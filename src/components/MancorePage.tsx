import PdfHeader from './PdfHeader';
import type { LogoSize } from '../config/brand';
import type { ProjectData } from '../types/evidence';
import { formatTanggalKata, parseDateLocal } from '../utils/terbilang';
import '../assets/style_Evidence.css';
import '../assets/style_Mancore.css';

interface MancorePageProps {
  showLogos: boolean;
  logoSize: LogoSize;
  docTitle: string; // judul halaman, mis. "LAMPIRAN MANCORE"
  project: ProjectData;
  /** Preview RINGAN gambar tabel mancore (hasil scan/screenshot dari Excel) */
  mancoreImageDataUrl: string | null;
  tanggalISO: string;
  nama: string;
  nik: string;
  jabatanBaris1: string;
  jabatanBaris2: string;
  kota: string;
  signatureDataUrl: string | null;
}

export default function MancorePage({
  showLogos,
  logoSize,
  docTitle,
  project,
  mancoreImageDataUrl,
  tanggalISO,
  nama,
  nik,
  jabatanBaris1,
  jabatanBaris2,
  kota,
  signatureDataUrl,
}: MancorePageProps) {
  const tgl = parseDateLocal(tanggalISO);
  const tglSingkat = tgl ? formatTanggalKata(tgl).singkat : '…';

  return (
    <div className="pdf-page pdf-mancore-page">
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
        Sama seperti halaman BOQ & Data Pengukuran OPM: diisi dengan SATU
        gambar (screenshot/scan tabel OLT/FTM, FEEDER/ODC/SPLITTER, dan
        DISTRIBUSI/ODP dari Excel), bukan tabel entri manual, ditampilkan
        proporsional (tidak gepeng/ketarik) di dalam bingkai berukuran tetap.
        Saat export PDF, gambar ASLI (resolusi penuh) yang dipakai — lihat
        prop `originals` pada generatePdfFromElement di MancoreForm.tsx.
      */}
      <div className="pdf-mancore-image-frame">
        {mancoreImageDataUrl ? (
          <img src={mancoreImageDataUrl} alt="Lampiran Mancore" data-evidence-id="mancore-image" />
        ) : (
          <div className="pdf-mancore-image-placeholder">Belum ada gambar lampiran mancore</div>
        )}
      </div>

      <div className="pdf-mancore-sign-wrap">
        <div className="pdf-mancore-sign-block">
          <p>
            {kota || '…'}, {tglSingkat}
          </p>
          <p>{jabatanBaris1}</p>
          <p>{jabatanBaris2}</p>

          <div className="pdf-mancore-sign-space">
            {signatureDataUrl && <img src={signatureDataUrl} alt="Tanda tangan" />}
          </div>

          <p className="pdf-mancore-sign-name">{nama}</p>
          <p>NIK. {nik}</p>
        </div>
      </div>
    </div>
  );
}