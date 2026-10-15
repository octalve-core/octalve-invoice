"use client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import { SapphireInvoiceRenderer } from "@/src/features/invoice/renderers/sapphire-invoice-renderer";
import { ClassicLedgerRenderer } from "@/src/features/invoice/templates/classic-ledger/classic-ledger-renderer";
import { calculateInvoiceTotals } from "@/src/features/invoice/lib/calculations";
import type { BusinessIdentityProfile,BusinessPaymentSettings,InvoiceDraft,InvoiceLine } from "@/src/features/invoice/types";
type Props={
 draft:InvoiceDraft; setDraft:Dispatch<SetStateAction<InvoiceDraft>>;
 profile:BusinessIdentityProfile;setProfile:Dispatch<SetStateAction<BusinessIdentityProfile>>;
 payment:BusinessPaymentSettings;setPayment:Dispatch<SetStateAction<BusinessPaymentSettings>>;
 template:"modern"|"ledger";
};
export function InvoiceDocumentPreviewSection({draft,setDraft,profile,setProfile,payment,setPayment,template}:Props){
 const [downloadError,setDownloadError]=useState("");
 const totals=calculateInvoiceTotals(draft.rows,draft.discount,draft.tax);
 const onDraftChange=<K extends keyof InvoiceDraft>(key:K,value:InvoiceDraft[K])=>
   setDraft(old=>({...old,[key]:value}));
 const onLineChange=(id:string,patch:Partial<Omit<InvoiceLine,"id">>)=>
   setDraft(old=>({...old,rows:old.rows.map(x=>x.id===id?{...x,...patch}:x)}));
 const onPaymentChange=<K extends keyof BusinessPaymentSettings>(key:K,value:BusinessPaymentSettings[K])=>
   setPayment(old=>({...old,[key]:value}));
 const onProfileChange=<K extends keyof BusinessIdentityProfile>(key:K,value:BusinessIdentityProfile[K])=>
   setProfile(old=>({...old,[key]:value}));
 const onDateChange=(key:"day"|"month"|"year",value:string)=>onDraftChange(key,value);
 const onDueDateChange=(key:"dueDay"|"dueMonth"|"dueYear",value:string)=>onDraftChange(key,value);
 const onSeq=(v:string|number)=>onDraftChange("invoiceNo",String(v));
 const noop=()=>{};
 const onPercent=(key:"discount"|"tax")=>onDraftChange(key,draft[key]);
 const shared={draft,paymentSettings:payment,totals,onDraftChange,onDateChange,onDueDateChange,
   onInvoiceSequenceChange:onSeq,onLineChange,onLineUnitPriceBlur:noop,onLineQuantityBlur:noop,
   onLineDiscountBlur:noop,onPercentageBlur:onPercent,onPaymentSettingChange:onPaymentChange};
 const download=async()=>{
   setDownloadError("");
   try {
     if(!window.document.querySelector('img[src="/branding/octalve-invoice-icon.png"]')?.getAttribute("complete")){
       // PDF loader performs its own authoritative logo fetch and will report missing assets.
     }
     const { buildInvoicePresentation }=await import("@/src/features/invoice/presentation/invoice-presentation");
     const { exportNativeInvoicePdf }=await import("@/src/features/invoice/lib/native-pdf-export");
     const presentation=buildInvoicePresentation({draft,paymentSettings:payment,totals,companyProfile:profile});
     await exportNativeInvoicePdf(presentation,"octalve-invoice-preview.pdf");
   } catch(e) {setDownloadError(e instanceof Error?e.message:"PDF preview unavailable.");}
 };
 return <section aria-label="Live document preview" className="space-y-3">
   <div className="flex flex-wrap items-center justify-between gap-3">
     <div><h2 className="font-semibold text-[#1D2838]">Live {template==="modern"?"Modern Invoice":"Classic Ledger"} preview</h2>
       <p className="text-xs text-gray-500">Same source renderer as native PDF; preview only, not issued.</p></div>
     <button onClick={download} type="button" className="rounded-lg bg-[#0064E0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0052B8]">Download preview PDF</button>
   </div>
   {downloadError&&<p role="alert" className="text-sm text-red-600">{downloadError}</p>}
   <div className="overflow-x-auto rounded-xl border border-gray-200 bg-[#edf2f8] p-2 py-6">
     <div className="min-w-[794px]">{template==="modern" ?
       <SapphireInvoiceRenderer {...shared}/> :
       <ClassicLedgerRenderer {...shared} businessProfile={profile} onBusinessProfileChange={onProfileChange}/>}
     </div>
   </div>
 </section>;
}
