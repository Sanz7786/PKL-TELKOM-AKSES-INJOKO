import PdfHeader from './PdfHeader';
import type { LogoSize } from '../config/brand';
import type { ProjectData } from '../types/evidence';
import { formatTanggalKata, parseDateLocal } from '../utils/terbilang';
import '../assets/style_Evidence.css';
import '../assets/style_BeritaAcara.css';

export interface ChoicePair {
  /** [teks jika dipilih pertama, teks jika dipilih kedua] */
  labels: [string, string];
  /** 0 = pilihan pertama, 1 = pilihan kedua */
  selected: 0 | 1;
}

interface BeritaAcaraPageProps {
  showLogos: boolean;
  logoSize: LogoSize;
  docTitle: string; // judul halaman, mis. "LAPORAN COMMISIONING TEST"
  project: ProjectData;
  tanggalISO: string; // dari <input type="date">
  nama: string;
  nik: string;
  jabatanBaris1: string; // mis. "WASPANG"
  jabatanBaris2: string; // mis. "PT. TELKOM AKSES"
  kota: string; // mis. "Surabaya"
  choice1: ChoicePair;
  choice2a: ChoicePair;
  choice2b: ChoicePair;
  closingText: string;
  signatureDataUrl: string | null;
  /** 'lact' = tampilan mengikuti Laporan Commisioning Test asli; 'default' = BAUT */
  variant?: 'lact' | 'default';
  /** Footer "Page X of Y" (hanya dipakai varian LACT). Kosongkan nomor untuk menyembunyikan footer. */
  pageNumber?: string;
  pageTotal?: string;
}

/** Menampilkan satu pasangan pilihan coret, mis. "telah / ~~belum~~" */
function Choice({ labels, selected }: ChoicePair) {
  return (
    <>
      <span className={selected === 0 ? 'pdf-ba-choice-selected' : 'pdf-ba-choice-unselected'}>
        {labels[0]}
      </span>
      {' / '}
      <span className={selected === 1 ? 'pdf-ba-choice-selected' : 'pdf-ba-choice-unselected'}>
        {labels[1]}
      </span>
    </>
  );
}

export default function BeritaAcaraPage({
  showLogos,
  logoSize,
  docTitle,
  project,
  tanggalISO,
  nama,
  nik,
  jabatanBaris1,
  jabatanBaris2,
  kota,
  choice1,
  choice2a,
  choice2b,
  closingText,
  signatureDataUrl,
  variant = 'default',
  pageNumber = '',
  pageTotal = '',
}: BeritaAcaraPageProps) {
  const isLact = variant === 'lact';
  const tgl = parseDateLocal(tanggalISO);
  const kata = tgl
    ? formatTanggalKata(tgl)
    : { hari: '…', tanggal: '…', bulan: '…', tahun: '…', singkat: '…' };

  return (
    <div className={`pdf-page pdf-ba-page${isLact ? ' pdf-ba-lact' : ''}`}>
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

      <p className="pdf-ba-paragraph">
        Pada hari ini <b>{kata.hari}</b> tanggal <b>{kata.tanggal}</b> bulan <b>{kata.bulan}</b>{' '}
        tahun <b>{kata.tahun}</b> yang bertanda tangan di bawah ini&nbsp;:
      </p>

      <div className="pdf-ba-signer">
        <div className="pdf-ba-signer-row">
          <span className="pdf-ba-signer-label">Nama</span>
          <span className="pdf-ba-signer-colon">:</span>
          <span>{nama}</span>
        </div>
        <div className="pdf-ba-signer-row">
          <span className="pdf-ba-signer-label">NIK</span>
          <span className="pdf-ba-signer-colon">:</span>
          <span>{nik}</span>
        </div>
        <div className="pdf-ba-signer-row">
          <span className="pdf-ba-signer-label">Jabatan</span>
          <span className="pdf-ba-signer-colon">:</span>
          <span>
            {jabatanBaris1} {jabatanBaris2}
          </span>
        </div>
      </div>

      <p className="pdf-ba-paragraph">
        Sehubungan dengan <b className="pdf-ba-strong">{project.proyek}</b> menerangkan bahwa telah melaksanakan pemeriksaan
        kesisteman (Commisioning Test) dan fisik pada lokasi <b className="pdf-ba-strong">{project.lokasi}</b> sebagai
        berikut&nbsp;:
      </p>

      {isLact ? (
        <div className="pdf-ba-items">
          <div className="pdf-ba-item">
            <span className="pdf-ba-item-num">1.</span>
            <span>
              Pelaksanaan pekerjaan <Choice {...choice1} /> diselesaikan dengan spesifikasi teknis
              TELKOM
            </span>
          </div>
          <div className="pdf-ba-item">
            <span className="pdf-ba-item-num">2.</span>
            <span>
              Hasil pekerjaan <Choice {...choice2a} /> diterima dan <Choice {...choice2b} /> untuk
              diajukan Uji Terima (UT)
            </span>
          </div>
        </div>
      ) : (
        <ol className="pdf-ba-numbered">
          <li>
            Pelaksanaan pekerjaan <Choice {...choice1} /> diselesaikan dengan spesifikasi teknis
            TELKOM
          </li>
          <li>
            Hasil pekerjaan <Choice {...choice2a} /> diterima dan <Choice {...choice2b} /> untuk
            diajukan Uji Terima (UT)
          </li>
        </ol>
      )}

      <p className="pdf-ba-paragraph pdf-ba-closing">{closingText}</p>

      <div className="pdf-ba-sign-wrap">
        <div className="pdf-ba-sign-block">
          <p>
            {kota || '…'}, {kata.singkat}
          </p>
          <p>{jabatanBaris1}</p>
          <p>{jabatanBaris2}</p>

          <div className="pdf-ba-sign-space">
            {signatureDataUrl && <img src={signatureDataUrl} alt="Tanda tangan" />}
          </div>

          <p className="pdf-ba-sign-name">{nama}</p>
          <p>NIK. {nik}</p>
        </div>
      </div>

      {isLact && pageNumber.trim() !== '' && (
        <div className="pdf-ba-footer">
          Page {pageNumber.trim()} of{pageTotal.trim() ? ` ${pageTotal.trim()}` : ''}
        </div>
      )}
    </div>
  );
}
