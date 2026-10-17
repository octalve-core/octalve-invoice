"use client";
import Link from "next/link";
import {CheckCircle2,ExternalLink,ShieldAlert} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {SetupInfoNote} from "@/src/features/merchant-setup/SetupInfoNote";

/** Readiness is a LOCAL checklist, never NRS verification, connection or tax assessment. */
export function NrsReadinessPanel(){
 const {settings}=useMerchantPreview();
 const checks=[
  {title:"Legal business name",value:(settings.legalName||settings.businessName).trim()},
  {title:"Tax ID",value:settings.taxId.trim()},
  {title:"Business address",value:settings.businessAddress.trim()},
  {title:"City & state",value:settings.city?.trim()&&settings.state?.trim()?"Provided":""}
 ];
 const prepared=checks.filter(x=>x.value).length;
 return <section aria-label="NRS connection readiness" className="rounded-2xl border border-[#E1EAF5] bg-white p-4 sm:p-5">
  <header className="flex flex-wrap items-center justify-between gap-3">
   <div><h3 className="font-bold text-[#173652]">NRS connection setup</h3><p className="mt-1 text-xs text-slate-500">{prepared} of {checks.length} business fields entered</p></div>
   <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Not connected <SetupInfoNote title="NRS connection" detail="Tax ID entry is not NRS verification. An approved taxpayer authorization or accredited integration, official business identifiers, secure credentials and successful NRS responses are required before synchronization or e-invoice filing."/></span>
  </header>
  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
   {checks.map(row=><div key={row.title} className="flex min-w-0 items-start gap-2 rounded-xl border border-[#EDF2F8] bg-[#F8FAFD] p-3">
    {row.value?<CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600"/>:<ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber-600"/>}
    <span className="min-w-0"><span className="block text-xs font-semibold text-[#193955]">{row.title}</span><span className="mt-1 block text-[11px] text-slate-500">{row.value?"Entered · unverified":"Add details"}</span></span>
   </div>)}
  </div>
  <div className="mt-4 flex flex-wrap gap-2">
   <Link href="/dashboard/getting-started?step=business" className="inline-flex min-h-10 items-center rounded-full bg-[#0064E0] px-4 text-xs font-semibold text-white">Edit business information</Link>
   <a href="https://einvoice.nrs.gov.ng/merchant-buyer-solution-portal" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#D9E7F9] px-4 text-xs font-semibold text-[#0064E0]">NRS e-invoicing portal <ExternalLink size={14}/></a>
  </div>
  <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
   No official IRNs, QR codes or filings yet.
   <SetupInfoNote title="What happens when connected?" detail="After secure taxpayer authorization, Octalve can validate linked business details, use official Business and Service IDs, classify taxable invoice lines, exchange structured documents, track IRNs and verification outcomes, and reconcile filing acknowledgements. Tax amounts and filing deadlines still depend on valid tax rules and supporting records."/>
  </div>
 </section>;
}
