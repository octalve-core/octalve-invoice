"use client";
import Link from "next/link";
import {getPreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import { useState } from "react";
import { InvoiceEditorSection } from "@/src/features/invoices/sections/InvoiceEditorSection";
import { InvoiceDocumentPreviewSection } from "@/src/features/invoices/sections/InvoiceDocumentPreviewSection";
import { createPreviewInvoice,previewMerchant,previewPayment } from "@/src/features/invoices/lib/preview-fixture";
export function InvoiceComposer({mode="create",invoiceId}:{mode?:"create"|"edit";invoiceId?:string}){
 const [draft,setDraft]=useState(()=>{
  const initial=createPreviewInvoice();
  const matching=invoiceId?getPreviewInvoice(invoiceId):undefined;
  return matching?{...initial,invoiceNo:matching.reference,clientName:matching.customer,clientEmail:matching.email}:initial;
 });
 const [profile,setProfile]=useState(previewMerchant);
 const [payment,setPayment]=useState(previewPayment);
 const [template,setTemplate]=useState<"modern"|"ledger">("modern");
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
     UI Preview only. Editing changes the visible document in this browser; nothing is saved, sent, issued, or marked paid.
   </div>
   <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
     <InvoiceEditorSection draft={draft} setDraft={setDraft}/>
     <InvoiceDocumentPreviewSection draft={draft} setDraft={setDraft} profile={profile} setProfile={setProfile}
       payment={payment} setPayment={setPayment} template={template}/>
   </div>
 </div>;
}


