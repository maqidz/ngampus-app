import assert from 'node:assert/strict';
import {PDFDocument,StandardFonts,degrees} from 'pdf-lib';
import {compressPdf} from '../src/lib/pdf/compress';
import {mergePdfs} from '../src/lib/pdf/merge';
import {signaturePlacement} from '../src/lib/pdf/signature';
async function main(){
const pdf=await PDFDocument.create();const font=await pdf.embedFont(StandardFonts.Helvetica);
pdf.addPage([600,800]).drawText('Preserve selectable text',{font});
const data=await pdf.save();const file=new File([new Uint8Array(data)],'text.pdf',{type:'application/pdf'});
const output=await compressPdf(file,undefined,'lossless');
assert(output.length<=data.length);
const loaded=await PDFDocument.load(output);assert.equal(loaded.getPageCount(),1);
for(const angle of [0,90,180,270]){
 const page=loaded.getPage(0);page.setRotation(degrees(angle));page.setCropBox(20,30,500,700);
 const position=signaturePlacement(page,3,30,50,50);
 assert.equal(position.rotate.angle,angle);assert(position.width>0&&position.height>0);
 // All four corners must stay inside the original crop box after rotation.
 const rad=angle*Math.PI/180;
 for(const [x,y] of [[0,0],[position.width,0],[0,position.height],[position.width,position.height]]){
  const px=position.x+x*Math.cos(rad)-y*Math.sin(rad),py=position.y+x*Math.sin(rad)+y*Math.cos(rad);
  assert(px>=20-0.001&&px<=520.001&&py>=30-0.001&&py<=730.001);
 }
}
const formDoc=await PDFDocument.create();const page=formDoc.addPage([600,800]);
const field=formDoc.getForm().createTextField('filled');field.setText('Keep filled field');field.addToPage(page,{x:40,y:40,width:200,height:40});
const form=await formDoc.save();const merged=await mergePdfs([new File([new Uint8Array(form)],'form.pdf'),file]);
assert.equal((await PDFDocument.load(merged)).getPageCount(),2);
await assert.rejects(()=>mergePdfs([new File(['bad'],'bad.pdf'),file]),/bad.pdf/);
console.log('PASS: structural compression, rotated/cropped signature placement, filled forms, invalid PDF');

}
main().catch(error=>{console.error(error);process.exitCode=1;});
