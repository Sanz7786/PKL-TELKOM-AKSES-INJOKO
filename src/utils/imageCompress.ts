/**
 * Ambang batas ukuran foto asli. Di atas ini, foto diarahkan ke menu Kompres Foto
 * sebelum bisa dipakai (lihat redirectToCompress di EvidenceForm.tsx).
 */
export const MAX_ORIGINAL_MB = 100;
export const MAX_ORIGINAL_BYTES = MAX_ORIGINAL_MB * 1024 * 1024;

/** Format ukuran file jadi teks yang gampang dibaca, mis. "12.3 MB" */
export function formatBytes(bytes: number): string {
  if (bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex++;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Membuat preview RINGAN (dikecilkan) dari sebuah foto, dipakai untuk tampilan
 * di layar (form & preview) supaya cepat & tidak berat. Kualitas foto ASLI
 * (full resolusi) tetap disimpan terpisah lewat field `file` di EvidenceItem,
 * dan itu yang dipakai saat export ke PDF (lihat utils/pdfFromElement.ts).
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.75
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas tidak didukung di browser ini'));
          return;
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };

      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}