"use client";
import {useParams} from "next/navigation";
import Link from "next/link";
import {ArrowLeft,FileCheck2} from "lucide-react";
import {getPreviewRecords,getRelatedPreviewInvoice} from "@/src/features/records/preview-records";
import {RecordTypeIcon,RecordStatusBadge} from "@/src/features/records/components/RecordVisual";
import {useMerchantPreview,getInitials} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
export default function ReceiptDetailsPage(){
 const {id}=useParams<{id:string}>(),{settings,logoPreview}=useMerchantPreview();
 const records=getPreviewRecords("receipt",settings.businessName||"Octalve Limited");
 const receipt=records.find(r=>r.id===id);
 if(!receipt)return <div className="rounded-xl bg-white p-6 text-sm">Receipt not found. <Link href="/dashboard/receipt" className="text-[#0064E0]">Back to receipts</Link></div>;
 const invoice=getRelatedPreviewInvoice(receipt);
 return <div className="min-w-0 space-y-4">
  <div className="flex items-center gap-3"><Link href="/dashboard/receipt" aria-label="Back to receipts" className="rounded-full p-2"><ArrowLeft size={19}/></Link>
   <div><h1 className="text-xl font-bold text-[#1d314a]">Receipt {receipt.reference}</h1><p className="text-xs text-gray-500">Payment document</p></div></div>
  <div className="grid items-start gap-4 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
   <aside className="hidden space-y-2 rounded-2xl bg-white p-3 lg:block"><h2 className="mb-2 px-2 text-sm font-semibold text-[#273b52]">Receipt history</h2>
   {records.map(r=><Link key={r.id} href={"/dashboard/receipt/"+r.id} className={"flex min-w-0 items-center gap-2 rounded-xl px-2 py-3 "+(r.id===id?"bg-blue-50":"bg-[#f8f8f8] hover:bg-blue-50")}>
    <RecordTypeIcon kind="receipt" status={r.status} size="sm"/>
    <span className="min-w-0 flex-1"><span className="flex justify-between gap-1"><strong className="truncate text-xs text-[#173951]">{r.title}</strong><strong className="shrink-0 text-[11px]">{r.amount}</strong></span>
     <span className="mt-1 flex justify-between gap-2"><span className="rounded-full bg-white px-2 text-[10px] text-gray-500">{r.reference}</span><RecordStatusBadge status={r.status}/></span>
     <span className="mt-1 block text-[10px] text-gray-400">Received: {r.date}</span>
    </span>
   </Link>)}</aside>
   <section aria-label="Receipt document" className="min-w-0 rounded-2xl bg-[#ebf1f7] p-3 sm:p-6">
    <article className="mx-auto max-w-[790px] space-y-6 bg-white p-4 shadow-sm sm:p-9">
     <header className="flex flex-wrap items-start justify-between gap-5 border-b pb-5">
      <div className="flex items-center gap-3">{logoPreview?<img src={logoPreview} alt="Business logo" className="h-16 w-16 shrink-0 rounded-full object-contain"/>:
       <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xl font-bold text-[#0064E0]">{getInitials(settings.businessName||"Octalve Limited")}</span>}
       <div><p className="text-sm font-semibold text-[#0064E0]">{receipt.reference}</p><h2 className="text-xl font-black text-[#162b43]">{settings.businessName||"Your business"}</h2><p className="mt-1 text-xs text-gray-500">{settings.businessAddress}</p></div></div>
      <div className="text-right"><p className="text-xs text-gray-500">Amount received</p><p className="mt-1 text-xl font-bold text-[#173951]">{receipt.amount}</p><div className="mt-2"><RecordStatusBadge status={receipt.status}/></div></div>
     </header>
     <div className="grid grid-cols-2 gap-3 rounded-xl bg-[#f2f6fb] p-4 text-xs sm:p-5">
      <div><p className="text-gray-500">Received from</p><p className="mt-1 font-semibold text-[#162f48]">{receipt.title}</p><p className="mt-1 break-all text-gray-500">{receipt.email}</p></div>
      <div><p className="text-gray-500">Payment details</p><p className="mt-1 font-semibold">{receipt.paymentMethod||"Not specified"}</p><p className="mt-1 text-gray-500">Date: {receipt.date}</p></div>
     </div>
     <div className="space-y-3 border-t border-b py-5 text-sm">
      <div className="flex justify-between"><span className="text-gray-500">Description</span><span>Payment received</span></div>
      <div className="flex justify-between font-bold"><span>Total</span><span>{receipt.amount}</span></div>
     </div>
     {invoice?<p className="rounded-lg bg-blue-50 p-3 text-xs text-[#1b4a79]">Linked invoice: <Link href={"/dashboard/invoice/"+invoice.id} className="font-semibold underline">{formatDocumentNumber(settings.businessName||"Octalve Limited",Number(invoice.id),"invoice")}</Link></p>:
      <p className="rounded-lg bg-blue-50 p-3 text-xs text-[#1b4a79]">Independent payment record — not linked to an Octalve Invoice.</p>}
     <footer className="flex items-center justify-between border-t pt-5 text-xs text-gray-500"><span>Receipt details</span><FileCheck2 size={22} className="text-[#0064E0]"/></footer>
    </article>
    <p className="mt-2 text-center text-[11px] text-gray-500">Document demonstration only. No receipt has been issued or payment independently verified.</p>
   </section>
  </div>
 </div>;
}
