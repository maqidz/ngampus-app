import { ToolIcon } from "@/components/ToolIcon";
import { ToolShell } from "@/components/ToolShell";
import { conversionTools } from "@/lib/conversion-tools";
export const metadata = { title: "Konversi ke PDF" };
export default function ConvertPage() {
  return <ToolShell kicker="Alat PDF" title="Konversi ke PDF" description="Pilih jenis file yang ingin kamu ubah menjadi PDF." faq={[]}><div className="grid gap-4 sm:grid-cols-2">{conversionTools.map(tool=><a key={tool.slug} href={`/tools/convert/${tool.slug}`} className="rounded-2xl border border-line bg-white p-6 hover:border-neutral-300"><ToolIcon tool={tool.slug} className="mb-5 h-16 w-16" /><h2 className="text-lg font-semibold">{tool.title}</h2><p className="mt-2 text-sm text-muted">{tool.description}</p></a>)}</div></ToolShell>;
}
