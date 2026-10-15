"use client";
import {useParams} from "next/navigation";
import Link from "next/link";
import {getPreviewInvoice,previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {InvoiceDocumentPreviewSection} from "@/src/features/invoices/sections/InvoiceDocumentPreviewSection";
import {createPreviewInvoice} from "@/src/features/invoices/lib/preview-fixture";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {merchantCompany,merchantPayment} from "@/src/features/merchant-preview/merchant-presentation";
import {useState} from "react";
export default function InvoiceDetailsPage(){
 const {id}=useParams<{id:string}>();
 const invoice=getPreviewInvoice(id);
 const [draft,setDraft]=useState(()=>{
  const d=createPreviewInvoice();
  return invoice?{...d,invoiceNo:invoice.reference,clientName:invoice.customer,clientEmail:invoice.email}:d;
 });
 const {settings,setSettings,logoPreview,paymentMode}=useMerchantPreview();
 const company=merchantCompany(settings),payment=merchantPayment(settings);
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
     <h1 className="text-xl font-bold">Invoice {invoice.reference}</h1>
    </div>
    <Link href={`/dashboard/invoice/${id}/edit`} className="rounded-full bg-[#0064E0] px-4 py-2 text-sm font-medium text-white">Edit Invoice</Link>
  </div>
  <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(220px,300px)_minmax(0,1fr)]">
   <aside className="hidden rounded-xl bg-white p-3 xl:block">
    <label className="mb-3 block text-sm font-medium text-gray-600">Invoice history</label>
    <div className="space-y-2">{previewInvoices.map(i=><Link key={i.id} href={`/dashboard/invoice/${i.id}`}
      className={`block rounded-lg p-3 text-xs ${i.id===id?"bg-blue-50":"bg-gray-50"}`}>
      <span className="block font-semibold text-[#172f4d]">{i.customer}</span>
      <span className="mt-1 flex justify-between text-gray-600"><span>{i.reference}</span><span>{i.amount}</span></span>
     </Link>)}</div>
   </aside>
   <div className="min-w-0"><InvoiceDocumentPreviewSection draft={draft} setDraft={setDraft}
    profile={company} setProfile={setCompany} payment={payment} setPayment={setPayment} template="modern" merchantLogo={logoPreview} paymentMode={paymentMode}/></div>
  </div>
 </div>;
}
