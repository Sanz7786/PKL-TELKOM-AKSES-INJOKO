/**
 * Logo tetap untuk semua dokumen PDF (LACT & BAUT).
 * Karyawan tidak perlu memasang logo satu per satu.
 *
 * File logo diletakkan di:  public/logos/
 *   - logo-infranexia.png   (kiri)
 *   - logo-telkomakses.png  (kanan)
 *
 * Kedua PNG dibuat dari file logo resolusi tinggi (8000 px) dan sudah disiapkan:
 *   - latar transparan (tepi bersih, tanpa halo putih),
 *   - dipotong rapat di kiri-kanan (tepi logo pas dengan margin halaman),
 *   - tinggi kanvas SAMA (300 px) dan garis dasar teks SEJAJAR,
 *   - ukuran relatif TelkomAkses : infraNexia = 1,37 : 1, sama dengan
 *     header template Word (lebar 124 px : 93 px).
 * Karena itu, di kode kedua logo cukup diberi TINGGI yang sama; lebarnya
 * menyesuaikan sendiri sehingga tidak ada yang gepeng.
 *
 * Mau pakai file lain (mis. SVG resmi dari Telkom)? Taruh di public/logos/
 * lalu ganti ekstensinya di bawah, mis. 'logo-infranexia.svg'. Kalau memakai
 * SVG, pastikan file punya atribut width & height, dan PNG tetap lebih aman
 * untuk hasil export PDF.
 */
const BASE = import.meta.env.BASE_URL;

export const LOGO_FILES = {
  left: 'logo-infranexia.png',
  right: 'logo-telkomakses.png',
} as const;

export interface BrandLogo {
  src: string;
  alt: string;
  /**
   * Pengali tinggi khusus logo ini (default 1). Ubah hanya kalau ada file logo
   * pengganti yang proporsinya berbeda. Nilai kecil saja (mis. 0.95 atau 1.05):
   * kedua logo diratakan di tengah, jadi selisih besar akan menggeser garis dasar.
   */
  scale: number;
}

export const BRAND: { left: BrandLogo; right: BrandLogo } = {
  left: { src: `${BASE}logos/${LOGO_FILES.left}`, alt: 'infraNexia', scale: 1 },
  right: { src: `${BASE}logos/${LOGO_FILES.right}`, alt: 'TelkomAkses', scale: 1 },
};

/**
 * Tinggi kotak logo dalam px pada lebar halaman 794 px (A4).
 * "sedang" (44 px ≈ 11,6 mm): lebar infraNexia ≈ 99 px dan TelkomAkses ≈ 132 px,
 * sama dengan proporsi logo di header template Word / dokumen LACT resmi.
 */
export const LOGO_HEIGHT_PX = { kecil: 35, sedang: 44, besar: 55 } as const;
export type LogoSize = keyof typeof LOGO_HEIGHT_PX;