import PdfHeader from './PdfHeader';
import { BRAND, type LogoSize } from '../config/brand';
import type { ProjectData } from '../types/evidence';
import '../assets/style_Cover.css';

interface CoverPageProps {
  showLogos: boolean;
  logoSize: LogoSize;
  project: ProjectData;
  titleLine1: string;
  titleLine2: string;
  partyLine1: string;
  partyLine2: string;
}

export default function CoverPage({
  showLogos,
  logoSize,
  project,
  titleLine1,
  titleLine2,
  partyLine1,
  partyLine2,
}: CoverPageProps) {
  return (
    <div className="pdf-page pdf-cover-page">
      <PdfHeader showLogos={showLogos} logoSize={logoSize} />

      <h1 className="pdf-cover-title">
        {titleLine1}
        <br />
        {titleLine2}
      </h1>

      <div className="pdf-cover-rule" />

      <div className="pdf-cover-info-table">
        <div className="pdf-cover-info-row">
          <span className="pdf-cover-info-label">PROYEK</span>
          <span>: {project.proyek}</span>
        </div>
        <div className="pdf-cover-info-row">
          <span className="pdf-cover-info-label">KONTRAK</span>
          <span>: {project.kontrak}</span>
        </div>
        <div className="pdf-cover-info-row">
          <span className="pdf-cover-info-label">SURAT PESANAN</span>
          <span>: {project.suratPesanan}</span>
        </div>
        <div className="pdf-cover-info-row">
          <span className="pdf-cover-info-label">DISTRICT</span>
          <span>: {project.district}</span>
        </div>
        <div className="pdf-cover-info-row">
          <span className="pdf-cover-info-label">LOKASI</span>
          <span>: {project.lokasi}</span>
        </div>
        <div className="pdf-cover-info-row">
          <span className="pdf-cover-info-label">PELAKSANA</span>
          <span>: {project.pelaksana}</span>
        </div>
      </div>

      <div className="pdf-cover-rule" />

      <div className="pdf-cover-bigmark">
        <img src={BRAND.left.src} alt={BRAND.left.alt} />
      </div>

      <div className="pdf-cover-parties">
        <p>ANTARA</p>
        <p>{partyLine1}</p>
        <p>DENGAN</p>
        <p>{partyLine2}</p>
      </div>
    </div>
  );
}