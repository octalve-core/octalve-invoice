import Link from "next/link";
import { CheckCircle2, ArrowRight, CircleDashed, ShieldCheck } from "lucide-react";
const tasks = [
  {title:"Set up online payment",desc:"Connect your own merchant provider when secure integrations are available.",href:"/dashboard/settings",available:false},
  {title:"Customize invoice template",desc:"Choose the approved Octalve modern invoice or Classic Ledger.",href:"/dashboard/settings/invoice",available:true},
  {title:"Add business information",desc:"Edit your company details, branding and authorized signature.",href:"/dashboard/settings/business",available:true},
  {title:"Set up app lock",desc:"An additional convenience lock, never a replacement for account authentication.",href:"/dashboard/settings",available:false}
] as const;
export default function GettingStartedPage() {
  return <div className="mx-auto max-w-3xl space-y-6">
    <header><h1 className="text-2xl font-bold text-[#1D2838]">Getting Started</h1>
      <p className="mt-1 text-sm text-gray-500">Prepare your merchant workspace in four simple steps.</p></header>
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-[#0064E0]"><ShieldCheck size={20}/><h2 className="font-semibold">Your setup checklist</h2></div>
      <p className="mb-4 text-xs text-gray-500">UI preview — completion is not yet recorded. Saved progress will be available when accounts are enabled.</p>
      <div className="space-y-2">{tasks.map((item,i)=><div key={item.title} className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-4 py-4">
        <div className="flex min-w-0 items-start gap-3"><CircleDashed size={20} className="mt-0.5 shrink-0 text-gray-400"/><div><p className="text-sm font-medium text-[#1D2838]">{i+1}. {item.title}</p><p className="mt-1 text-xs text-gray-500">{item.desc}</p></div></div>
        {item.available?<Link href={item.href} className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#0064E0] hover:underline">Open <ArrowRight size={14}/></Link>:<span className="shrink-0 text-xs text-gray-400">Coming later</span>}
      </div>)}</div>
    </section><p className="text-xs text-gray-500">Completion indicators depend on validated merchant records, not visits or button clicks.</p>
  </div>
}
