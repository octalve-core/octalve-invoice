"use client";
import {useParams} from "next/navigation";
import Link from "next/link";
import {getPreviewInvoice,previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {InvoiceDocumentPreviewSection} from "@/src/features/invoices/sections/InvoiceDocumentPreviewSection";
import {createPreviewInvoice} from "@/src/features/invoices/lib/preview-fixture";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {merchantCompany,merchantPayment} from "@/src/features/merchant-preview/merchant-presentation";
import {useState} from "react";
import {RecordTypeIcon,RecordStatusBadge} from "@/src/features/records/components/RecordVisual";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
export default function InvoiceDetailsPage(){
 const {id}=useParams<{id:string}>();
 const invoice=getPreviewInvoice(id);
 const [draft,setDraft]=useState(()=>{
  const d=createPreviewInvoice();
  return invoice?{...d,invoiceNo:invoice.reference,clientName:invoice.customer,clientEmail:invoice.email}:d;
 });
 const {settings,setSettings,logoPreview,paymentMode}=useMerchantPreview();
 const company=merchantCompany(settings),payment=merchantPayment(settings);
 const displayDraft={...draft,invoiceNo:formatDocumentNumber(settings.businessName||"Octalve Limited",Number(id)||1,"invoice")};
 const setCompany:React.Dispatch<React.SetStateAction<typeof company>>=(action)=>setSettings(p=>{
   const next=typeof action==="function"?action(merchantCompany(p)):action;
   return {...p,businessName:next.name,businessPhone:next.phone,email:next.email,website:next.website,
     businessAddress:next.address,taxId:next.tinNo,rcNumber:next.rcNo};
 });
 const setPayment:React.Dispatch<React.SetStateAction<typeof payment>>=(action)=>setSettings(p=>{
   const next=typeof action==="function"?action(merchantPayment(p)):action;
   return {...p,bankName:next.bankName,accountNumber:next.accountNumber};
 });
 if(!invoice)return <div className="rounded-lg bg-white p-8">Invoice not found. <Link href="/dashboard/invoice" className="text-[#0064E0]">Back to invoices</Link></div>;
 return <div className="min-w-0 space-y-4">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div><Link href="/dashboard/invoice" className="text-xs text-[#0064E0]">← Back to invoices</Link>
     <h1 className="text-xl font-bold">Invoice {formatDocumentNumber(settings.businessName||"Octalve Limited",Number(id),"invoice")}</h1>
    </div>
    <Link href={`/dashboard/invoice/${id}/edit`} className="rounded-full bg-[#0064E0] px-4 py-2 text-sm font-medium text-white">Edit Invoice</Link>
  </div>
  <div className="grid min-w-0 items-start gap-4 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
   <aside aria-label="Invoice history" className="hidden min-w-0 rounded-2xl bg-white p-3 lg:block">
    <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-[#273c55]">Invoices</h2><Link href="/dashboard/invoice" className="text-xs text-[#0064E0]">View all</Link></div>
    <div className="space-y-2">{previewInvoices.map(i=><Link key={i.id} href={`/dashboard/invoice/${i.id}`}
      className={`flex min-w-0 items-center gap-2 rounded-xl px-2 py-3 hover:bg-blue-50 ${i.id===id?"bg-[#eef5ff]":"bg-[#f8f8f8]"}`}>
      <RecordTypeIcon kind="invoice" status={i.status} size="sm"/>
      <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><span className="truncate text-xs font-semibold text-[#15364e]">{i.customer}</span><span className="shrink-0 text-[11px] font-bold text-[#15364e]">{i.amount}</span></div>
       <div className="mt-1 flex items-center justify-between gap-1"><span className="truncate rounded-full bg-white px-2 py-0.5 text-[10px] text-gray-500">{formatDocumentNumber(settings.businessName||"Octalve Limited",Number(i.id),"invoice")}</span><RecordStatusBadge status={i.status}/></div>
       <div className="mt-1 flex flex-wrap justify-between gap-1 text-[10px] text-gray-400"><span>Created: {i.date}</span><span>Due: {i.dueDate}</span></div>
      </div>
     </Link>)}</div>
   </aside>
   <div className="min-w-0"><InvoiceDocumentPreviewSection draft={displayDraft} setDraft={setDraft}
    profile={company} setProfile={setCompany} payment={payment} setPayment={setPayment} template="modern" merchantLogo={logoPreview} paymentMode={paymentMode}/></div>
  </div>
 </div>;
}
