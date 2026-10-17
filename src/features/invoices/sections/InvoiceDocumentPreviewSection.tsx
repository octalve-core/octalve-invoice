"use client";
import type {Dispatch,SetStateAction} from "react";
import Link from "next/link";
import {LockKeyhole} from "lucide-react";
import {useMerchantPreview,type PaymentMode} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {SapphireInvoiceRenderer} from "@/src/features/invoice/renderers/sapphire-invoice-renderer";
import {ClassicLedgerRenderer} from "@/src/features/invoice/templates/classic-ledger/classic-ledger-renderer";
import {calculateInvoiceTotals} from "@/src/features/invoice/lib/calculations";
import type {BusinessIdentityProfile,BusinessPaymentSettings,InvoiceDraft,InvoiceLine} from "@/src/features/invoice/types";

type Props={
 draft:InvoiceDraft;setDraft:Dispatch<SetStateAction<InvoiceDraft>>;
 profile:BusinessIdentityProfile;setProfile:Dispatch<SetStateAction<BusinessIdentityProfile>>;
 payment:BusinessPaymentSettings;setPayment:Dispatch<SetStateAction<BusinessPaymentSettings>>;
 template:"modern"|"ledger";merchantLogo?:string|null;paymentMode?:PaymentMode;
};
/** Browser previews are never recorded invoices. Do not expose PDF/PNG issuance from this component. */
export function InvoiceDocumentPreviewSection({draft,setDraft,profile,setProfile,payment,setPayment,template,merchantLogo=null,paymentMode="manual"}:Props){
 const {invoiceAppearance}=useMerchantPreview();
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
 const shared={draft:renderDraft,paymentSettings:payment,totals,onDraftChange,
  onDateChange:(key:"day"|"month"|"year",value:string)=>onDraftChange(key,value),
  onDueDateChange:(key:"dueDay"|"dueMonth"|"dueYear",value:string)=>onDraftChange(key,value),
  onInvoiceSequenceChange:(v:string|number)=>onDraftChange("invoiceNo",String(v)),
  onLineChange,onLineUnitPriceBlur:()=>{},onLineQuantityBlur:()=>{},onLineDiscountBlur:()=>{},
  onPercentageBlur:(key:"discount"|"tax")=>onDraftChange(key,draft[key]),onPaymentSettingChange:onPaymentChange};
 return <section aria-label="Live document preview" className="min-w-0 space-y-3">
  <div className="flex flex-wrap items-start justify-between gap-3">
   <div><h2 className="font-semibold text-[#1D2838]">Live {template==="modern"?"Modern Invoice":"Classic Ledger"} preview</h2>
    <p className="text-xs text-gray-500">Review your document. It cannot be downloaded or shared until it is issued.</p></div>
   <div className="flex items-center gap-2 rounded-xl border border-[#F2D7D7] bg-[#FFF8F8] px-3 py-2 text-xs font-medium text-[#8F3030]">
    <LockKeyhole size={15}/> PDF and PNG available after issue
   </div>
  </div>
  {!merchantLogo?<p className="rounded-lg border border-blue-100 bg-white p-3 text-xs text-[#244766]">Your business logo has not been added. <Link href="/dashboard/settings/business" className="font-semibold text-[#0064E0] underline">Add it in Business Settings</Link> to include it in your documents.</p>:null}
  {!paymentReady?<p className="rounded-lg border border-amber-100 bg-white p-3 text-xs text-[#805D2E]">{paymentMode==="manual"?"Company bank details are incomplete.":"This online payment option is not connected."} Payment instructions will not appear on this draft. <Link href="/dashboard/settings/business" className="font-semibold text-[#0064E0] underline">Payment Settings</Link></p>:null}
  <div className="invoice-preview-viewport min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-[#edf2f8] p-2 py-6">
   <div className="invoice-preview-paper relative isolate overflow-hidden" style={{pointerEvents:"none"}}>
    {template==="modern"?
     <SapphireInvoiceRenderer {...shared} companyProfile={profile} companyLogo={merchantLogo} accentColor={invoiceAppearance.accent} font={invoiceAppearance.font} density={invoiceAppearance.density} header={invoiceAppearance.header} logoPosition={invoiceAppearance.logoPosition} showFooter={invoiceAppearance.showFooter}/>:
     <ClassicLedgerRenderer {...shared} businessProfile={profile} companyLogo={merchantLogo} accentColor={invoiceAppearance.accent} onBusinessProfileChange={onProfileChange}/>}
    <div data-testid="draft-preview-watermark" aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-around overflow-hidden select-none">
      <span className="self-end rounded-l-md border border-[#96383D] bg-[#FFF2F2]/95 px-3 py-2 text-[11px] font-extrabold tracking-wider text-[#8E292E]">DRAFT — NOT ISSUED</span>
      {Array.from({length:5},(_,i)=><span key={i} className="w-[130%] -rotate-[27deg] whitespace-nowrap text-center text-[clamp(20px,3vw,42px)] font-extrabold tracking-[0.16em] text-[#972F36]/35">DRAFT · NOT ISSUED</span>)}
    </div>
   </div>
  </div>
  <p className="text-xs leading-5 text-slate-500">Draft previews are for checking information only. Screenshots cannot be blocked reliably, so the draft is visibly marked and cannot be used as an issued document.</p>
 </section>;
}
