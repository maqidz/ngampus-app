import { PDFDocument } from 'pdf-lib';
import { canvasBytes, freeCanvas } from './image';

// Load only the renderer needed by the selected document. No Office runtime download.
export async function officeToPdf(file: File, progress: (text: string) => void, quality = 90) {
  if (file.size > 20 * 1024 * 1024) throw new Error('Maksimal ukuran dokumen 20 MB.');
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext !== 'pptx' && ext !== 'docx') throw new Error('Simpan dokumen sebagai PPTX atau DOCX terlebih dahulu.');
  const pdf = await PDFDocument.create();
  const scale = quality >= 100 ? 2 : quality >= 90 ? 1.5 : 1;
  async function addCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
    try {
      const image = await pdf.embedJpg(await canvasBytes(canvas, 'image/jpeg', quality / 100));
      pdf.addPage([width, height]).drawImage(image, { x: 0, y: 0, width, height });
    } finally { freeCanvas(canvas); }
  }
  progress('Membaca dokumen…');
  if (ext === 'pptx') {
    const { PptxRenderer } = await import('pptx-browser');
    const renderer = new PptxRenderer();
    try {
      await renderer.load(file);
      if (!renderer.slideCount || renderer.slideCount > 50) throw new Error('Pilih presentasi dengan 1–50 slide.');
      await document.fonts.ready;
      for (let i = 0; i < renderer.slideCount; i++) {
        progress(`Memproses slide ${i + 1} dari ${renderer.slideCount}…`);
        const canvas = document.createElement('canvas');
        try {
          await renderer.renderSlide(i, canvas, Math.round(1280 * scale));
          await addCanvas(canvas, 960, 960 * canvas.height / canvas.width);
        } finally { freeCanvas(canvas); }
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    } finally { renderer.destroy(); }
  } else {
    const [{ renderAsync }, { default: html2canvas }] = await Promise.all([import('docx-preview'), import('html2canvas')]);
    // Isolate document styles from the app, and forbid scripts and remote resources.
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-same-origin');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;left:-20000px;top:0;width:1200px;height:1600px;border:0;pointer-events:none';
    document.body.appendChild(frame);
    try {
      const doc = frame.contentDocument!;
      doc.open();
      doc.write('<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data: blob:; font-src data: blob:; style-src \'unsafe-inline\'"></head><body></body></html>');
      doc.close();
      await renderAsync(await file.arrayBuffer(), doc.body, doc.head, { inWrapper: false, useBase64URL: true, renderAltChunks: false, ignoreLastRenderedPageBreak: false });
      await doc.fonts.ready;
      await Promise.all(Array.from(doc.images).map(image => image.decode().catch(() => undefined)));
      const pages = Array.from(doc.querySelectorAll<HTMLElement>('section.docx'));
      if (!pages.length || pages.length > 50) throw new Error('Pilih dokumen dengan 1–50 halaman.');
      for (let i = 0; i < pages.length; i++) {
        progress(`Memproses halaman ${i + 1} dari ${pages.length}…`);
        const page = pages[i];
        const width = page.offsetWidth, height = page.scrollHeight;
        if (!width || !height || height > 16000) throw new Error('Halaman terlalu panjang. Tambahkan pemisah halaman di Word.');
        const canvas = await html2canvas(page, { scale: Math.min(scale, 3200 / Math.max(width, height)), backgroundColor: '#ffffff', logging: false, height });
        await addCanvas(canvas, width * .75, height * .75);
      }
    } finally { frame.remove(); }
  }
  return pdf.save({ useObjectStreams: true });
}
