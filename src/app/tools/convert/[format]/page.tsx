import { notFound } from "next/navigation";
import { ToolShell } from "@/components/ToolShell";
import { conversionTools } from "@/lib/conversion-tools";
import { ConvertTool } from "../ConvertTool";
import { WordTool } from "../WordTool";

type Props = { params: Promise<{ format: string }> };

export function generateStaticParams() {
  return conversionTools.map((tool) => ({ format: tool.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { format } = await params;
  const tool = conversionTools.find((tool) => tool.slug === format);
  return { title: tool?.title, description: tool?.description };
}

export default async function Page({ params }: Props) {
  const { format } = await params;
  const tool = conversionTools.find((tool) => tool.slug === format);
  if (!tool) notFound();

  const isWord = tool.slug === "word";

  return (
    <ToolShell
      kicker="Konversi PDF"
      title={tool.title}
      description={tool.description}
      faq={[
        { q: "Bagaimana hasil konversinya?", a: tool.note },
        {
          q: "Bisa memilih beberapa file?",
          a: isWord
            ? "Pilih satu dokumen, maksimal 20 MB."
            : "Ya. Semua file digabung menjadi satu PDF sesuai urutan daftar. Maksimal 30 file, masing-masing 40 MB.",
        },
      ]}
    >
      <p className="mb-4 rounded-xl bg-accent-soft p-4 text-sm">{tool.note}</p>
      {isWord ? <WordTool /> : <ConvertTool tool={tool} />}
    </ToolShell>
  );
}
