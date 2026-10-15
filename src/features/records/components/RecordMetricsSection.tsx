"use client";
import {useMemo} from "react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {getPreviewRecords} from "../preview-records";
/** UI-only summary: derived from the same list fixtures, not independent fabricated accounting values. */
export function RecordMetricsSection({kind}:{kind:"receipt"|"creditNote"}){
 const {settings}=useMerchantPreview();
 const records=useMemo(()=>getPreviewRecords(kind,settings.businessName||"Octalve Limited"),[kind,settings.businessName]);
 const stats:{label:string;value:number;subtext:string;tone:string}[]=kind==="receipt"?
  [{label:"Receipts",value:records.length,subtext:"Payment documents",tone:"text-[#0064E0]"},
   {label:"Paid receipts",value:records.filter(r=>r.status==="paid").length,subtext:"Payment records",tone:"text-green-600"},
   {label:"Refunded receipts",value:records.filter(r=>r.status==="refunded").length,subtext:"Refund status history",tone:"text-red-600"}]:
  [{label:"Credit notes",value:records.length,subtext:"Credit documents",tone:"text-[#0064E0]"},
   {label:"Open customer credits",value:records.filter(r=>r.status==="open"||r.status==="partial").length,subtext:"Pending credit allocation",tone:"text-amber-600"},
   {label:"Settled credits",value:records.filter(r=>r.status==="settled").length,subtext:"Completed credits",tone:"text-green-600"}];
 return <section aria-label={kind==="receipt"?"Receipt preview metrics":"Credit note preview metrics"} className="hidden lg:block">

  <div className="grid grid-cols-3 gap-4">{stats.map(s=><article key={s.label} className="min-w-0 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
   <p className="text-sm text-[#46556b]">{s.label}</p>
   <strong className={"mt-3 block text-3xl font-bold "+s.tone}>{s.value}</strong>
   <p className="mt-3 text-[11px] text-gray-500">{s.subtext}</p>
  </article>)}</div>
 </section>;
}
