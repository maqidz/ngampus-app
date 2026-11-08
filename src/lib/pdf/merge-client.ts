export async function mergeInWorker(files:File[]):Promise<Uint8Array>{
 const items=await Promise.all(files.map(async file=>({name:file.name,data:await file.arrayBuffer()})));
 const worker=new Worker(new URL('./merge.worker.ts',import.meta.url),{type:'module'});
 return new Promise((resolve,reject)=>{
  worker.onmessage=event=>{worker.terminate();if(event.data.error)reject(new Error(event.data.error));else resolve(new Uint8Array(event.data.bytes));};
  worker.onerror=()=>{worker.terminate();reject(new Error('Penggabungan gagal. Kurangi jumlah file dan coba kembali.'));};
  worker.postMessage({files:items},items.map(item=>item.data));
 });
}
