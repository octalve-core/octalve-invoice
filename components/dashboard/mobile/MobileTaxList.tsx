"use client";
import Link from "next/link";
import {ArrowLeft,ChevronRight,FileCheck2,ShieldCheck} from "lucide-react";
/** Legacy mobile tax entry. No statutory rate is assumed for a business or item. */
export default function MobileTaxList(){
 return <section className="space-y-5 lg:hidden" aria-label="Tax information">
   <div className="flex items-center gap-3"><Link href="/dashboard" aria-label="Back to dashboard" className="rounded-lg p-2 text-[#486581] hover:bg-blue-50"><ArrowLeft size={20}/></Link><h2 className="text-lg font-semibold text-[#173652]">Tax Centre</h2></div>
   <div className="rounded-2xl border border-[#E8EEF6] bg-white p-5 shadow-sm"><span className="grid h-12 w-12 place-items-center rounded-full bg-[#EAF3FF] text-[#0064E0]"><FileCheck2 size={23}/></span><h3 className="mt-4 font-semibold text-[#173652]">Review your tax settings</h3><p className="mt-2 text-xs leading-6 text-[#67819B]">Tax rates must follow your business registration, jurisdiction and each line's classification. No unverified percentages are applied automatically.</p><Link href="/dashboard/tax-centre" className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-[#0064E0] px-4 py-3 text-sm font-semibold text-white">Open Tax Centre<ChevronRight size={18}/></Link></div>
   <p className="flex gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-[#285880]"><ShieldCheck size={17} className="shrink-0"/>Actual NRS submissions and rates require verified authority and approved backend integration.</p>
 </section>;
}
