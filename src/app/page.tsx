import { conversionTools } from "@/lib/conversion-tools";
import { ToolIcon } from "@/components/ToolIcon";
import { Footer, Header } from "@/components/Header";
import { UpsellBanner } from "@/components/UpsellBanner";

const tools = [
  { href: "/tools/sign", title: "Sign PDF", body: "Gambar dan tambahkan tanda tangan ke halaman PDF pilihanmu." },
  { href: "/tools/scanner", title: "Scanner jadi PDF", body: "Ambil foto dokumen atau pilih gambar, atur urutan, lalu unduh PDF." },
  {
    href: "/tools/merge",
    title: "Gabung PDF",
    body: "Satukan beberapa PDF jadi satu file, urutan bisa diatur.",
  },
  {
    href: "/tools/compress",
    title: "Kompres PDF",
    body: "Kompres PDF otomatis di browser, dengan target pengurangan ukuran 35–50%.",
  },

  ...conversionTools.map(tool => ({ href: `/tools/convert/${tool.slug}`, title: tool.title, body: tool.description })),
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-xs font-medium uppercase tracking-wide text-accent">Gratis · tanpa akun</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Scan dokumen dan kelola PDF dengan mudah.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Alat dokumen untuk skripsi dan tugas. Diproses di browser, file tidak diunggah ke server.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              className="rounded-2xl border border-line bg-white p-5 shadow-[0_1px_5px_-4px_rgba(19,19,22,0.7),0_0_0_1px_rgba(34,42,53,0.08),0_4px_8px_rgba(34,42,53,0.05)] hover:border-neutral-300"
            >
              <ToolIcon tool={tool.href} className="mb-6 h-16 w-16" />
              <h2 className="text-lg font-semibold tracking-tight">{tool.title}</h2>
              <p className="mt-2 text-sm text-muted">{tool.body}</p>
              <p className="mt-4 text-sm font-medium">Buka alat →</p>
            </a>
          ))}
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <UpsellBanner />
        </div>
      </main>
      <Footer />
    </div>
  );
}
