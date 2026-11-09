import Link from 'next/link';
import {ProtectTool} from './ProtectTool';
export const metadata={title:'Protect PDF'};
export default function Page(){return <><header className="flex h-16 items-center justify-between border-b border-line bg-white px-6"><Link href="/" className="font-semibold">PDF Kilat</Link><Link href="/" className="text-sm text-muted">Semua alat PDF</Link></header><ProtectTool/></>;}
