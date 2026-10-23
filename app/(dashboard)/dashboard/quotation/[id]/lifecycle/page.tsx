"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {ArrowLeft,FileText,ShieldAlert,ArrowRight} from "lucide-react";
import {getPreviewRecords} from "@/src/features/records/preview-records";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {quotationConversionRequirements,z03PreviewCapabilities} from "@/src/features/documents/z03-lifecycle-contract";

export default function QuotationLifecyclePreview(){
 const {id}=useParams<{id:string}>();
 const {settings}=useMerchantPreview();
 const quote=getPreviewRecords("quotation",settings.businessName||"Octalve Limited").find(q=>q.id===id);
 if(!quote)return <main className="rounded-2xl bg-white p-6 text-sm">Quotation not found. <Link href="/dashboard/quotation" className="text-[#0064E0]">Back to quotations</Link></main>;
 const requirements=quotationConversionRequirements({
  state:quote.status==="accepted"?"ACCEPTED":quote.status==="declined"?"DECLINED":quote.status==="sent"?"SENT":"DRAFT",
  hasAcceptedImmutableSnapshot:false,
  hasExplicitMerchantAction:false,
  hasReviewedTaxAndBuyer:false
 });
 const stages=[["Internal review","Owner/authorized staff verifies the proposal before sending."],["Customer response","Accepted, declined or expired responses require verifiable customer authorization."],["Conversion to invoice draft","Acceptance does not create an invoice. A separate merchant action creates a NEW draft with fresh checks."],["Issuance & delivery","The new draft needs independent review, lawful issuance and a separate delivery event."]];
 return <main className="mx-auto w-full max-w-[990px] min-w-0 space-y-5 pb-12">
  <header><Link href={"/dashboard/quotation/"+id} className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={16}/> Quotation details</Link>
   <h1 className="mt-1 text-2xl font-semibold text-[#173652]">Quotation lifecycle preview</h1>
   <p className="mt-1 text-xs text-slate-500">An offer and its approval are separate from invoices and payments.</p>
  </header>
  <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><ShieldAlert size={17} className="mt-0.5 shrink-0"/>This is a fictional quotation record. Its sample status is not verified customer consent, and no quotation has been accepted, converted or sent by this page.</p>
  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
   <section aria-label="Quotation stages" className="min-w-0 rounded-2xl border border-[#E4ECF6] bg-white p-4 sm:p-6">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-semibold text-[#173652]">Document journey</h2><span className="rounded-full bg-[#EEF5FF] px-3 py-1 text-[11px] text-[#0064E0]">Example: {quote.status}</span></div>
    <ol className="space-y-3">{stages.map(([name,description],i)=><li key={name} className="flex items-start gap-3 rounded-xl bg-[#F7FAFE] p-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-semibold text-[#0064E0]">{i+1}</span><span><strong className="block text-xs font-semibold text-[#173652]">{name}</strong><span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span></span></li>)}</ol>
   </section>
   <section aria-label="Quotation conversion requirements" className="min-w-0 space-y-4 rounded-2xl border border-[#E4ECF6] bg-white p-4 sm:p-6">
    <h2 className="flex items-center gap-2 text-sm font-semibold text-[#173652]"><FileText size={17} className="text-[#0064E0]"/> Conversion requirements</h2>
    <p className="text-xs text-slate-500">Sample quotation {quote.reference} · {quote.amount||"no verified amount"}</p>
    <ul className="space-y-2">{requirements.map(reason=><li key={reason} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-xs leading-5 text-slate-700">{reason}</li>)}</ul>
    <button type="button" disabled={!z03PreviewCapabilities.canConvertQuotation} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] px-4 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Convert to a new invoice draft <ArrowRight size={16}/></button>
    <p className="text-xs leading-5 text-slate-500">No payment, dynamic account, receipt or new invoice number can be created by accepting a quotation.</p>
   </section>
  </div>
 </main>;
}
