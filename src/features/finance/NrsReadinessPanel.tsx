"use client";
import Link from "next/link";
import {CheckCircle2,FileText,LockKeyhole,ShieldAlert} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";

/** Informational readiness checks only. Never treated as NRS enrollment or tax clearance. */
export function NrsReadinessPanel(){
 const {settings}=useMerchantPreview();
 const checks=[
  {title:"Registered business name",value:settings.businessName.trim(),note:"Use the registered legal name"},
  {title:"Business Tax ID",value:settings.taxId.trim(),note:"Distinct from CAC/RC registration"},
  {title:"Business postal address",value:settings.businessAddress.trim(),note:"Complete registered address"},
 ];
 return <section aria-label="NRS connection readiness" className="rounded-2xl border border-[#E1EAF5] bg-white p-4 sm:p-5">
   <div className="flex flex-wrap items-center justify-between gap-2">
    <h3 className="text-base font-bold text-[#173652]">NRS connection readiness</h3>
    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Not connected</span>
   </div>
   <p className="mt-2 text-sm text-slate-600">Prepare the details that may be needed to connect your business for e-invoicing. Entering these details does not register you with NRS or submit an invoice.</p>
   <div className="mt-4 grid gap-3 sm:grid-cols-3">{checks.map(row=><div key={row.title} className="rounded-xl border border-slate-100 bg-[#F8FAFD] p-3">
    <div className="flex items-center gap-2">{row.value?<CheckCircle2 size={17} className="text-green-600"/>:<ShieldAlert size={17} className="text-amber-600"/>}<span className="text-xs font-semibold text-[#173652]">{row.title}</span></div>
    <p className="mt-2 break-words text-xs text-slate-600">{row.value?row.title==="Business Tax ID"?"Provided · not verified":row.value:"Not provided"}</p>
    <p className="mt-1 text-[11px] text-slate-500">{row.note}</p>
   </div>)}</div>
   <Link href="/dashboard/settings/business" className="mt-4 inline-flex min-h-10 items-center rounded-full border border-[#0064E0] px-4 text-xs font-semibold text-[#0064E0]">Edit business details</Link>
   <div className="mt-5 grid gap-3 sm:grid-cols-2">
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-[#173652]"><FileText size={18}/><h4 className="text-sm font-semibold">Official identifiers</h4></div>
      <p className="mt-2 text-xs leading-5 text-slate-600">NRS Business ID, assigned Service ID and verified IRN are not yet linked. Your Octalve invoice number is separate from an official IRN.</p>
    </div>
    <div className="rounded-xl border border-slate-100 p-4">
      <div className="flex items-center gap-2 text-[#173652]"><LockKeyhole size={18}/><h4 className="text-sm font-semibold">Secure integration</h4></div>
      <p className="mt-2 text-xs leading-5 text-slate-600">An authorized integration method, secure business permissions and fiscal validation must be set up before e-invoices can be submitted. Never enter private API credentials here.</p>
    </div>
   </div>
   <p className="mt-4 text-xs text-slate-500">Customer billing profiles, item classifications and applicable tax treatment must also be checked. No NRS submissions, acknowledgements, issued IRNs or official verification QR codes exist in this workspace.</p>
  </section>;
}
