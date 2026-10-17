"use client";
import Link from "next/link";
import {ArrowLeft,FileDown,Printer,Send,Link2,ShieldAlert,CheckCircle2,Wallet,Landmark,LockKeyhole} from "lucide-react";
import type {PaymentMode} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import type {PreviewInvoice} from "@/src/features/invoices/lib/preview-records";
export type InvoiceAudience="merchant"|"client";
const buttonStyle="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#DDE6F3] bg-white px-3.5 py-2 text-xs font-semibold text-[#6D7C91] opacity-70 cursor-not-allowed";
function InactiveAction({label,Icon}:{label:string;Icon:typeof Printer}){
 return <button type="button" disabled title="Available only after authorised invoice issuance and a verified provider connection"
  className={buttonStyle}><Icon size={15}/>{label}</button>;
}
function paymentNotice(mode:PaymentMode){
 if(mode==="manual")return {title:"Company bank transfer",description:"Payment instructions require a verified merchant-owned bank account. None is available for this Preview."};
 if(mode==="monnify")return {title:"Monnify collection",description:"Checkout and Dynamic Invoice are separate products. No verified account, provider expiry or checkout exists here."};
 if(mode==="flutterwave")return {title:"Flutterwave checkout",description:"The gateway is disconnected. Dynamic account eligibility and actual expiry have not been verified."};
 return {title:"Paystack checkout",description:"The gateway is disconnected. Pay with Transfer is short-lived and no invoice account was issued."};
}
/** Same owner-approved sample record for merchant/client, differing only in authority-safe controls. */
export function InvoiceAudienceToolbar({invoice,audience}:{invoice:PreviewInvoice;audience:InvoiceAudience}){
 const method=paymentNotice(invoice.paymentMode);
 return <section aria-label={audience==="merchant"?"Merchant invoice controls":"Client invoice controls"} className="space-y-3">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div className="flex min-w-0 flex-wrap items-center gap-2">
    <span className="rounded-full bg-[#EAF3FF] px-3 py-1.5 text-xs font-semibold text-[#0064E0]">{audience==="merchant"?"Merchant Facing":"Client Facing"} · Preview</span>
    <span className="rounded-full border border-[#F1D4D4] bg-[#FFF3F3] px-3 py-1.5 text-[11px] font-semibold text-[#8F3030]">DRAFT — NOT ISSUED</span>
   </div>
   {audience==="client"?<Link href={`/dashboard/invoice/${invoice.id}`} className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={16}/> Merchant view</Link>:
    <Link href={`/dashboard/invoice/${invoice.id}/client-preview`} className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#AED0FF] px-4 text-xs font-semibold text-[#0064E0]">Client-facing preview</Link>}
  </div>
  <div className="flex flex-wrap gap-2" role="group" aria-label="Unavailable until verified issuance">
   {audience==="client"?<>
    <InactiveAction label="Download" Icon={FileDown}/>
    <InactiveAction label="Print Invoice" Icon={Printer}/>
    <InactiveAction label={invoice.paymentMode==="manual"?"Report Transfer":invoice.paymentMode==="monnify"?"Check Payment":"Pay Now"} Icon={invoice.paymentMode==="manual"?Landmark:Wallet}/>
   </>:<>
    <InactiveAction label="Send Reminder" Icon={Send}/>
    <InactiveAction label="Revalidate" Icon={CheckCircle2}/>
    <InactiveAction label="Copy Client Link" Icon={Link2}/>
   </>}
  </div>
  <div className="grid gap-3 sm:grid-cols-2">
   <div className="rounded-2xl border border-[#DDE8F6] bg-[#F4F8FF] p-4">
    <p className="flex items-center gap-2 text-xs font-bold text-[#173652]"><Landmark size={16} className="text-[#0064E0]"/>{method.title}</p>
    <p className="mt-1 text-xs leading-5 text-[#526B83]">{method.description}</p>
   </div>
   <div className="rounded-2xl border border-[#E2E9F2] bg-white p-4">
    <p className="flex items-center gap-2 text-xs font-bold text-[#173652]"><LockKeyhole size={16} className="text-[#0064E0]"/>Fiscal and payment verification</p>
    <p className="mt-1 text-xs leading-5 text-[#526B83]">No NRS-issued IRN/QR, verified collection or payment receipt is available in this demonstration.</p>
   </div>
  </div>
  <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900">
   <ShieldAlert size={16} className="mt-0.5 shrink-0"/>
   Both previews use the same draft data and existing invoice renderer. This is not a customer payment link, financial record or printable issued invoice.
  </p>
 </section>;
}
