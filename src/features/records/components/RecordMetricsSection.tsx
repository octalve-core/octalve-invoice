"use client";
import {useMemo} from "react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {getPreviewRecords} from "../preview-records";
/** UI-only summary: derived from the same list fixtures, not independent fabricated accounting values. */
export function RecordMetricsSection({kind}:{kind:"receipt"|"creditNote"}){
 const {settings}=useMerchantPreview();
 const records=useMemo(()=>getPreviewRecords(kind,settings.businessName||"Octalve Limited"),[kind,settings.businessName]);
 const stats:{label:string;value:number;subtext:string;tone:string}[]=kind==="receipt"?
  [{label:"Receipt previews",value:records.length,subtext:"Optional documents; never auto-issued",tone:"text-[#0064E0]"},
   {label:"Paid receipt samples",value:records.filter(r=>r.status==="paid").length,subtext:"Recorded payment examples",tone:"text-green-600"},
   {label:"Refunded receipt samples",value:records.filter(r=>r.status==="refunded").length,subtext:"Refunded state remains traceable",tone:"text-red-600"}]:
  [{label:"Credit note previews",value:records.length,subtext:"Customer credit document examples",tone:"text-[#0064E0]"},
   {label:"Open customer credits",value:records.filter(r=>r.status==="open"||r.status==="partial").length,subtext:"Unresolved/partially allocated",tone:"text-amber-600"},
   {label:"Settled credit samples",value:records.filter(r=>r.status==="settled").length,subtext:"No real refund or settlement",tone:"text-green-600"}];
 return <section aria-label={kind==="receipt"?"Receipt preview metrics":"Credit note preview metrics"} className="hidden lg:block">
  <p className="mb-2 text-xs text-gray-500">Sample list counts — preview only</p>
  <div className="grid grid-cols-3 gap-4">{stats.map(s=><article key={s.label} className="min-w-0 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
   <p className="text-sm text-[#46556b]">{s.label}</p>
   <strong className={"mt-3 block text-3xl font-bold "+s.tone}>{s.value}</strong>
   <p className="mt-3 text-[11px] text-gray-500">{s.subtext}</p>
  </article>)}</div>
 </section>;
}
