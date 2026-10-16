"use client";
import Link from "next/link";
import {ArrowLeft,Check,Eye,RotateCcw,ShieldCheck,SlidersHorizontal} from "lucide-react";
import Image from "next/image";
import {InvoiceTemplateGallery} from "@/src/features/invoices/components/InvoiceTemplateGallery";
import {merchantInitials,formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {createPreviewInvoice} from "@/src/features/invoices/lib/preview-fixture";
import {applyNewInvoicePreferences} from "@/src/features/invoices/lib/invoice-preferences";
import {defaultInvoiceAppearance,useMerchantPreview,type InvoiceAppearance,type DueDatePreference} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const colors=["#0064E0","#021A34","#0B8063","#B65B23","#6650B8","#A72855"];
const fonts={system:"Inter / System",serif:"Georgia / Serif",rounded:"Trebuchet / Rounded"};
const cssFont={system:"Arial, sans-serif",serif:"Georgia, serif",rounded:"Trebuchet MS, sans-serif"};
export default function InvoiceSettingsPage(){
 const {invoiceAppearance,setInvoiceAppearance,settings,logoPreview,invoicePreferences,setInvoicePreferences,receiptAutoMode,setReceiptAutoMode}=useMerchantPreview();
 const patch=<K extends keyof InvoiceAppearance>(key:K,value:InvoiceAppearance[K])=>setInvoiceAppearance(p=>({...p,[key]:value}));
 const preference=<K extends keyof typeof invoicePreferences>(key:K,value:(typeof invoicePreferences)[K])=>setInvoicePreferences(p=>({...p,[key]:value}));
 const a=invoiceAppearance,accent=/^#[0-9a-fA-F]{6}$/.test(a.accent)?a.accent:defaultInvoiceAppearance.accent;
 const control="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-[#183955] focus-visible:outline-2 focus-visible:outline-[#0064E0]";
 const exampleDraft=applyNewInvoicePreferences(createPreviewInvoice(),invoicePreferences);
 const sampleDate=(day:string,month:string,year:string)=>[day,month,year].filter(Boolean).join(" ");
 const currencySymbol=({NGN:"₦",USD:"$",GBP:"£",EUR:"€"} as const)[invoicePreferences.currency];
 const sampleAmount=currencySymbol+"250,000";
 const initialBusiness=settings.businessName||"Your business";
 return <main className="w-full min-w-0 space-y-5 pb-10">
 <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm font-medium text-[#0064E0]"><ArrowLeft size={16}/> Back to Settings</Link>
 <header className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0064E0]">Document appearance</p><h1 className="mt-1 text-2xl font-bold text-[#16344F] sm:text-3xl">Customize your invoices</h1><p className="mt-1 text-sm text-slate-500">Choose a template, colours, typography, payment terms and other invoice preferences in one place.</p></div><button type="button" onClick={()=>setInvoiceAppearance(defaultInvoiceAppearance)} className="flex h-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"><RotateCcw size={16}/> Reset appearance</button></header>
 <div className="grid items-start gap-5 xl:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
  <div className="min-w-0 space-y-5">
   <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-semibold text-[#183955]"><SlidersHorizontal size={18} className="text-[#0064E0]"/> Template & colours</h2>
    <InvoiceTemplateGallery selected={a.template} onSelect={style=>patch("template",style)}/>
    <p className="text-xs text-slate-500">Choose Modern or Classic Ledger. Other original layouts will become available when they are completed and tested.</p>
    <div><p className="mb-2 text-xs font-semibold text-[#183955]">Accent colour</p><div className="flex flex-wrap gap-3">{colors.map(color=><button type="button" key={color} aria-label={"Choose "+color} aria-pressed={accent.toLowerCase()===color.toLowerCase()} onClick={()=>patch("accent",color)} className={`grid h-10 w-10 place-items-center rounded-xl border-2 ${accent.toLowerCase()===color.toLowerCase()?"border-[#173855]":"border-transparent"}`}><span className="grid h-7 w-7 place-items-center rounded-lg" style={{backgroundColor:color}}>{accent.toLowerCase()===color.toLowerCase()?<Check size={15} className="text-white"/>:null}</span></button>)}</div></div>
    <label className="block text-xs font-semibold text-[#183955]">Custom colour (hex)<input type="text" value={a.accent} onChange={e=>patch("accent",e.target.value)} maxLength={7} aria-invalid={!/^#[0-9a-fA-F]{6}$/.test(a.accent)} className={control+" mt-2"}/></label>
    {!/^#[0-9a-fA-F]{6}$/.test(a.accent)?<p className="text-xs text-red-600">Use a six-digit hex colour, for example #0064E0.</p>:null}
   </section>
   <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-semibold text-[#183955]">Font & layout</h2>
    <label className="block text-xs font-semibold text-slate-600">Typography<select className={control+" mt-2"} value={a.font} onChange={e=>patch("font",e.target.value as InvoiceAppearance["font"])}>{Object.entries(fonts).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
    <label className="block text-xs font-semibold text-slate-600">Layout density<select className={control+" mt-2"} value={a.density} onChange={e=>patch("density",e.target.value as InvoiceAppearance["density"])}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select></label>
    <label className="block text-xs font-semibold text-slate-600">Header style<select className={control+" mt-2"} value={a.header} onChange={e=>patch("header",e.target.value as InvoiceAppearance["header"])}><option value="standard">Standard</option><option value="minimal">Minimal</option></select></label>
    <label className="block text-xs font-semibold text-slate-600">Logo position<select className={control+" mt-2"} value={a.logoPosition} onChange={e=>patch("logoPosition",e.target.value as InvoiceAppearance["logoPosition"])}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
    <label className="flex items-center justify-between gap-4 text-sm text-[#183955]"><span>Show template footer</span><input type="checkbox" checked={a.showFooter} onChange={e=>patch("showFooter",e.target.checked)} className="h-4 w-4 accent-[#0064E0]"/></label>
    <p className="rounded-lg bg-[#FFF7F7] px-3 py-2 text-xs text-[#8E3035]">Draft watermark is always visible and cannot be switched off.</p>
   </section>
   <details className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm" open>
    <summary className="cursor-pointer font-semibold text-[#183955] focus-visible:outline-2 focus-visible:outline-[#0064E0]">New invoice defaults</summary>
    <div className="mt-4 space-y-4">
     <label className="block text-xs font-semibold text-slate-600">Default currency
      <select aria-label="Default currency" className={control+" mt-2"} value={invoicePreferences.currency} onChange={e=>preference("currency",e.target.value as typeof invoicePreferences.currency)}>
       <option value="NGN">Nigerian naira (NGN)</option><option value="USD">US dollar (USD)</option><option value="GBP">Pound sterling (GBP)</option><option value="EUR">Euro (EUR)</option>
      </select>
     </label>
     <label className="block text-xs font-semibold text-slate-600">Default payment term
      <select aria-label="Default payment term" className={control+" mt-2"} value={invoicePreferences.preferredDueDate} onChange={e=>preference("preferredDueDate",e.target.value as DueDatePreference)}>
       <option value="1week">7 days</option><option value="2weeks">14 days</option><option value="1month">1 calendar month</option><option value="custom">Choose on each invoice</option>
      </select>
     </label>
     <label className="block text-xs font-semibold text-slate-600">Invoice prefix
      <input aria-label="Invoice prefix" readOnly value={merchantInitials(settings.businessName||"Octalve Limited")} className={control+" mt-2 bg-slate-50"}/>
     </label>
     <p className="text-xs text-slate-500">Invoice numbers are allocated when issued. Tax treatment must be reviewed for each applicable item, not assumed.</p>
     <label className="flex items-center gap-3 text-sm text-[#183955]"><input type="checkbox" checked={invoicePreferences.showPaymentHistory} onChange={e=>preference("showPaymentHistory",e.target.checked)} className="h-4 w-4 accent-[#0064E0]"/>Show payment history when available</label>
     <label className="flex items-center gap-3 text-sm text-[#183955]"><input type="checkbox" checked={invoicePreferences.enableAutoReminder} onChange={e=>preference("enableAutoReminder",e.target.checked)} className="h-4 w-4 accent-[#0064E0]"/>Prefer reminders when enabled</label>
    </div>
   </details>
   <details className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
    <summary className="cursor-pointer font-semibold text-[#183955] focus-visible:outline-2 focus-visible:outline-[#0064E0]">Receipts & payment preferences</summary>
    <div className="mt-4 space-y-3">
     <label className="block text-xs font-semibold text-slate-600">After a verified online payment
      <select aria-label="Automatic receipt preference" className={control+" mt-2"} value={receiptAutoMode} onChange={e=>setReceiptAutoMode(e.target.value as typeof receiptAutoMode)}>
       <option value="off">Create receipt manually when needed</option><option value="generate">Generate receipt after verified payment</option><option value="generate_and_email">Generate and email after verified payment</option>
      </select>
     </label>
     <p className="text-xs text-slate-500">Automatic receipts and payment processing are not active yet. Receipts document payment and do not increase revenue again.</p>
     <Link href="/dashboard/settings/business" className="block rounded-xl border border-blue-100 p-3 text-sm font-semibold text-[#0064E0]">Business logo and bank details →</Link>
     <Link href="/dashboard/tax-centre" className="block rounded-xl border border-blue-100 p-3 text-sm font-semibold text-[#0064E0]">Tax & NRS readiness →</Link>
    </div>
   </details>
   <p className="px-1 text-xs leading-5 text-slate-500">Preferences apply to new drafts in this session. Historical issued documents keep their original details and presentation; secure account saving will follow in an approved backend phase.</p>
  </div>
  <section className="min-w-0 space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 xl:sticky xl:top-24"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 font-semibold text-[#183955]"><Eye size={18} className="text-[#0064E0]"/> Live appearance preview</h2><p className="text-xs text-slate-500">Illustrative draft · not issued. Final PDFs use an approved document renderer.</p></div><Link href="/dashboard/invoice/create" className="rounded-full bg-[#0064E0] px-4 py-2 text-xs font-semibold text-white">Open invoice editor</Link></div>
   <div className="overflow-hidden rounded-xl bg-[#EAF0F6] p-2 sm:p-5">
    <div className="relative mx-auto min-h-[440px] max-w-[640px] overflow-hidden rounded-lg bg-white p-5 text-[#173652] shadow-xl sm:p-8" style={{fontFamily:cssFont[a.font]}}>
     <div data-testid="theme-draft-watermark" aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-around overflow-hidden select-none">
      <span className="self-end rounded-l-md bg-[#FFF1F1]/95 px-3 py-2 text-[10px] font-extrabold tracking-wider text-[#903038]">DRAFT — NOT ISSUED</span>
      {Array.from({length:3},(_,i)=><span key={i} className="w-[140%] -rotate-[27deg] whitespace-nowrap text-center text-[clamp(17px,2vw,31px)] font-extrabold tracking-[.15em] text-[#95313B]/40">DRAFT · NOT ISSUED</span>)}
     </div>
     <div className={`relative flex flex-wrap items-start justify-between gap-3 pb-5 ${a.header==="standard"?"border-b border-slate-200":""}`}>
      <div className={`flex min-w-0 flex-1 items-center gap-3 ${a.logoPosition==="right"?"flex-row-reverse":a.logoPosition==="center"?"flex-col text-center":""}`}>
       {logoPreview?<Image src={logoPreview} alt="Your business logo" width={48} height={48} unoptimized className="h-12 w-12 shrink-0 rounded-lg object-contain"/>:
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-bold text-white" style={{backgroundColor:accent}}>{merchantInitials(initialBusiness).slice(0,2)}</span>}<div><p className="font-bold text-[#183955]">{settings.businessName||"Your business"}</p><p className="text-xs text-slate-500">Business identity from your settings</p></div>
      </div><div><strong className="text-xl" style={{color:accent}}>INVOICE</strong><p className="text-xs text-slate-500">{formatDocumentNumber(settings.businessName||"Octalve Limited",1,"invoice")}</p></div>
     </div>
     <div className="relative mt-5 grid grid-cols-2 gap-4 text-xs"><div><p className="font-semibold text-slate-500">BILL TO</p><p className="mt-2 font-semibold">Sample Customer</p><p className="text-slate-500">customer@example.invalid</p></div><div className="text-right"><p className="font-semibold text-slate-500">ISSUE / DUE EXAMPLE</p><p className="mt-2">{sampleDate(exampleDraft.day,exampleDraft.month,exampleDraft.year)}</p><p>{sampleDate(exampleDraft.dueDay,exampleDraft.dueMonth,exampleDraft.dueYear)}</p></div></div>
     <div className="relative mt-6 overflow-hidden rounded-lg border border-slate-100"><div className="grid grid-cols-[1fr_45px_90px] gap-2 p-3 text-xs font-bold text-white" style={{backgroundColor:accent}}><span>ITEM</span><span>QTY</span><span>AMOUNT</span></div><div className={`grid grid-cols-[1fr_45px_90px] gap-2 border-b border-slate-100 px-3 text-xs ${a.density==="compact"?"py-2":"py-4"}`}><span>Professional services</span><span>1</span><span>{sampleAmount}</span></div></div>
     <div className="relative mt-6 ml-auto max-w-[220px] border-t-2 pt-3 text-sm font-bold" style={{borderColor:accent}}><div className="flex justify-between gap-5"><span>Total</span><span>{sampleAmount}</span></div></div>
     {a.showFooter?<p className="relative mt-10 border-t border-slate-200 pt-4 text-center text-[10px] text-slate-500">Thank you for choosing {settings.businessName||"your business"}.</p>:null}
    </div>
   </div>
   <p role="status" className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-[#173652]">Changes appear in this preview immediately and apply to new drafts. No extra Apply step is needed.</p>
   <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0"/>Your business logo comes from Business Settings. Existing native invoice renderers remain unchanged; finalized issued-document appearance will be separately qualified.</p>
  </section>
 </div>
 </main>;
}
