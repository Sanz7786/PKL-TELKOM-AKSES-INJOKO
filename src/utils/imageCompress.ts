/**
 * Mengompres gambar dengan cara mengecilkan resolusi dan menurunkan kualitas JPEG.
 * Tidak butuh library tambahan, cukup Canvas API bawaan browser.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.6
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