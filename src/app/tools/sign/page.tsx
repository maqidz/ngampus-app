import {ToolShell} from "@/components/ToolShell";
import {SignTool} from "./SignTool";
export const metadata={title:'Sign PDF'};
export default function Page(){return <ToolShell kicker="Alat PDF" title="Sign PDF" description="Gambar tanda tangan, pilih halaman dan posisi, lalu unduh PDF. File tetap di perangkatmu." faq={[{q:"Apakah ini tanda tangan digital tersertifikasi?",a:"Tidak. Fitur ini menambahkan gambar tanda tangan, tanpa sertifikat digital atau verifikasi identitas."}]}><SignTool /></ToolShell>;}
