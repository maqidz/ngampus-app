import Link from 'next/link';
import {SignTool} from './SignTool';
export const metadata={title:'Sign PDF'};
export default function Page(){return <><header className="flex h-16 items-center justify-between border-b border-line bg-white px-6"><Link href="/" className="font-semibold">PDF Kilat</Link><Link href="/tools/convert" className="text-sm text-muted">Semua alat PDF</Link></header><SignTool/></>;}
