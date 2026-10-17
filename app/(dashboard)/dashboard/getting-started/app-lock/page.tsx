import Link from "next/link";
import {LockKeyhole} from "lucide-react";
export default function AppLockPage(){return <main className="mx-auto max-w-lg space-y-4 rounded-2xl border bg-white p-5 sm:p-7">
<div className="flex items-center gap-3"><LockKeyhole className="text-[#0064E0]"/><h1 className="text-lg font-bold text-[#173652]">App Lock</h1></div>
<p className="text-sm text-slate-600">This task requires authenticated identity, MFA and secure server sessions. It cannot be marked complete in Preview.</p>
<Link href="/dashboard/getting-started" className="inline-block rounded-full bg-[#0064E0] px-4 py-3 text-sm font-semibold text-white">Back to Getting Started</Link></main>;}
