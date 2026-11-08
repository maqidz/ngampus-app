import {mergePdfs} from './merge';
self.onmessage=async(event:MessageEvent<{files:{name:string;data:ArrayBuffer}[]}>)=>{
 try{
  const files=event.data.files.map(item=>new File([item.data],item.name,{type:'application/pdf'}));
  const bytes=await mergePdfs(files);const output=new Uint8Array(bytes).buffer;
  (self as unknown as {postMessage:(data:unknown,transfer:Transferable[])=>void}).postMessage({bytes:output},[output]);
 }catch(error){self.postMessage({error:error instanceof Error?error.message:'Gagal menggabungkan PDF.'});}
};
