import type { ProjectData, EvidenceItem } from '../types/evidence';

interface EvidencePreviewProps {
  docTitle: string;
  project: ProjectData;
  items: EvidenceItem[];
  logoLeftSrc?: string;
  logoRightSrc?: string;
}

export default function EvidencePreview({
  docTitle,
  project,
  items,
  logoLeftSrc,
  logoRightSrc,
}: EvidencePreviewProps) {
  return (
    <div className="pdf-page">
      <div className="pdf-header">
        <div className="pdf-logo-left">
          {logoLeftSrc ? (
            <img src={logoLeftSrc} alt="Logo kiri" />
          ) : (
            <span className="pdf-logo-text">infraNexia</span>
          )}
        </div>
        <div className="pdf-logo-right">
          {logoRightSrc ? (
            <img src={logoRightSrc} alt="Logo kanan" />
          ) : (
            <span className="pdf-logo-text">TelkomAkses</span>
          )}
        </div>
      </div>

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

      <div className="pdf-photo-grid">
        {items.map((item) => (
          <div key={item.id} className="pdf-photo-cell">
            <div className="pdf-photo-frame">
              {item.dataUrl ? (
                <img src={item.dataUrl} alt={item.label} />
              ) : (
                <div className="pdf-photo-placeholder">Belum ada foto</div>
              )}
            </div>
            <div className="pdf-photo-caption">{(item.label || '(Tanpa keterangan)').toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}