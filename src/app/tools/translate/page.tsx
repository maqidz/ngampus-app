import { ToolShell } from "@/components/ToolShell";
import { TranslateTool } from "./TranslateTool";
export const metadata = {title:"Translate PDF"};
export default function Page(){return <ToolShell kicker="Alat PDF" title="Translate PDF" description="Terjemahkan teks PDF di perangkatmu. Memerlukan browser desktop dengan fitur penerjemahan bawaan." faq={[{q:"Apakah layout asli dipertahankan?",a:"Tidak. Hasil disusun ulang sebagai teks. Gambar, tabel kompleks, dan PDF scan tanpa teks belum didukung."}]}><TranslateTool /></ToolShell>;}
