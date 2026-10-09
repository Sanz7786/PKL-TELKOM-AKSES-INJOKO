import { useState } from 'react';
import { BRAND, LOGO_HEIGHT_PX, type LogoSize } from '../config/brand';

interface PdfHeaderProps {
  showLogos: boolean;
  logoSize: LogoSize;
}

function Logo({ src, alt, height }: { src: string; alt: string; height: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="pdf-logo-text">{alt}</span>;
  return (
    <img
      src={src}
      alt={alt}
      style={{ height: `${height}px`, width: 'auto', display: 'block' }}
      onError={() => setFailed(true)}
    />
  );
}

/**
 * Kedua logo diberi TINGGI yang sama (bukan lebar masing-masing secara manual).
 * File di public/logos/ sudah dipotong rapat dengan kanvas setinggi 300px dan
 * garis dasar teks yang SEJAJAR (lihat komentar di src/config/brand.ts), jadi
 * dengan tinggi sama, lebar tiap logo otomatis mengikuti proporsi aslinya dan
 * garis dasarnya tetap sejajar — tidak perlu diatur manual per sisi.
 */
export default function PdfHeader({ showLogos, logoSize }: PdfHeaderProps) {
  if (!showLogos) return null;

  const h = LOGO_HEIGHT_PX[logoSize] ?? LOGO_HEIGHT_PX.sedang;

  return (
    <div
      className="pdf-header"
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
    >
      <Logo src={BRAND.left.src} alt={BRAND.left.alt} height={h * BRAND.left.scale} />
      <Logo src={BRAND.right.src} alt={BRAND.right.alt} height={h * BRAND.right.scale} />
    </div>
  );
}