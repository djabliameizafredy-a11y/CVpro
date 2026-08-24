'use client';

import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportToPdf(elementId: string = 'cv-preview-container', fileName: string = 'CV'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('CV element not found');
  }

  // Generate PNG data URL using html-to-image (browser native foreignObject rendering)
  const imgData = await toPng(element, {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  // Calculate dimensions for A4 PDF page
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = 210;
  const pdfHeight = 297;

  // Create image element to calculate aspect ratio height
  const img = new Image();
  img.src = imgData;
  await new Promise((resolve) => {
    img.onload = resolve;
  });

  const imgWidth = pdfWidth;
  const imgHeight = (img.height * pdfWidth) / img.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Multi-page overflow handling
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  const cleanFileName = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`${cleanFileName}.pdf`);
}

export async function exportToImage(
  elementId: string = 'cv-preview-container',
  fileName: string = 'CV',
  format: 'png' | 'jpeg' = 'png'
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('CV element not found');
  }

  const imgData = await toPng(element, {
    quality: 0.98,
    pixelRatio: 3, // High DPI render
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  const downloadLink = document.createElement('a');
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadLink.download = `${cleanFileName}.${format}`;
  downloadLink.href = imgData;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
