import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Mengambil "screenshot" dari elemen preview di layar, lalu menyusunnya
 * menjadi file PDF (otomatis pecah ke beberapa halaman kalau kontennya panjang).
 * Karena sumbernya sama dengan yang dilihat user di preview, hasil PDF
 * dijamin sama persis dengan yang di-preview.
 */
export async function generatePdfFromElement(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Elemen dengan id "${elementId}" tidak ditemukan`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
  });

  // Kompresi ke JPEG kualitas 0.7 supaya ukuran PDF tidak terlalu besar
  const imgData = canvas.toDataURL('image/jpeg', 0.7);

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfPageHeight = pdf.internal.pageSize.getHeight();
  const imgHeightInPdf = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeightInPdf;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf);
  heightLeft -= pdfPageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeightInPdf;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf);
    heightLeft -= pdfPageHeight;
  }

  pdf.save(fileName);
}