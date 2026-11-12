/** Scalable tool illustrations share the same overlapping tile geometry. */
export function ToolIcon({ tool, className = "h-16 w-16" }: { tool: string; className?: string }) {
  const id = tool.split("/").filter(Boolean).pop();
  const palette: Record<string, [string, string]> = {
    word: ["#5e83c7", "#dce5f9"], jpg: ["#d6bb25", "#fcf0ab"],
    png: ["#5da26a", "#c7e6c6"], gambar: ["#d6bb25", "#fcf0ab"],
    teks: ["#ae6e98", "#f0dce9"], translate: ["#5e83c7", "#dce5f9"],
  };
  const [color, light] = palette[id ?? ""] ?? ["#5e83c7", "#dce5f9"];
  const arrow = <path d="m18 18 11 11m-9 0h9v-9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />;
  return <svg aria-hidden="true" focusable="false" viewBox="0 0 72 72" className={`shrink-0 ${className}`}>
    {id === "protect" ? <><rect x="4" y="4" width="64" height="64" rx="8" fill="#ae6e98"/><rect x="21" y="31" width="30" height="25" rx="4" fill="white"/><path d="M26 31V24a10 10 0 0 1 20 0v7" fill="none" stroke="white" strokeWidth="5"/><circle cx="36" cy="42" r="3" fill="#ae6e98"/><path d="M36 43v6" stroke="#ae6e98" strokeWidth="3"/></> : id === "merge" ? <>
      <rect x="4" y="4" width="41" height="41" rx="5" fill="#f46950" />
      <rect x="28" y="28" width="40" height="40" rx="5" fill="#f46950" stroke="white" strokeWidth="3" />
      {arrow}<path d="m54 54-11-11m0 9v-9h9" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m28 34 10 10" stroke="white" strokeWidth="2" strokeDasharray="2 3" />
    </> : id === "compress" ? <>
      {[[4,4,0],[40,4,90],[40,40,180],[4,40,270]].map(([x,y,r]) => <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}><rect width="28" height="28" rx="4" fill="#91bc5c" /><path d="m8 8 12 12m-10 0h10V10" transform={`rotate(${r} 14 14)`} fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></g>)}
    </> : id === "sign" ? <>
      <rect x="4" y="4" width="64" height="64" rx="8" fill="#4e7fae" />
      <path d="m24 52 4-22 13-5 10 10-5 13-22 4Z" fill="white" /><path d="m25 51 12-12" stroke="#4e7fae" strokeWidth="2" /><circle cx="38" cy="38" r="3" fill="#4e7fae" /><path d="m39 17 14 8-4 7-14-8Z" fill="white" />
    </> : id === "scanner" ? <>
      <rect x="4" y="4" width="64" height="64" rx="8" fill="#ae6e98" />
      <g fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round"><path d="M16 26V16h10m20 0h10v10m0 20v10H46m-20 0H16V46" /><path d="M27 22h18v28H27zM13 36h46" /><path d="M32 28h8m-8 16h8" /></g>
    </> : <>
      <rect x="4" y="4" width="42" height="42" rx="5" fill={light} />
      {id === "word" || id === "teks" ? <text x="25" y="33" textAnchor="middle" fill={color} fontSize={id === "word" ? 25 : 17} fontWeight="800" fontFamily="Arial, sans-serif">{id === "word" ? "W" : "TXT"}</text> : id === "translate" ? <text x="25" y="34" textAnchor="middle" fill={color} fontSize="26" fontWeight="700" fontFamily="Arial, sans-serif">A</text> : <text x="25" y="31" textAnchor="middle" fill={color} fontSize="13" fontWeight="800" fontFamily="Arial, sans-serif">{id === "jpg" ? "JPG" : id === "png" ? "PNG" : "IMG"}</text>}
      <rect x="28" y="28" width="40" height="40" rx="5" fill={color} stroke="white" strokeWidth="3" />
      {id === "translate" ? <text x="48" y="56" textAnchor="middle" fill="white" fontSize="25" fontFamily="Arial, sans-serif">文</text> : <path d="m40 40 16 16m-12 0h12V44" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
    </>}
  </svg>;
}
