import PdfHeader from './PdfHeader';
import type { LogoSize } from '../config/brand';
import '../assets/style_DaftarIsi.css';

export interface DaftarIsiItem {
  id: string;
  text: string;
}

interface DaftarIsiPageProps {
  showLogos: boolean;
  logoSize: LogoSize;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  items: DaftarIsiItem[];
  /** 'lact' = tampilan mengikuti Daftar Isi LACT asli; 'default' = BAUT */
  variant?: 'lact' | 'default';
  /** Footer "Page X of Y" (hanya varian LACT). Kosongkan nomor untuk menyembunyikan footer. */
  pageNumber?: string;
  pageTotal?: string;
}

export default function DaftarIsiPage({
  showLogos,
  logoSize,
  titleLine1,
  titleLine2,
  titleLine3,
  items,
  variant = 'default',
  pageNumber = '',
  pageTotal = '',
}: DaftarIsiPageProps) {
  const isLact = variant === 'lact';
  return (
    <div className={`pdf-page pdf-toc-page${isLact ? ' pdf-toc-lact' : ''}`}>
      <PdfHeader showLogos={showLogos} logoSize={logoSize} />

      <h1 className="pdf-toc-title">
        {titleLine1}
        <br />
        {titleLine2}
        <br />
        {titleLine3}
      </h1>

      <ol className="pdf-toc-list">
        {items.map((item, index) => (
          <li key={item.id} className="pdf-toc-item">
            <span className="pdf-toc-item-number">{index + 1}.</span>
            <span>{item.text}</span>
          </li>
        ))}
      </ol>

      {isLact && pageNumber.trim() !== '' && (
        <div className="pdf-toc-footer">
          Page {pageNumber.trim()} of{pageTotal.trim() ? ` ${pageTotal.trim()}` : ''}
        </div>
      )}
    </div>
  );
}