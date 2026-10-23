"use client";
import Link from "next/link";
import {useParams} from "next/navigation";
import {useState} from "react";
import {ArrowLeft,FileText,LockKeyhole,Mail,Send,ShieldAlert} from "lucide-react";
import {getPreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {z03PreviewCapabilities,z03UnissuedPreview} from "@/src/features/documents/z03-lifecycle-contract";

type DeliveryChannel="email"|"secure-link";
export default function InvoiceDeliveryPreviewPage(){
 const {id}=useParams<{id:string}>();
 const invoice=getPreviewInvoice(id);
 const {settings}=useMerchantPreview();
 const [channel,setChannel]=useState<DeliveryChannel>("email");
 const [recipient,setRecipient]=useState(invoice?.email??"");
 const [subject,setSubject]=useState("Invoice for your review");
 const [message,setMessage]=useState("Hello, please review the attached invoice when it is officially issued.");
 if(!invoice)return <main className="rounded-2xl bg-white p-6 text-sm">Invoice preview not found. <Link href="/dashboard/invoice" className="text-[#0064E0]">Back to invoices</Link></main>;
 const reference=formatDocumentNumber(settings.businessName||"Business",Number(id)||1,"invoice");
 const inputStyle="mt-1 block h-11 w-full min-w-0 rounded-xl border border-[#E0E9F4] bg-white px-3 text-sm text-[#193955] focus-visible:outline-2 focus-visible:outline-[#0064E0]";
 return <main className="mx-auto w-full max-w-[1050px] min-w-0 space-y-5 pb-12">
  <header className="flex flex-wrap items-start justify-between gap-3">
   <div><Link href={"/dashboard/invoice/"+id} className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={16}/> Invoice details</Link>
    <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#173652]">Invoice delivery preview</h1>
    <p className="mt-1 text-xs text-slate-500">Prepare how an issued document would reach a customer. Nothing is sent.</p>
   </div>
   <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-900">Draft · not issued</span>
  </header>
  <div role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
   <ShieldAlert size={17} className="mt-0.5 shrink-0"/>
   The displayed invoice is sample data. No immutable issued snapshot, authorized recipient, verified account, fiscal response, downloadable issued PDF or working customer link exists.
  </div>
  <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,.85fr)]">
   <section aria-label="Delivery preparation" className="min-w-0 space-y-4 rounded-2xl border border-[#E4ECF6] bg-white p-4 sm:p-6">
    <h2 className="flex items-center gap-2 text-sm font-semibold text-[#173652]"><Mail size={17} className="text-[#0064E0]"/> Delivery preparation</h2>
    <fieldset className="space-y-2"><legend className="text-xs font-medium text-[#193955]">Method</legend>
     <div className="flex flex-wrap gap-2">
      {([["email","Email"],["secure-link","Secure customer link"]] as const).map(([value,label])=>
       <label key={value} className={"inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-3 text-xs font-medium "+(channel===value?"border-[#0064E0] bg-blue-50 text-[#0064E0]":"border-slate-200 text-slate-600")}>
        <input type="radio" name="delivery-channel" value={value} checked={channel===value} onChange={()=>setChannel(value)}/>{label}</label>)}
     </div>
    </fieldset>
    <label className="block text-xs font-medium text-[#193955]">Recipient
     <input aria-label="Delivery recipient" type="email" value={recipient} onChange={e=>setRecipient(e.target.value)} className={inputStyle} placeholder="customer@example.com"/>
    </label>
    {channel==="email"?<>
     <label className="block text-xs font-medium text-[#193955]">Subject<input aria-label="Delivery subject" value={subject} onChange={e=>setSubject(e.target.value)} className={inputStyle}/></label>
     <label className="block text-xs font-medium text-[#193955]">Message<textarea aria-label="Delivery message" value={message} onChange={e=>setMessage(e.target.value)} rows={4} className="mt-1 block w-full rounded-xl border border-[#E0E9F4] bg-white p-3 text-sm focus-visible:outline-2 focus-visible:outline-[#0064E0]"/></label>
    </>:<p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">A secure customer link requires an issued snapshot, scoped customer access and a server-generated expiring URL. No link is available in this preview.</p>}
    <div className="flex flex-wrap items-center gap-2">
     <button type="button" disabled={!z03PreviewCapabilities.canSend} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0064E0] px-5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><Send size={15}/> Send invoice</button>
     <button type="button" disabled={!z03PreviewCapabilities.canShare} className="min-h-11 rounded-full border border-blue-200 px-4 text-xs font-medium text-[#0064E0] disabled:cursor-not-allowed disabled:opacity-50">Copy secure link</button>
    </div>
    <p className="text-xs text-slate-500">Preparation is local to this page. No email, SMS, reminder, link or delivery queue event is created.</p>
   </section>
   <section aria-label="Document and authority checklist" className="min-w-0 space-y-4 rounded-2xl border border-[#E4ECF6] bg-white p-4 sm:p-6">
    <h2 className="flex items-center gap-2 text-sm font-semibold text-[#173652]"><FileText size={17} className="text-[#0064E0]"/> Document & authority</h2>
    <dl className="space-y-3 text-xs">
     <div><dt className="text-slate-500">Example reference</dt><dd className="mt-1 font-medium text-[#173652]">{reference}</dd></div>
     <div><dt className="text-slate-500">Example customer</dt><dd className="mt-1 font-medium text-[#173652]">{invoice.customer}</dd></div>
     <div><dt className="text-slate-500">Example face value</dt><dd className="mt-1 font-medium text-[#173652]">{invoice.amount}</dd></div>
     <div><dt className="text-slate-500">Sample due date</dt><dd className="mt-1 text-[#173652]">{invoice.dueDate}</dd></div>
     <div><dt className="text-slate-500">Issuance</dt><dd className="mt-1 font-medium text-amber-800">{z03UnissuedPreview.issuance} · no official issuance</dd></div>
     <div><dt className="text-slate-500">Delivery</dt><dd className="mt-1 text-[#173652]">{z03UnissuedPreview.delivery} · not queued</dd></div>
     <div><dt className="text-slate-500">Payment instructions</dt><dd className="mt-1 text-[#173652]">Unavailable until provider/bank eligibility is verified</dd></div>
     <div><dt className="text-slate-500">Fiscal IRN / QR</dt><dd className="mt-1 text-[#173652]">Not issued or verified</dd></div>
    </dl>
    <div className="rounded-xl bg-[#F4F8FF] p-3 text-xs leading-5 text-[#42607E]"><LockKeyhole size={16} className="mb-1 text-[#0064E0]"/> An issued PDF or signed link must reproduce the same canonical snapshot and show only eligible confirmed payment instructions.</div>
    <Link href={"/dashboard/invoice/"+id+"/client-preview"} className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#0064E0]">View existing client-facing draft preview →</Link>
   </section>
  </div>
 </main>;
}
