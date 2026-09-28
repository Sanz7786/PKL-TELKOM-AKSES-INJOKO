import { useState } from 'react';
import { BRAND, type LogoSize } from '../config/brand';

interface PdfHeaderProps {
  showLogos: boolean;
  logoSize: LogoSize;
}

/**
 * Lebar logo (px, pada halaman A4 selebar 794 px). Tinggi mengikuti otomatis.
 * Proporsi TelkomAkses : infraNexia = 1,37 : 1, sama dengan dokumen resmi.
 * Kalau terasa kurang pas, cukup ubah angka di sini.
 */
const LOGO_WIDTH_PX: Record<LogoSize, { left: number; right: number }> = {
  kecil: { left: 88, right: 120 },
  sedang: { left: 108, right: 148 },
  besar: { left: 135, right: 185 },
};

function Logo({ src, alt, width }: { src: string; alt: string; width: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="pdf-logo-text">{alt}</span>;
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: `${width}px`, height: 'auto', display: 'block' }}
      onError={() => setFailed(true)}
    />
  );
}

export default function PdfHeader({ showLogos, logoSize }: PdfHeaderProps) {
  if (!showLogos) return null;

  const w = LOGO_WIDTH_PX[logoSize] ?? LOGO_WIDTH_PX.sedang;

  return (
    <div
      className="pdf-header"
      // flex-end: dasar kedua logo sejajar, seperti di dokumen resmi
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
    >
      <Logo src={BRAND.left.src} alt={BRAND.left.alt} width={w.left * BRAND.left.scale} />
      <Logo src={BRAND.right.src} alt={BRAND.right.alt} width={w.right * BRAND.right.scale} />
    </div>
  );
}
