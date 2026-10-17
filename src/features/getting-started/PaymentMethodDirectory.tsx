"use client";
import Link from "next/link";
import {ArrowLeft,ChevronRight,ShieldCheck} from "lucide-react";
import {PAYMENT_METHODS,PAYMENT_ROUTE,PAYMENT_FAQ} from "./payment-catalog";
export function PaymentMethodDirectory({embedded=false}:{embedded?:boolean}){
 return <section className="mx-auto w-full max-w-[720px] min-w-0 space-y-4" aria-label="Payment method setup">
  <header className="flex items-center gap-3">
   {!embedded?<Link href="/dashboard/getting-started" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#DDE6F1]" aria-label="Back to checklist"><ArrowLeft size={18}/></Link>:null}
   <div className="min-w-0 flex-1"><h1 className="text-lg font-bold text-[#173652]">Online Payments & Banks</h1>
    <p className="mt-0.5 text-xs text-slate-500">Choose a method to set up.</p></div>
  </header>
  <div className="space-y-2">
   {PAYMENT_METHODS.map(method=><Link key={method.id} href={PAYMENT_ROUTE+"/"+method.id}
    className="group flex min-h-[76px] items-center gap-3 rounded-xl border border-[#D9E6F8] bg-[#F4F8FF] px-4 py-3 transition hover:border-[#83B7FF] hover:bg-[#EAF3FF] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
    <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[#173652]">{method.title}</span>
     <span className="mt-1 block text-[11px] leading-4 text-[#587087]">{method.brief}</span></span>
    <span className="shrink-0 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#0064E0]">Setup <ChevronRight size={13} className="inline"/></span>
   </Link>)}
  </div>
  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
   <p className="flex items-center gap-1.5"><ShieldCheck size={15}/> <span>0 of 6 connected</span></p>
   <Link href={PAYMENT_FAQ} className="text-xs font-semibold text-[#0064E0]">Learn setup</Link>
  </div>
  <p className="text-[11px] text-slate-500">Connection progress requires verified server status. Payment methods remain unavailable in Preview.</p>
 </section>;
}
