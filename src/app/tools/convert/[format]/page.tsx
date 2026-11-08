import { notFound } from "next/navigation";
import { ToolShell } from "@/components/ToolShell";
import { conversionTools } from "@/lib/conversion-tools";
import { PowerPointTool } from "../PowerPointTool";
import { ConvertTool } from "../ConvertTool";
export function generateStaticParams() { return conversionTools.map(tool => ({format: tool.slug})); }
export async function generateMetadata({params}: {params: Promise<{format: string}>}) {
  const {format} = await params;
  const tool = conversionTools.find(t => t.slug === format);
  return {title: tool?.title, description: tool?.description};
}
export default async function Page({params}: {params: Promise<{format: string}>}) {
  const {format} = await params;
  const tool = conversionTools.find(t=>t.slug===format);
  if (!tool) notFound();
  return <ToolShell kicker="Konversi PDF" title={tool.title} description={tool.description} faq={[{q:"Bagaimana hasil konversinya?", a:tool.note},{q:"Bisa memilih beberapa file?",a:["powerpoint","word"].includes(tool.slug) ? "Pilih satu dokumen, maksimal 20 MB." : "Ya. Semua file digabung menjadi satu PDF sesuai urutan daftar. Maksimal 30 file, masing-masing 40 MB."}]}>{tool.slug !== "powerpoint" && <p className="mb-4 rounded-xl bg-accent-soft p-4 text-sm">{tool.note}</p>}{["powerpoint","word"].includes(tool.slug) ? <PowerPointTool word={tool.slug === "word"} /> : <ConvertTool tool={tool} />}</ToolShell>;
}
