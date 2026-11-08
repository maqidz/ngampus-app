"use client";
import { useEffect, useRef, useState } from "react";
import { imageCanvas,canvasBytes,freeCanvas } from "@/lib/pdf/image";
import { downloadBytes } from "@/lib/bytes";
import { PDFDocument } from "pdf-lib";
type Scan = { id: string; file: File; url: string; rotation: number };
export function Scanner() {
  const [pages,setPages] = useState<Scan[]>([]);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState("");
  const [grayscale,setGrayscale] = useState(false);
  const urls = useRef(new Set<string>());
  useEffect(()=> { const current = urls.current; return ()=>current.forEach(url=>URL.revokeObjectURL(url)); },[]);
  function add(files: FileList | null) {
    if (!files) return;
    const incoming = Array.from(files);
    if (pages.length + incoming.length > 20 || incoming.some(f=>!['image/jpeg','image/png','image/webp'].includes(f.type) || f.size > 20*1024*1024)) {
      setError("Pilih JPG, PNG, atau WebP, maksimal 20 MB per gambar dan 20 halaman."); return;
    }
    setError("");
    setPages(prev=>[...prev,...incoming.map(file=>{ const url=URL.createObjectURL(file); urls.current.add(url); return {id:crypto.randomUUID(),file,url,rotation:0}; })]);
  }
  function move(index: number, step: number) {
    setPages(prev=>{const next=[...prev]; [next[index],next[index+step]]=[next[index+step],next[index]];return next;});
  }
  async function download() {
    setBusy(true); setError("");
    try {
      const pdf = await PDFDocument.create();
      for (const scan of pages) {
        const canvas=await imageCanvas(scan.file,scan.rotation,grayscale);
        let image;
        try{image=await pdf.embedJpg(await canvasBytes(canvas));}finally{freeCanvas(canvas);}
        const page=pdf.addPage([595.28,841.89]); const ratio=Math.min(555.28/image.width,801.89/image.height);
        page.drawImage(image,{x:(595.28-image.width*ratio)/2,y:(841.89-image.height*ratio)/2,width:image.width*ratio,height:image.height*ratio});
      }
      downloadBytes(await pdf.save({useObjectStreams:true}),'scan-dokumen.pdf');
    } catch {setError("Gambar tidak dapat diproses. Coba gunakan gambar lain atau kurangi jumlah halaman.");}
    finally {setBusy(false);}
  }
  return <div className="space-y-4">
    <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
      <label className="block rounded-xl border border-line bg-white p-4">Ambil foto<input aria-label="Ambil foto dokumen" className="mt-2 block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={e=>{add(e.target.files);e.target.value='';}} /></label>
      <label className="block rounded-xl border border-line bg-white p-4">Pilih gambar<input aria-label="Pilih gambar dokumen" className="mt-2 block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>{add(e.target.files);e.target.value='';}} /></label>
      <p className="text-sm text-muted">Maksimal 20 halaman, 20 MB per gambar. Urutan di bawah mengikuti urutan PDF.</p>
      <ol className="space-y-3">{pages.map((p,i)=><li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white p-3">
        {/* Local object URLs provide previews without uploading files. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.url} alt={`Halaman ${i+1}`} className="h-20 w-20 object-contain" style={{transform:`rotate(${p.rotation}deg)`}} />
        <span className="min-w-0 flex-1 break-all text-sm">{i+1}. {p.file.name}</span>
        <button type="button" disabled={i===0} onClick={()=>move(i,-1)} className="p-2 disabled:opacity-30" aria-label={`Naikkan halaman ${i+1}`}>↑</button>
        <button type="button" disabled={i===pages.length-1} onClick={()=>move(i,1)} className="p-2 disabled:opacity-30" aria-label={`Turunkan halaman ${i+1}`}>↓</button>
        <button type="button" className="p-2 text-sm" onClick={()=>setPages(prev=>prev.map(s=>s.id===p.id?{...s,rotation:(s.rotation+90)%360}:s))}>Putar</button>
        <button type="button" className="p-2 text-sm text-red-700" onClick={()=>{URL.revokeObjectURL(p.url);urls.current.delete(p.url);setPages(prev=>prev.filter(s=>s.id!==p.id));}}>Hapus</button>
      </li>)}</ol>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={grayscale} onChange={e=>setGrayscale(e.target.checked)} />Hitam putih dengan kontras lebih tinggi</label>
    </fieldset>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy || !pages.length} onClick={download} className="w-full rounded-lg bg-accent px-5 py-3 font-medium text-white disabled:opacity-40">{busy?'Memproses…':'Unduh PDF'}</button>
  </div>;
}
