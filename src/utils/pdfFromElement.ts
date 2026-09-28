import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PdfQualitySetting {
  /** Ketajaman screenshot tiap halaman (2 = hemat, 3 = tajam). */
  scale: number;
  /** Kualitas JPEG 0-1 (makin kecil, file makin ringan). */
  jpeg: number;
}

const DEFAULT_QUALITY: PdfQualitySetting = { scale: 3, jpeg: 0.85 };

function swapImageSrc(img: HTMLImageElement, url: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
    };
    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('Gagal memuat foto asli'));
    };
    img.addEventListener('load', onLoad);
    img.addEventListener('error', onError);
    img.src = url;
  });
}

/** Pastikan semua gambar (termasuk logo) sudah selesai dimuat sebelum discreenshot. */
async function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true });
            img.addEventListener('error', () => resolve(), { once: true });
          })
    )
  );
}

/**
 * Mengambil "screenshot" dari SETIAP elemen .pdf-page di dalam elemen preview,
 * lalu menjadikan tiap screenshot itu SATU HALAMAN PDF TERPISAH. Ini supaya
 * batas antar halaman selalu jatuh di antara halaman (bukan memotong tengah
 * kotak foto).
 *
 * SEBELUM discreenshot, setiap foto evidence yang punya versi ASLI (di `originals`,
 * dikunci berdasarkan id evidence-nya) akan DIGANTI SEMENTARA dari versi ringan
 * (yang dipakai di layar) ke versi resolusi penuh, supaya hasil PDF-nya tajam.
 * Setelah proses selesai (atau terjadi error), tampilan di layar dikembalikan
 * lagi ke versi ringan.
 *
 * Catatan: html2canvas tidak menerapkan CSS `object-fit`, jadi proporsi foto
 * dijaga lewat ukuran otomatis + tinggi maksimal di EvidencePreview.tsx
 * dan style_Evidence.css (bukan lewat object-fit).
 *
 * `quality` opsional (dari panel "Opsi Export PDF"); kosong = standar.
 */
export async function generatePdfFromElement(
  elementId: string,
  fileName: string,
  originals: Record<string, Blob> = {},
  onProgress?: (done: number, total: number) => void,
  quality: PdfQualitySetting = DEFAULT_QUALITY
): Promise<void> {
  const container = document.getElementById(elementId);
  if (!container) {
    throw new Error(`Elemen dengan id "${elementId}" tidak ditemukan`);
  }

  const pageEls = Array.from(container.querySelectorAll('.pdf-page')) as HTMLElement[];
  if (pageEls.length === 0) {
    throw new Error('Tidak ada halaman untuk diekspor');
  }

  // Cari semua foto evidence (di semua halaman) yang punya versi asli untuk diganti sementara
  const imgEls = Array.from(
    container.querySelectorAll('img[data-evidence-id]')
  ) as HTMLImageElement[];
  const targets = imgEls.filter((img) => originals[img.dataset.evidenceId ?? '']);

  const previousSrc = new Map<HTMLImageElement, string>();
  const objectUrls: string[] = [];

  try {
    const total = targets.length;
    let done = 0;
    onProgress?.(done, total);

    for (const img of targets) {
      const blob = originals[img.dataset.evidenceId as string];
      previousSrc.set(img, img.src);

      const objectUrl = URL.createObjectURL(blob);
      objectUrls.push(objectUrl);

      await swapImageSrc(img, objectUrl);

      done++;
      onProgress?.(done, total);
    }

    await waitForImages(container);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pageEls.length; i++) {
      const canvas = await html2canvas(pageEls[i], {
        scale: quality.scale,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', quality.jpeg);

      // Lebar penuh; kalau kelewat tinggi, perkecil proporsional agar tidak terpotong
      let w = pageW;
      let h = (canvas.height * w) / canvas.width;
      if (h > pageH) {
        h = pageH;
        w = (canvas.width * h) / canvas.height;
      }
      const x = (pageW - w) / 2;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', x, 0, w, h);
    }

    pdf.save(fileName);
  } finally {
    previousSrc.forEach((src, img) => {
      img.src = src;
    });
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }
}