import type { ProjectData, EvidenceItem } from '../types/evidence';

interface EvidencePreviewProps {
  docTitle: string;
  project: ProjectData;
  items: EvidenceItem[];
  logoLeftSrc?: string;
  logoRightSrc?: string;
}

const ITEMS_PER_PAGE = 6;

// Tinggi maksimal kotak foto (px, pada lebar halaman 794px).
// Naikkan angkanya kalau ingin foto potret tampil lebih besar,
// tapi pastikan dua baris foto + kop tetap muat di satu halaman A4.
const FRAME_HEIGHT_PX: Record<2 | 3, number> = { 2: 240, 3: 200 };

function chunkItems(items: EvidenceItem[], size: number): EvidenceItem[][] {
  const chunks: EvidenceItem[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks.length > 0 ? chunks : [[]];
}

export default function EvidencePreview({
  docTitle,
  project,
  items,
  logoLeftSrc,
  logoRightSrc,
}: EvidencePreviewProps) {
  // Foto dipecah per halaman (maks 6 foto/halaman) supaya tidak kepotong
  // di batas kertas A4 saat diexport ke PDF.
  const pages = chunkItems(items, ITEMS_PER_PAGE);

  return (
    <>
      {pages.map((pageItems, pageIndex) => {
        // Pola kolom otomatis: 4 foto atau kurang -> 2 kolom, lebih dari itu -> 3 kolom
        const columns: 2 | 3 = pageItems.length <= 4 ? 2 : 3;
        const frameHeight = FRAME_HEIGHT_PX[columns];
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <div key={pageIndex}>
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

              <div
                className="pdf-photo-grid"
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
              >
                {pageItems.map((item) => (
                  <div key={item.id} className="pdf-photo-cell">
                    <div className="pdf-photo-frame" style={{ height: frameHeight }}>
                      {item.dataUrl ? (
                        <img
                          src={item.dataUrl}
                          alt={item.label}
                          data-evidence-id={item.id}
                          style={{ maxHeight: frameHeight }}
                        />
                      ) : (
                        <div className="pdf-photo-placeholder">Belum ada foto</div>
                      )}
                    </div>
                    <div className="pdf-photo-caption">
                      {(item.label || '(Tanpa keterangan)').toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {pages.length > 1 && (
                <div className="pdf-page-number">
                  Halaman {pageIndex + 1} dari {pages.length}
                </div>
              )}
            </div>

            {!isLastPage && <div className="pdf-page-gap">— Akhir Halaman {pageIndex + 1} —</div>}
          </div>
        );
      })}
    </>
  );
}