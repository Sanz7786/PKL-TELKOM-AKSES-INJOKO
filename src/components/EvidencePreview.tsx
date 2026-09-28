import type { ProjectData, EvidenceItem } from '../types/evidence';
import PdfHeader from './PdfHeader';
import { DEFAULT_EXPORT_OPTIONS, type ExportOptions } from './ExportOptions';

interface EvidencePreviewProps {
  docTitle: string;
  project: ProjectData;
  items: EvidenceItem[];
  /** Opsi export dari panel "Opsi Export PDF". Kosong = pengaturan standar. */
  options?: ExportOptions;
  /** @deprecated Logo sekarang tetap (lihat src/config/brand.ts). Prop ini diabaikan. */
  logoLeftSrc?: string;
  /** @deprecated Logo sekarang tetap (lihat src/config/brand.ts). Prop ini diabaikan. */
  logoRightSrc?: string;
}

// Tinggi maksimal kotak foto (px, pada lebar halaman 794px).
// Dua baris foto + kop + tabel info harus tetap muat di satu halaman A4.
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
  options = DEFAULT_EXPORT_OPTIONS,
}: EvidencePreviewProps) {
  // Selalu 2 baris foto per halaman: 2 kolom = 4 foto, 3 kolom = 6 foto.
  // Mode "auto" memecah per 6 foto; halaman berisi <= 4 foto otomatis jadi 2 kolom.
  const perPage = options.columns === 2 ? 4 : 6;
  const pages = chunkItems(items, perPage);

  return (
    <>
      {pages.map((pageItems, pageIndex) => {
        const columns: 2 | 3 =
          options.columns === 'auto' ? (pageItems.length <= 4 ? 2 : 3) : options.columns;
        const frameHeight = FRAME_HEIGHT_PX[columns];
        const isLastPage = pageIndex === pages.length - 1;

        return (
          <div key={pageIndex}>
            <div className="pdf-page">
              <PdfHeader showLogos={options.showLogos} logoSize={options.logoSize} />

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

              {options.showPageNumber && pages.length > 1 && (
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