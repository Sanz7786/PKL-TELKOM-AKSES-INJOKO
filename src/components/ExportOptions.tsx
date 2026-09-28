import type { LogoSize } from '../config/brand';
import '../assets/style_ExportOptions.css';

export type PdfQuality = 'hemat' | 'standar' | 'tajam';
export type ColumnMode = 'auto' | 2 | 3;

export interface ExportOptions {
  showLogos: boolean;
  logoSize: LogoSize;
  columns: ColumnMode;
  showPageNumber: boolean;
  quality: PdfQuality;
  /** Nama file tanpa ".pdf". Kosong = otomatis. */
  fileName: string;
}

export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  showLogos: true,
  logoSize: 'sedang',
  columns: 'auto',
  showPageNumber: true,
  quality: 'standar',
  fileName: '',
};

/** scale = ketajaman screenshot halaman, jpeg = kompresi (0-1). */
export const QUALITY_PRESETS: Record<PdfQuality, { scale: number; jpeg: number; label: string }> = {
  hemat: { scale: 2, jpeg: 0.7, label: 'Hemat ukuran (file lebih kecil)' },
  standar: { scale: 3, jpeg: 0.85, label: 'Standar' },
  tajam: { scale: 3, jpeg: 0.95, label: 'Tajam (file lebih besar)' },
};

/** Bersihkan nama file dari karakter terlarang dan pastikan berakhiran .pdf */
export function buildPdfFileName(options: ExportOptions, fallback: string): string {
  const raw = (options.fileName.trim() || fallback).replace(/[\\/:*?"<>|]+/g, '_');
  return raw.toLowerCase().endsWith('.pdf') ? raw : `${raw}.pdf`;
}

interface ExportOptionsPanelProps {
  value: ExportOptions;
  onChange: (next: ExportOptions) => void;
}

export default function ExportOptionsPanel({ value, onChange }: ExportOptionsPanelProps) {
  const set = <K extends keyof ExportOptions>(key: K, v: ExportOptions[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <details className="export-options" open>
      <summary>Opsi Export PDF</summary>

      <div className="export-options-grid">
        <label className="export-check">
          <input
            type="checkbox"
            checked={value.showLogos}
            onChange={(e) => set('showLogos', e.target.checked)}
          />
          Tampilkan logo infraNexia &amp; TelkomAkses
        </label>

        <label>
          Ukuran logo
          <select
            value={value.logoSize}
            disabled={!value.showLogos}
            onChange={(e) => set('logoSize', e.target.value as LogoSize)}
          >
            <option value="kecil">Kecil</option>
            <option value="sedang">Sedang (standar)</option>
            <option value="besar">Besar</option>
          </select>
        </label>

        <label>
          Kolom foto per halaman
          <select
            value={String(value.columns)}
            onChange={(e) =>
              set('columns', e.target.value === 'auto' ? 'auto' : (Number(e.target.value) as 2 | 3))
            }
          >
            <option value="auto">Otomatis</option>
            <option value="2">2 kolom (4 foto/halaman)</option>
            <option value="3">3 kolom (6 foto/halaman)</option>
          </select>
        </label>

        <label>
          Kualitas PDF
          <select
            value={value.quality}
            onChange={(e) => set('quality', e.target.value as PdfQuality)}
          >
            {(Object.keys(QUALITY_PRESETS) as PdfQuality[]).map((q) => (
              <option key={q} value={q}>
                {QUALITY_PRESETS[q].label}
              </option>
            ))}
          </select>
        </label>

        <label className="export-check">
          <input
            type="checkbox"
            checked={value.showPageNumber}
            onChange={(e) => set('showPageNumber', e.target.checked)}
          />
          Tampilkan nomor halaman
        </label>

        <label>
          Nama file (opsional)
          <input
            type="text"
            value={value.fileName}
            placeholder="Kosong = otomatis dari lokasi"
            onChange={(e) => set('fileName', e.target.value)}
          />
        </label>

        <p className="export-options-hint">
          Pengaturan ini hanya memengaruhi tampilan pratinjau dan hasil PDF. Data foto tidak berubah.
        </p>
      </div>
    </details>
  );
}