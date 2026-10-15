"use client";
import Link from "next/link";
import {getPreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import { useState } from "react";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {merchantCompany,merchantPayment} from "@/src/features/merchant-preview/merchant-presentation";
import { InvoiceEditorSection } from "@/src/features/invoices/sections/InvoiceEditorSection";
import { InvoiceDocumentPreviewSection } from "@/src/features/invoices/sections/InvoiceDocumentPreviewSection";
import { createPreviewInvoice } from "@/src/features/invoices/lib/preview-fixture";
export function InvoiceComposer({mode="create",invoiceId}:{mode?:"create"|"edit";invoiceId?:string}){
 const {settings,setSettings,logoPreview,paymentMode,invoiceAppearance}=useMerchantPreview();
 const [draft,setDraft]=useState(()=>{
  const initial=createPreviewInvoice();
  const matching=invoiceId?getPreviewInvoice(invoiceId):undefined;
  return matching?{...initial,invoiceNo:matching.reference,clientName:matching.customer,clientEmail:matching.email}:{...initial,invoiceNo:formatDocumentNumber(settings.businessName||"Octalve Limited",1,"invoice")};
 });
 const profile=merchantCompany(settings);
 const payment=merchantPayment(settings);
 const setProfile:React.Dispatch<React.SetStateAction<typeof profile>>=(value)=>setSettings(old=>{
   const now=merchantCompany(old);
   const changed=typeof value==="function"?value(now):value;
   return {...old,businessName:changed.name,businessPhone:changed.phone,email:changed.email,
      businessAddress:changed.address,website:changed.website,rcNumber:changed.rcNo,taxId:changed.tinNo};
 });
 const setPayment:React.Dispatch<React.SetStateAction<typeof payment>>=(value)=>setSettings(old=>{
   const now=merchantPayment(old);
   const changed=typeof value==="function"?value(now):value;
   return {...old,bankName:changed.bankName,accountNumber:changed.accountNumber};
 });
 const [template,setTemplate]=useState<"modern"|"ledger">(invoiceAppearance.template);
 return <div className="space-y-5">
   <header className="flex flex-wrap items-center justify-between gap-3">
     <div><Link href="/dashboard/invoice" className="text-sm text-[#0064E0] hover:underline">← All invoices</Link>
       <h1 className="mt-1 text-2xl font-bold text-[#1D2838]">{mode==="edit"?"Edit invoice":"Create invoice"}</h1></div>
     <label className="flex items-center gap-2 text-sm"><span>Template</span>
       <select value={template} onChange={e=>setTemplate(e.target.value as "modern"|"ledger")}
         className="rounded-lg border border-gray-200 bg-white px-3 py-2">
         <option value="modern">Octalve Modern</option><option value="ledger">Classic Ledger</option>
       </select></label>
   </header>
   <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-[#00489F]">
     Draft editor · Changes are not saved or sent.
   </div>
   <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
     <InvoiceEditorSection draft={draft} setDraft={setDraft}/>
     <InvoiceDocumentPreviewSection draft={draft} setDraft={setDraft} profile={profile} setProfile={setProfile}
       payment={payment} setPayment={setPayment} template={template} merchantLogo={logoPreview} paymentMode={paymentMode}/>
   </div>
 </div>;
}


