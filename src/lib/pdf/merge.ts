import { PDFDocument } from "pdf-lib";

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  if (files.length < 2) {
    throw new Error("Unggah minimal 2 file PDF untuk digabung.");
  }

  const out = await PDFDocument.create();
  out.setTitle("Gabungan PDF");
  out.setProducer("PDFKilat");
  out.setCreator("PDFKilat");

  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let src;
    try{src=await PDFDocument.load(bytes);}catch{throw new Error(`${file.name}: PDF tidak dapat dibaca atau dilindungi password.`);}
    const form=src.getForm();
    if(form.getFields().length)form.flatten();
    const copied = await out.copyPages(src, src.getPageIndices());
    copied.forEach((page) => out.addPage(page));
  }

  return out.save({ useObjectStreams: true });
}
