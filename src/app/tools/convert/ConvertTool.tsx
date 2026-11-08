"use client";

import { useState } from "react";
import { DropZone } from "@/components/DropZone";
import { downloadBytes, formatBytes, stampName } from "@/lib/bytes";
import type { ConversionTool } from "@/lib/conversion-tools";
import { convertHint, convertToPdf, extOf } from "@/lib/pdf/convert";

export function ConvertTool({ tool }: { tool?: ConversionTool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ bytes: Uint8Array; name: string } | null>(null);

  async function run() {
    setError(null);
    setResult(null);
    const blocked = files.map(file => tool && !tool.extensions.includes(extOf(file.name)) ? `${file.name}: pilih format ${tool.extensions.join(", ")}.` : convertHint(file)).filter(Boolean);
    if (blocked.length) {
      setError(blocked.join(" "));
      return;
    }
    setBusy(true);
    setProgress("Memulai…");
    try {
      const bytes = await convertToPdf(files, (done, total) => {
        setProgress(`File ${done} / ${total}`);
      });
      const name = stampName(files[0]?.name ?? "konversi", "pdf");
      setResult({ bytes, name });
      downloadBytes(bytes, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal konversi ke PDF.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <div>
      <DropZone
        accept={tool ? tool.extensions.map(ext => `.${ext}`).join(",") : "image/*,.png,.jpg,.jpeg,.webp,.gif,.bmp,.svg,.txt,.md,.csv,.json,.html,.htm,.docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"}
        disabled={busy}
        files={files}
        onChange={files => { setFiles(files); setResult(null); setError(null); }}
        hint={tool ? `${tool.extensions.join(", ").toUpperCase()} · Maksimal 40 MB per file.` : "Gambar, TXT/MD/CSV/JSON/HTML, DOCX, atau PDF. Excel/PPT belum."}
      />
      <button
        type="button"
        disabled={busy || files.length < 1}
        onClick={run}
        className="mt-5 w-full rounded-xl bg-foreground py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? progress ?? "Mengonversi…" : "Ubah ke PDF"}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {result && (
        <p className="mt-3 text-sm text-accent">
          Selesai · {formatBytes(result.bytes.byteLength)}.{" "}
          <button type="button" className="underline" onClick={() => downloadBytes(result.bytes, result.name)}>
            Unduh lagi
          </button>
        </p>
      )}
    </div>
  );
}
