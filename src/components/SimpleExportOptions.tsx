import type { LogoSize } from '../config/brand';
import { QUALITY_PRESETS, type PdfQuality } from './ExportOptions';
import '../assets/style_ExportOptions.css';

/**
 * Versi ringkas dari "Opsi Export PDF", untuk halaman SATU HALAMAN / SATU
 * GAMBAR (Cover, Daftar Isi, Laporan Commisioning Test, BOQ, Data Pengukuran
 * OPM, Mancore, KML). Opsi "kolom foto per halaman" dan "nomor halaman" dari
 * ExportOptions.tsx sengaja TIDAK disertakan di sini karena tidak relevan —
 * halaman-halaman ini bukan grid foto bertingkat seperti Lampiran Evidence.
 *
 * `quality` dan `fileName` memakai tipe & daftar pilihan (QUALITY_PRESETS)
 * yang SAMA dengan ExportOptions.tsx, supaya hasilnya konsisten di seluruh
 * aplikasi — bukan diukur ulang dengan angka lain.
 */
export interface SimpleExportOptions {
  showLogos: boolean;
  logoSize: LogoSize;
  quality: PdfQuality;
  /** Nama file tanpa ".pdf". Kosong = otomatis. */
  fileName: string;
}

export const DEFAULT_SIMPLE_EXPORT_OPTIONS: SimpleExportOptions = {
  showLogos: true,
  logoSize: 'sedang',
  quality: 'standar',
  fileName: '',
};

interface SimpleExportOptionsPanelProps {
  value: SimpleExportOptions;
  onChange: (next: SimpleExportOptions) => void;
}

export default function SimpleExportOptionsPanel({ value, onChange }: SimpleExportOptionsPanelProps) {
  const set = <K extends keyof SimpleExportOptions>(key: K, v: SimpleExportOptions[K]) =>
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
          Kualitas PDF
          <select value={value.quality} onChange={(e) => set('quality', e.target.value as PdfQuality)}>
            {(Object.keys(QUALITY_PRESETS) as PdfQuality[]).map((q) => (
              <option key={q} value={q}>
                {QUALITY_PRESETS[q].label}
              </option>
            ))}
          </select>
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
          Pengaturan ini hanya memengaruhi tampilan logo dan kualitas hasil PDF. Data yang sudah
          diisi tidak berubah.
        </p>
      </div>
    </details>
  );
}