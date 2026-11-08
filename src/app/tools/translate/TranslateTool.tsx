"use client";
import {useEffect,useState} from "react";
type TranslatorSession={translate:(text:string)=>Promise<string>;destroy:()=>void};
type TranslatorFactory={create:(options:{sourceLanguage:string;targetLanguage:string})=>Promise<TranslatorSession>};
const languages=[['id','Indonesia'],['en','Inggris'],['es','Spanyol'],['fr','Prancis'],['de','Jerman'],['ja','Jepang'],['ko','Korea'],['zh','Mandarin'],['ar','Arab']];
export function TranslateTool(){
 const [file,setFile]=useState<File|null>(null),[source,setSource]=useState('en'),[target,setTarget]=useState('id');
 const [supported,setSupported]=useState(false),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[result,setResult]=useState<string[]>([]);
 useEffect(()=>setSupported('Translator' in window),[]);
 async function run(){
  if(!file)return;setBusy(true);setError('');setResult([]);setStatus('Menyiapkan bahasa. Paket bahasa mungkin perlu diunduh…');
  let translator:TranslatorSession|undefined;let doc:import('pdfjs-dist').PDFDocumentProxy|undefined;let loading:import('pdfjs-dist').PDFDocumentLoadingTask|undefined;
  try{
   // Create directly from the click gesture, before parsing the document.
   translator=await (window as unknown as {Translator:TranslatorFactory}).Translator.create({sourceLanguage:source,targetLanguage:target});
   const pdfjs=await import('pdfjs-dist');pdfjs.GlobalWorkerOptions.workerSrc='/pdf.worker.min.mjs';
   loading=pdfjs.getDocument({data:await file.arrayBuffer()});doc=await loading.promise;
   if(doc.numPages>30)throw new Error('Maksimal 30 halaman per dokumen.');
   const output:string[]=[];
   for(let i=1;i<=doc.numPages;i++){
    setStatus(`Menerjemahkan halaman ${i} dari ${doc.numPages}…`);
    const page=await doc.getPage(i);const content=await page.getTextContent();
    const text=content.items.map(item=>'str' in item?item.str+(item.hasEOL?'\n':' '):'').join('').trim();
    if(!text)throw new Error(`Halaman ${i} tidak memiliki teks. PDF scan memerlukan OCR terlebih dahulu.`);
    if(text.length>50000)throw new Error('Teks halaman terlalu panjang. Pisahkan dokumen terlebih dahulu.');
    const translated:string[]=[];
    for(let offset=0;offset<text.length;){let end=Math.min(offset+1800,text.length);if(end<text.length){const space=text.lastIndexOf(' ',end);if(space>offset)end=space;}translated.push(await translator.translate(text.slice(offset,end)));offset=end;}
    output.push(translated.join('\n'));
   }
   setResult(output);setStatus('Terjemahan selesai. Tinjau hasil sebelum menyimpan.');
  }catch(e){setError(e instanceof Error?e.message:'Penerjemahan gagal. Coba bahasa lain atau periksa dukungan browser.');setStatus('');}
  finally{translator?.destroy();await loading?.destroy();setBusy(false);}
 }
 return <div><fieldset disabled={busy} className="print-controls space-y-4">
  {!supported&&<p role="status" className="rounded-xl bg-amber-50 p-4 text-sm">Browser ini belum mendukung penerjemahan lokal. Buka di Chrome desktop terbaru yang mendukung Translator API.</p>}
  <label className="block">Pilih PDF (maks. 10 MB / 30 halaman)<input className="mt-2 block w-full" type="file" accept=".pdf,application/pdf" onChange={e=>{const f=e.target.files?.[0];setResult([]);setError('');setFile(null);if(f){if(f.size>10*1024*1024||!f.name.toLowerCase().endsWith('.pdf'))setError('Pilih PDF maksimal 10 MB.');else setFile(f);}}}/></label>
  <div className="grid grid-cols-2 gap-4">{[['Bahasa asal',source,setSource],['Terjemahkan ke',target,setTarget]].map(([label,value,setter])=><label key={label as string}>{label as string}<select className="mt-2 w-full rounded-lg border border-line bg-white p-3" value={value as string} onChange={e=>{(setter as (s:string)=>void)(e.target.value);setResult([]);}}>{languages.map(([code,name])=><option key={code} value={code}>{name}</option>)}</select></label>)}</div>
  <button disabled={!supported||!file||source===target} onClick={run} className="w-full rounded-lg bg-accent p-3 text-white disabled:opacity-40">{busy?'Menerjemahkan…':'Terjemahkan PDF'}</button>
  <p aria-live="polite" className="text-sm text-muted">{status}</p>{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
 </fieldset>{result.length>0&&<><button className="print-controls my-5 rounded-lg bg-accent p-3 text-white" onClick={()=>window.print()}>Cetak / Simpan PDF hasil</button><article id="print-document" lang={target} className="mt-6 rounded-xl bg-white p-6">{result.map((text,i)=><section key={i} className="mb-8"><h2 className="mb-3 font-semibold">Halaman {i+1}</h2><p dir="auto" className="whitespace-pre-wrap break-words leading-relaxed">{text}</p></section>)}</article></>}</div>;
}
