"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft,Check,Eye,RotateCcw,ShieldCheck,SlidersHorizontal} from "lucide-react";
import {defaultInvoiceAppearance,useMerchantPreview,type InvoiceAppearance} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const colors=["#0064E0","#021A34","#0B8063","#B65B23","#6650B8","#A72855"];
const fonts={system:"Inter / System",serif:"Georgia / Serif",rounded:"Trebuchet / Rounded"};
const cssFont={system:"Arial, sans-serif",serif:"Georgia, serif",rounded:"Trebuchet MS, sans-serif"};
export default function ThemeSettingsPage(){
 const {invoiceAppearance,setInvoiceAppearance,settings}=useMerchantPreview();
 const [notice,setNotice]=useState(false);
 const patch=<K extends keyof InvoiceAppearance>(key:K,value:InvoiceAppearance[K])=>{setInvoiceAppearance(p=>({...p,[key]:value}));setNotice(false);};
 const a=invoiceAppearance,accent=/^#[0-9a-fA-F]{6}$/.test(a.accent)?a.accent:defaultInvoiceAppearance.accent;
 const control="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-[#183955]";
 return <main className="w-full min-w-0 space-y-5 pb-10">
 <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm font-medium text-[#0064E0]"><ArrowLeft size={16}/> Back to Settings</Link>
 <header className="flex flex-wrap justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#0064E0]">Document appearance</p><h1 className="mt-1 text-2xl font-bold text-[#16344F] sm:text-3xl">Customize your invoices</h1><p className="mt-1 text-sm text-slate-500">Choose a template, colours, typography and visible layout options.</p></div><button type="button" onClick={()=>{setInvoiceAppearance(defaultInvoiceAppearance);setNotice(false);}} className="flex h-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600"><RotateCcw size={16}/> Reset</button></header>
 <div className="grid items-start gap-5 xl:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
  <div className="space-y-5">
   <section className="space-y-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-semibold text-[#183955]"><SlidersHorizontal size={18} className="text-[#0064E0]"/> Template & colours</h2>
    <div className="grid grid-cols-2 gap-3">{(["modern","ledger"] as const).map(t=><button type="button" key={t} aria-pressed={a.template===t} onClick={()=>patch("template",t)} className={`rounded-xl border-2 p-4 text-left text-sm font-semibold ${a.template===t?"border-[#0064E0] bg-blue-50 text-[#0064E0]":"border-slate-200 text-slate-600"}`}>{t==="modern"?"Modern Invoice":"Classic Ledger"}{a.template===t?<Check className="mt-3" size={17}/>:null}</button>)}</div>
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
    <label className="flex items-center justify-between gap-4 text-sm text-[#183955]"><span>Show watermark on design preview</span><input type="checkbox" checked={a.showWatermark} onChange={e=>patch("showWatermark",e.target.checked)} className="h-4 w-4 accent-[#0064E0]"/></label>
   </section>
  </div>
  <section className="min-w-0 space-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 font-semibold text-[#183955]"><Eye size={18} className="text-[#0064E0]"/> Live appearance preview</h2><p className="text-xs text-slate-500">Style concept; issued PDFs require renderer-specific qualification.</p></div><Link href="/dashboard/invoice/create" className="rounded-full bg-[#0064E0] px-4 py-2 text-xs font-semibold text-white">Open invoice editor</Link></div>
   <div className="overflow-hidden rounded-xl bg-[#EAF0F6] p-2 sm:p-5">
    <div className="relative mx-auto min-h-[440px] max-w-[640px] overflow-hidden rounded-lg bg-white p-5 text-[#173652] shadow-xl sm:p-8" style={{fontFamily:cssFont[a.font]}}>
     {a.showWatermark?<span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-30 text-5xl font-black text-slate-100">PREVIEW</span>:null}
     <div className={`relative flex flex-wrap items-start justify-between gap-3 pb-5 ${a.header==="standard"?"border-b border-slate-200":""}`}>
      <div className={`flex min-w-0 flex-1 items-center gap-3 ${a.logoPosition==="right"?"flex-row-reverse":a.logoPosition==="center"?"flex-col text-center":""}`}>
       <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full font-bold text-white" style={{backgroundColor:accent}}>{(settings.businessName||"Octalve Limited").trim().slice(0,2).toUpperCase()}</span><div><p className="font-bold text-[#183955]">{settings.businessName||"Your business"}</p><p className="text-xs text-slate-500">Business identity from your settings</p></div>
      </div><div><strong className="text-xl" style={{color:accent}}>INVOICE</strong><p className="text-xs text-slate-500">OL-00001INV</p></div>
     </div>
     <div className="relative mt-5 grid grid-cols-2 gap-4 text-xs"><div><p className="font-semibold text-slate-500">BILL TO</p><p className="mt-2 font-semibold">Sample Customer</p><p className="text-slate-500">customer@example.invalid</p></div><div className="text-right"><p className="font-semibold text-slate-500">ISSUED / DUE</p><p className="mt-2">15 Oct 2026</p><p>29 Oct 2026</p></div></div>
     <div className="relative mt-6 overflow-hidden rounded-lg border border-slate-100"><div className="grid grid-cols-[1fr_45px_90px] gap-2 p-3 text-xs font-bold text-white" style={{backgroundColor:accent}}><span>ITEM</span><span>QTY</span><span>AMOUNT</span></div><div className={`grid grid-cols-[1fr_45px_90px] gap-2 border-b border-slate-100 px-3 text-xs ${a.density==="compact"?"py-2":"py-4"}`}><span>Professional services</span><span>1</span><span>₦250,000</span></div></div>
     <div className="relative mt-6 ml-auto max-w-[220px] border-t-2 pt-3 text-sm font-bold" style={{borderColor:accent}}><div className="flex justify-between gap-5"><span>Total</span><span>₦250,000</span></div></div>
     {a.showFooter?<p className="relative mt-10 border-t border-slate-200 pt-4 text-center text-[10px] text-slate-500">Thank you for choosing {settings.businessName||"your business"}.</p>:null}
    </div>
   </div>
   <button type="button" disabled={!/^#[0-9a-fA-F]{6}$/.test(a.accent)} onClick={()=>setNotice(true)} className="w-full rounded-full bg-[#0064E0] p-3 text-sm font-semibold text-white disabled:opacity-40">Apply to current Preview</button>
   {notice?<p role="status" className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900">Appearance preferences are available within this session. Modern browser/PNG and Classic Ledger accent previews can reflect supported settings; custom fonts and layout must pass separate native PDF qualification before issued use.</p>:null}
   <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0"/>Custom font file uploads, immutable theme versions and server-saved templates require validated storage and authenticated permissions in Phase 1. The Sapphire document engine has not been replaced.</p>
  </section>
 </div>
 </main>;
}
