import PdfHeader from './PdfHeader';
import type { LogoSize } from '../config/brand';
import type { ProjectData } from '../types/evidence';
import { formatTanggalKata, parseDateLocal } from '../utils/terbilang';
import '../assets/style_Evidence.css';
import '../assets/style_Opm.css';

interface OpmPageProps {
  showLogos: boolean;
  logoSize: LogoSize;
  titleLine1: string; // mis. "LAMPIRAN DATA PENGUKURAN OPM"
  titleLine2: string; // mis. "PROJECT OUTSIDE PLANT FIBER OPTIC"
  project: ProjectData;
  /** Preview RINGAN gambar data pengukuran OPM (hasil scan/screenshot dari Excel) */
  opmImageDataUrl: string | null;
  tanggalISO: string;
  nama: string;
  nik: string;
  jabatanBaris1: string;
  jabatanBaris2: string;
  kota: string;
  signatureDataUrl: string | null;
}

export default function OpmPage({
  showLogos,
  logoSize,
  titleLine1,
  titleLine2,
  project,
  opmImageDataUrl,
  tanggalISO,
  nama,
  nik,
  jabatanBaris1,
  jabatanBaris2,
  kota,
  signatureDataUrl,
}: OpmPageProps) {
  const tgl = parseDateLocal(tanggalISO);
  const tglSingkat = tgl ? formatTanggalKata(tgl).singkat : '…';

  return (
    <div className="pdf-page pdf-opm-page">
      <PdfHeader showLogos={showLogos} logoSize={logoSize} />

      <h1 className="pdf-title">
        {titleLine1}
        <br />
        {titleLine2}
      </h1>

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
        Sama seperti halaman BOQ: diisi dengan SATU gambar (screenshot/scan
        tabel data pengukuran OPM dari Excel), bukan tabel entri manual,
        ditampilkan proporsional (tidak gepeng/ketarik) di dalam bingkai
        berukuran tetap. Bingkai ini dibuat lebih tinggi daripada bingkai BOQ
        karena tabel OPM biasanya punya lebih banyak baris (per core/port).
        Saat export PDF, gambar ASLI (resolusi penuh) yang dipakai — lihat
        prop `originals` pada generatePdfFromElement di OpmForm.tsx.
      */}
      <div className="pdf-opm-image-frame">
        {opmImageDataUrl ? (
          <img src={opmImageDataUrl} alt="Data Pengukuran OPM" data-evidence-id="opm-image" />
        ) : (
          <div className="pdf-opm-image-placeholder">Belum ada gambar data pengukuran OPM</div>
        )}
      </div>

      <div className="pdf-opm-sign-wrap">
        <div className="pdf-opm-sign-block">
          <p>
            {kota || '…'}, {tglSingkat}
          </p>
          <p>{jabatanBaris1}</p>
          <p>{jabatanBaris2}</p>

          <div className="pdf-opm-sign-space">
            {signatureDataUrl && <img src={signatureDataUrl} alt="Tanda tangan" />}
          </div>

          <p className="pdf-opm-sign-name">{nama}</p>
          <p>NIK. {nik}</p>
        </div>
      </div>
    </div>
  );
}