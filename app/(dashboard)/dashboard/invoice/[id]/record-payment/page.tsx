"use client";
import {useParams} from "next/navigation";
import Link from "next/link";
import {useMemo,useState} from "react";
import {ArrowLeft,ShieldCheck,Banknote,LockKeyhole} from "lucide-react";
import {getPreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
export default function RecordPaymentPage(){
 const {id}=useParams<{id:string}>(),{settings}=useMerchantPreview(),invoice=getPreviewInvoice(id);
 const [amount,setAmount]=useState(""),[date,setDate]=useState("2026-10-15"),[reference,setReference]=useState(""),[notes,setNotes]=useState("");
 const [verified,setVerified]=useState(false),[review,setReview]=useState(false);
 const total=useMemo(()=>Number((invoice?.amount||"0").replace(/[^\d.]/g,""))||0,[invoice]);
 const valid=Number(amount)>0&&Number(amount)<=total&&Boolean(reference.trim())&&Boolean(date)&&verified;
 if(!invoice)return <div className="rounded-lg bg-white p-8">Invoice not found. <Link href="/dashboard/invoice" className="text-[#0064E0]">Back</Link></div>;
 const allowed=invoice.paymentMode==="manual"&&["pending","partial","overdue"].includes(invoice.status);
 return <main className="mx-auto max-w-3xl space-y-5"><header className="flex items-center gap-3">
  <Link href={"/dashboard/invoice/"+id} aria-label="Back to invoice" className="rounded-full p-2"><ArrowLeft size={20}/></Link>
  <div><h1 className="text-xl font-bold text-[#1b3048]">Record bank-transfer payment</h1><p className="text-xs text-gray-500">{invoice.reference} · {invoice.customer}</p></div></header>
  {!allowed?<section role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
   <LockKeyhole size={22} className="mb-2"/> Manual recording is unavailable for this invoice. Gateway and dynamic-account payments must be verified by the provider; paid invoices cannot be recorded again.
  </section>:<section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
   <div className="flex gap-3 rounded-xl bg-blue-50 p-4"><Banknote className="shrink-0 text-[#0064E0]"/><div><p className="text-sm font-semibold">Manual bank transfer</p><p className="mt-1 text-xs leading-5 text-gray-600">Check the bank statement or merchant banking portal. A customer screenshot or transfer alert alone is not proof of cleared funds.</p></div></div>
   <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-medium">Amount received (₦)
     <input type="number" min="0.01" max={total} step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-gray-50 px-3 text-sm"/></label>
    <label className="block text-xs font-medium">Date received
     <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="mt-1 h-11 w-full rounded-xl border bg-gray-50 px-3 text-sm"/></label></div>
   <label className="block text-xs font-medium">Bank transaction reference
    <input value={reference} onChange={e=>setReference(e.target.value)} placeholder="Reference from your bank statement" className="mt-1 h-11 w-full rounded-xl border bg-gray-50 px-3 text-sm"/></label>
   <label className="block text-xs font-medium">Internal notes (optional)
    <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border bg-gray-50 p-3 text-sm"/></label>
   <label className="flex items-start gap-3 rounded-xl border p-3 text-xs leading-5"><input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)} className="mt-1 accent-[#0064E0]"/>
    <span>I have independently verified that the bank actually credited the merchant's account. I understand this requires an auditable server-side record and authorised merchant session.</span></label>
   {settings.bankName&&settings.accountNumber?<p className="text-xs text-gray-500">Company account: {settings.bankName} · ****{settings.accountNumber.slice(-4)}</p>:<p className="text-xs text-amber-700">Company bank account is incomplete. <Link href="/dashboard/settings/business" className="font-semibold underline">Configure in Business Settings</Link></p>}
   <div className="flex gap-2"><Link href={"/dashboard/invoice/"+id} className="rounded-full border px-5 py-2.5 text-sm">Cancel</Link><button disabled={!valid} onClick={()=>setReview(true)} className="rounded-full bg-[#0064E0] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">Review payment</button></div>
   {review?<div role="status" className="space-y-2 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm"><div className="flex items-center gap-2 font-semibold text-[#17406b]"><ShieldCheck size={18}/>Payment review prepared</div>
     <p className="text-xs leading-5 text-[#17406b]">Amount: ₦{Number(amount).toLocaleString("en-NG")} · Ref: {reference}. This is only a form review; no payment, invoice status change or receipt has been recorded. Final submission will be available after the secure payment ledger is implemented.</p>
    </div>:null}
  </section>}
 </main>;
}
