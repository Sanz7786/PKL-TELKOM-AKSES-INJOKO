import PdfHeader from './PdfHeader';
import type { LogoSize } from '../config/brand';
import type { ProjectData } from '../types/evidence';
import '../assets/style_Evidence.css';
import '../assets/style_Kml.css';

interface KmlPageProps {
  showLogos: boolean;
  logoSize: LogoSize;
  docTitle: string; // judul halaman, mis. "LAMPIRAN KML"
  project: ProjectData;
  /** Preview RINGAN screenshot Google Earth/KML */
  kmlImageDataUrl: string | null;
}

/**
 * Halaman Lampiran KML: header - judul - tabel info proyek - SATU gambar
 * screenshot Google Earth (jalur kabel, titik ODC/ODP, kotak pengukuran
 * jarak). Beda dari BOQ/OPM/Mancore, halaman ini TIDAK punya blok tanda
 * tangan (Surabaya, .../WASPANG/...), karena contoh dokumen aslinya juga
 * tidak menampilkan blok itu di halaman Lampiran KML.
 */
export default function KmlPage({
  showLogos,
  logoSize,
  docTitle,
  project,
  kmlImageDataUrl,
}: KmlPageProps) {
  return (
    <div className="pdf-page pdf-kml-page">
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
        Sama seperti halaman BOQ/OPM/Mancore: diisi dengan SATU gambar
        (screenshot Google Earth), bukan elemen interaktif, ditampilkan
        proporsional (tidak gepeng/ketarik) di dalam bingkai berukuran tetap.
        Bingkai ini dibuat lebih tinggi dari BOQ/Mancore karena screenshot
        peta biasanya berupa gambar lanskap besar. Saat export PDF, gambar
        ASLI (resolusi penuh) yang dipakai — lihat prop `originals` pada
        generatePdfFromElement di KmlForm.tsx.
      */}
      <div className="pdf-kml-image-frame">
        {kmlImageDataUrl ? (
          <img src={kmlImageDataUrl} alt="Lampiran KML" data-evidence-id="kml-image" />
        ) : (
          <div className="pdf-kml-image-placeholder">Belum ada gambar lampiran KML</div>
        )}
      </div>
    </div>
  );
}