# PDFKilat

Alat PDF gratis untuk tugas dan skripsi: **gabung**, **kompres**, dan **ubah file ke PDF**. File diproses di browser, termasuk PowerPoint PPTX.

Yang sudah tayang: https://ngampus-app.vercel.app

## Menjalankan di komputer

Kode ada di akar repo ini.

```bash
git clone https://github.com/maqidz-ops/ngampus-app.git
cd ngampus-app
npm install
npm run dev
```

Buka http://localhost:3000

| Perintah | Untuk apa |
|---|---|
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | Cek ESLint |
| `npx tsx scripts/verify-tools.ts` | Cek gabung, konversi, dan kompres di Node |
| `node scripts/verify-merge.mjs` | Cek gabung sederhana; hasilnya di `.tmp-verify/` |

`verify-tools.ts` memakai canvas lewat `@napi-rs/canvas` (ikut terpasang bersama `pdfjs-dist`). Kalau paket itu tidak ada, skrip kompres tidak bisa jalan.

## Halaman

| Halaman | Isi |
|---|---|
| `/` | Beranda: katalog alat PDF, plus ajakan cek plagiasi |
| `/tools/merge` | Gabung beberapa PDF jadi satu. Urutan di daftar = urutan halaman; geser dengan tombol panah |
| `/tools/compress` | Perkecil satu PDF. Kompres otomatis dengan target pengurangan 35–50% |
| `/tools/convert` | Pilihan konversi per format: gambar, teks, Word, dan PowerPoint |
| `/services/plagiarism` | Info layanan cek plagiasi (Rp 5.000). Pemesanan, pembayaran, dan laporan lewat WhatsApp belum hidup di build ini |

## Kompres PDF

Satu file, satu mode otomatis dengan target ukuran **35–50% lebih kecil**. Kualitas JPEG dan resolusi disesuaikan otomatis. Halaman digambar ulang menjadi gambar sehingga teks hasil kompres tidak bisa diseleksi.

Target bukan jaminan: hasil bergantung pada isi PDF dan bisa berada di luar rentang tersebut. Jika rasterisasi membuat file lebih besar, aplikasi mencoba menulis ulang PDF atau menggunakan file asli, mana yang lebih kecil. Hasil tidak lebih besar dari file asli. PDF yang isinya teks saja sering hampir tidak menyusut.

## Batas

Maksimal **40 MB per file** dan **30 file** sekaligus.

Excel belum ditampilkan sebagai layanan. Word DOCX dan PowerPoint PPTX memakai renderer ringan di browser, maksimal satu file 20 MB dan 50 halaman/slide. DOC/PPT/ODP perlu disimpan ulang sebagai DOCX/PPTX.

Yang bisa dikonversi sekarang: PNG, JPG, WEBP, GIF, BMP, SVG, TXT, MD, CSV, JSON, HTML, LOG, DOCX, dan PDF.

## Teknologi

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS v4
- `pdf-lib` dan `pdfjs-dist` (worker lokal di `public/pdf.worker.min.mjs`)
- `mammoth` untuk konversi teks DOCX pada pipeline gabungan; halaman Word memakai docx-preview dan html2canvas

Deploy di Vercel: https://ngampus-app.vercel.app

## Mesin browser

Word memakai docx-preview/html2canvas; PowerPoint memakai pptx-browser. Renderer
dimuat saat konversi, tanpa LibreOffice WASM atau unduhan mesin 75 MB. Hasilnya
berupa gambar halaman, sehingga teks tidak bisa dipilih. Font, grafik kompleks,
dan pagination dapat berbeda. File dokumen tidak diunggah ke server.

Penggabungan memakai worker. Kompresi menyediakan mode struktural untuk
mempertahankan teks dan mode seimbang untuk dokumen berbasis gambar.
Scanner/gambar memakai batas resolusi dan membersihkan canvas setelah diproses.
Lihat docs/engine-review.md dan THIRD_PARTY_NOTICES.md untuk detail dan batasnya.

## Tanda tangan dan proteksi

`/tools/sign` menyediakan preview halaman, tanda tangan ketik/gambar/unggah,
inisial, nama, tanggal, teks dan stempel. Elemen dapat digeser, diubah ukuran,
diduplikasi dan dihapus sebelum disimpan. Tidak menggunakan sertifikat digital.

`/tools/protect` mengenkripsi PDF dengan password pembuka AES-256 melalui QPDF
di worker browser. Engine sekitar 1,3 MB dimuat hanya saat digunakan, bukan LibreOffice.
Aset QPDF disiapkan otomatis saat dev/build. Password tidak disimpan di server
atau localStorage; worker dihentikan setelah selesai.
