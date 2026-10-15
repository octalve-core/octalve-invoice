"use client";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";
import Link from "next/link";
import {useMerchantPreview,type PaymentMode} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import { SapphireInvoiceRenderer } from "@/src/features/invoice/renderers/sapphire-invoice-renderer";
import { ClassicLedgerRenderer } from "@/src/features/invoice/templates/classic-ledger/classic-ledger-renderer";
import { calculateInvoiceTotals } from "@/src/features/invoice/lib/calculations";
import type { BusinessIdentityProfile,BusinessPaymentSettings,InvoiceDraft,InvoiceLine } from "@/src/features/invoice/types";
type Props={
 draft:InvoiceDraft; setDraft:Dispatch<SetStateAction<InvoiceDraft>>;
 profile:BusinessIdentityProfile;setProfile:Dispatch<SetStateAction<BusinessIdentityProfile>>;
 payment:BusinessPaymentSettings;setPayment:Dispatch<SetStateAction<BusinessPaymentSettings>>;
 template:"modern"|"ledger"; merchantLogo?:string|null;paymentMode?:PaymentMode;
};
export function InvoiceDocumentPreviewSection({draft,setDraft,profile,setProfile,payment,setPayment,template,merchantLogo=null,paymentMode="manual"}:Props){
 const {invoiceAppearance}=useMerchantPreview();
 const [downloadError,setDownloadError]=useState("");
 const [showDownloadPrompt,setShowDownloadPrompt]=useState(false);
 const [downloadFormat,setDownloadFormat]=useState<"pdf"|"png">("pdf");
 const [dismissedLogo,setDismissedLogo]=useState(false);
 const [dismissedPayment,setDismissedPayment]=useState(false);
 const hasBank=Boolean(payment.bankName.trim()&&payment.accountNumber.trim());
 const paymentReady=paymentMode==="manual"&&hasBank;
 const renderDraft={...draft,extraDetailsVisible:paymentReady};
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
 const shared={draft:renderDraft,paymentSettings:payment,totals,onDraftChange,onDateChange,onDueDateChange,
   onInvoiceSequenceChange:onSeq,onLineChange,onLineUnitPriceBlur:noop,onLineQuantityBlur:noop,
   onLineDiscountBlur:noop,onPercentageBlur:onPercent,onPaymentSettingChange:onPaymentChange};
 const performDownload=async(format:"pdf"|"png")=>{
   setDownloadError("");
   setShowDownloadPrompt(false);
   try {
     if(format==="png"){
       const node=document.getElementById("invoice-document");
       if(!node)throw new Error("Document preview unavailable for PNG.");
       const {exportRenderedDocumentPng}=await import("@/src/features/invoice/lib/export-adapter");
       await exportRenderedDocumentPng(node,template==="modern"?"octalve-modern-preview":"octalve-classic-ledger-preview",{paperSize:draft.paperSize,currency:draft.currency});
       return;
     }
     const {buildInvoicePresentation}=await import("@/src/features/invoice/presentation/invoice-presentation");
     const presentation=buildInvoicePresentation({draft:renderDraft,paymentSettings:paymentReady?payment:{bankName:"",accountName:"",accountNumber:""},totals,companyProfile:profile});
     if(template==="modern"){
       const {exportNativeInvoicePdf}=await import("@/src/features/invoice/lib/native-pdf-export");
       await exportNativeInvoicePdf(presentation,"octalve-modern-preview.pdf",merchantLogo);
     }else{
       const {exportClassicLedgerPdf}=await import("@/src/features/invoice/templates/classic-ledger/pdf/classic-ledger-pdf-export");
       await exportClassicLedgerPdf(presentation,"octalve-classic-ledger-preview.pdf",invoiceAppearance.accent,merchantLogo);
     }
   }catch(err){setDownloadError(err instanceof Error?err.message:"PDF preview unavailable.");}
 };
 const download=(format:"pdf"|"png")=>{
   setDownloadFormat(format);
   if(!merchantLogo||!paymentReady){setShowDownloadPrompt(true);return;}
   void performDownload(format);
 };
 return <section aria-label="Live document preview" className="min-w-0 space-y-3">
   <div className="flex flex-wrap items-center justify-between gap-3">
     <div><h2 className="font-semibold text-[#1D2838]">Live {template==="modern"?"Modern Invoice":"Classic Ledger"} preview</h2>
       <p className="text-xs text-gray-500">Browser and PDF use the same presentation data; preview only, not issued.</p></div>
     <div className="flex flex-wrap gap-2"><button onClick={()=>download("png")} type="button" className="rounded-lg border border-[#0064E0] px-4 py-2 text-xs font-semibold text-[#0064E0] hover:bg-blue-50">Download preview PNG</button><button onClick={()=>download("pdf")} type="button" className="rounded-lg bg-[#0064E0] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0052B8]">Download preview PDF</button></div>
   </div>
   {!merchantLogo&&!dismissedLogo?<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-blue-100 bg-white p-3 text-xs"><span>Your business logo is missing. You can preview and download without it.</span><span className="flex gap-3"><Link href="/dashboard/settings/business" className="font-semibold text-[#0064E0]">Business Settings</Link><button type="button" className="text-gray-500" onClick={()=>setDismissedLogo(true)}>Continue without logo</button></span></div>:null}
   {!paymentReady&&!dismissedPayment?<div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-100 bg-white p-3 text-xs"><span>{paymentMode==="manual"?"Bank/account details have not been configured.":"The chosen online payment provider is not connected yet."} Payment instructions will be omitted.</span><span className="flex gap-3"><Link href="/dashboard/settings/business" className="font-semibold text-[#0064E0]">Payment Settings</Link><button type="button" className="text-gray-500" onClick={()=>setDismissedPayment(true)}>Continue without payment details</button></span></div>:null}
   {downloadError&&<p role="alert" className="text-sm text-red-600">{downloadError}</p>}
   <div className="invoice-preview-viewport min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-[#edf2f8] p-2 py-6">
     <div className="invoice-preview-paper" style={{pointerEvents:"none"}}>{template==="modern" ?
       <SapphireInvoiceRenderer {...shared} companyProfile={profile} companyLogo={merchantLogo} accentColor={invoiceAppearance.accent} font={invoiceAppearance.font} density={invoiceAppearance.density} header={invoiceAppearance.header} logoPosition={invoiceAppearance.logoPosition} showFooter={invoiceAppearance.showFooter}/> :
       <ClassicLedgerRenderer {...shared} businessProfile={profile} companyLogo={merchantLogo} accentColor={invoiceAppearance.accent} onBusinessProfileChange={onProfileChange}/>}
     </div>
   </div>
   {showDownloadPrompt?<div role="presentation" className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={()=>setShowDownloadPrompt(false)}><section role="dialog" aria-modal="true" aria-label="Complete invoice details" className="w-full max-w-md space-y-3 rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl" onClick={e=>e.stopPropagation()}><h3 className="text-lg font-semibold">Review missing business details</h3><p className="text-sm text-gray-600">{!merchantLogo?"No merchant logo is uploaded. ":""}{!paymentReady?"Payment instructions are incomplete or not connected. ":""}You can download a preview without these details.</p><div className="grid gap-2 sm:grid-cols-2"><Link href="/dashboard/settings/business" className="rounded-full bg-[#0064E0] px-4 py-3 text-center text-sm font-medium text-white">Go to Business Settings</Link><button type="button" onClick={()=>void performDownload(downloadFormat)} className="rounded-full border border-[#0064E0] px-4 py-3 text-sm font-medium text-[#0064E0]">Continue without details</button></div><button type="button" onClick={()=>setShowDownloadPrompt(false)} className="w-full p-2 text-sm text-gray-500">Cancel</button></section></div>:null}
 </section>;
}
