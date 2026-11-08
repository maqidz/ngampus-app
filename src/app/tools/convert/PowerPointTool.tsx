"use client";
import {useState} from 'react';
import {downloadBytes,stampName,formatBytes} from '@/lib/bytes';
const profiles = {
 sharp: { label: 'Tajam', quality: 100 },
 balanced: { label: 'Seimbang', quality: 90 },
 small: { label: 'Ukuran kecil', quality: 75 },
} as const;
type Quality = keyof typeof profiles;
export function PowerPointTool({word=false}:{word?:boolean}){
 const [quality,setQuality]=useState<Quality>('sharp');
 const [file,setFile]=useState<File|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[status,setStatus]=useState(''),[result,setResult]=useState<Uint8Array|null>(null);
 async function convert(){
  if(!file)return;
  setBusy(true);setError('');setResult(null);setStatus('Membaca dokumen…');
  try{
   const {officeToPdf}=await import('@/lib/pdf/office');
   const bytes=await officeToPdf(file,setStatus,profiles[quality].quality);
   setResult(bytes);setStatus('Konversi selesai.');downloadBytes(bytes,stampName(file.name,'pdf'));
  }catch(e){setStatus('');setError(e instanceof Error?e.message:'Konversi gagal. Coba dokumen tanpa password.');}
  finally{setBusy(false);}
 }

 return <div className="space-y-4"><label className="block rounded-xl border border-line bg-white p-6">{word?"Pilih Word (.docx)":"Pilih PowerPoint (.pptx)"}, maksimal 20 MB<input disabled={busy} type="file" accept={word?".docx":".pptx"} className="mt-3 block w-full text-sm" onChange={e=>{setFile(null);setResult(null);setError('');setStatus('');const f=e.target.files?.[0];if(f){if(f.size>20*1024*1024||!(word?/\.docx$/i:/\.pptx$/i).test(f.name))setError('Pilih dokumen yang sesuai, maksimal 20 MB.');else setFile(f);}}}/></label><fieldset disabled={busy} className="space-y-2"><legend className="mb-2 text-sm font-medium">Kualitas hasil</legend><div className="grid grid-cols-3 gap-2">{(Object.keys(profiles) as Quality[]).map(key=><label key={key} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm ${quality===key?'border-accent bg-accent-soft':'border-line bg-white'}`}><input type="radio" name="ppt-quality" value={key} checked={quality===key} onChange={()=>{setQuality(key);setResult(null);setStatus('');}}/>{profiles[key].label}</label>)}</div><p className="text-xs text-muted">{quality==='sharp'?'Gambar halaman lebih tajam, dengan ukuran file lebih besar.':quality==='balanced'?'Kualitas tinggi dengan ukuran file yang lebih hemat.':'File lebih ringan untuk dibagikan.'}</p></fieldset><button disabled={!file||busy} onClick={convert} className="w-full rounded-xl bg-foreground p-3 font-medium text-white disabled:opacity-40">{busy?'Mengonversi dokumen…':word?'Ubah Word ke PDF':'Ubah PowerPoint ke PDF'}</button><p role="status" className="text-sm text-muted">{status}</p>{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}{result&&file&&<div className="rounded-xl border border-line bg-white p-4"><p className="mb-2 text-sm font-medium">PDF siap · {formatBytes(result.byteLength)}</p><button className="text-sm text-accent underline" onClick={()=>downloadBytes(result,stampName(file.name,'pdf'))}>Unduh hasil lagi</button></div>}</div>;
}
