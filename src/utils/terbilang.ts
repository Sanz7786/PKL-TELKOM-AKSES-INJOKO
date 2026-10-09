/**
 * Konversi angka ke ejaan Bahasa Indonesia (mis. 8 -> "Delapan",
 * 2026 -> "Dua Ribu Dua Puluh Enam") dan nama hari/bulan Indonesia.
 * Dipakai untuk mengisi otomatis kalimat "Pada hari ini ... tanggal ...
 * bulan ... tahun ..." di Berita Acara, dari SATU input tanggal saja.
 */

const SATUAN = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];

function terbilangLower(n: number): string {
  if (n < 0) return `minus ${terbilangLower(-n)}`;
  if (n === 0) return 'nol';
  if (n < 10) return SATUAN[n];
  if (n < 20) return n === 10 ? 'sepuluh' : n === 11 ? 'sebelas' : `${SATUAN[n - 10]} belas`;
  if (n < 100) {
    const puluh = Math.floor(n / 10);
    const sisa = n % 10;
    return `${SATUAN[puluh]} puluh${sisa ? ` ${terbilangLower(sisa)}` : ''}`;
  }
  if (n < 200) return `seratus${n - 100 ? ` ${terbilangLower(n - 100)}` : ''}`;
  if (n < 1000) {
    const ratus = Math.floor(n / 100);
    const sisa = n % 100;
    return `${SATUAN[ratus]} ratus${sisa ? ` ${terbilangLower(sisa)}` : ''}`;
  }
  if (n < 2000) return `seribu${n - 1000 ? ` ${terbilangLower(n - 1000)}` : ''}`;
  if (n < 1000000) {
    const ribu = Math.floor(n / 1000);
    const sisa = n % 1000;
    return `${terbilangLower(ribu)} ribu${sisa ? ` ${terbilangLower(sisa)}` : ''}`;
  }
  // Di luar rentang wajar untuk tanggal/tahun dokumen; dikembalikan apa adanya.
  return String(n);
}

/** "Title Case" tiap kata, sesuai gaya penulisan di dokumen resmi (mis. "Dua Ribu Dua Puluh Enam"). */
export function terbilang(n: number): string {
  return terbilangLower(n)
    .split(' ')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');
}

export const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jumat", 'Sabtu'];
export const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

/** Parse "YYYY-MM-DD" (dari <input type="date">) sebagai tanggal LOKAL, bukan UTC,
 *  supaya tidak bergeser sehari di zona waktu tertentu. */
export function parseDateLocal(iso: string): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export interface TanggalKata {
  hari: string;    // "Selasa"
  tanggal: string; // "Delapan"
  bulan: string;   // "September"
  tahun: string;   // "Dua Ribu Dua Puluh Enam"
  /** Format numerik untuk baris tanda tangan, mis. "8 September 2026" */
  singkat: string;
}

export function formatTanggalKata(date: Date): TanggalKata {
  return {
    hari: NAMA_HARI[date.getDay()],
    tanggal: terbilang(date.getDate()),
    bulan: NAMA_BULAN[date.getMonth()],
    tahun: terbilang(date.getFullYear()),
    singkat: `${date.getDate()} ${NAMA_BULAN[date.getMonth()]} ${date.getFullYear()}`,
  };
}