import { ToolShell } from "@/components/ToolShell";
import { Scanner } from "./Scanner";
export const metadata = { title: "Scanner jadi PDF", description: "Ubah foto dokumen dari kamera atau galeri menjadi PDF." };
export default function Page() {
  return <ToolShell kicker="Alat PDF" title="Scanner jadi PDF" description="Foto dokumen di tempat terang atau pilih gambar dari perangkatmu. Satu gambar menjadi satu halaman A4." faq={[{q:"Apakah hasilnya dapat dicari sebagai teks?",a:"Hasil PDF berupa gambar. Fitur ini belum menyediakan OCR atau pemotongan perspektif otomatis."},{q:"Bagaimana membuka kamera?",a:"Tombol Ambil foto meminta kamera pada perangkat yang mendukungnya. Di desktop, browser dapat menampilkan pemilih file."}]}><Scanner /></ToolShell>;
}
