"use client";
import Link from "next/link";
import {X,Check,ChevronRight,CreditCard,FileText,Building2,LockKeyhole} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {previewSetupProgress} from "@/src/features/getting-started/setup-progress";
import {PAYMENT_ROUTE} from "@/src/features/getting-started/payment-catalog";
export default function GettingStartedModal({isOpen,onClose}:{isOpen:boolean;onClose:()=>void}){
 const {user,settings,invoiceAppearance,invoicePreferences}=useMerchantPreview();
 const progress=previewSetupProgress(settings,invoiceAppearance,invoicePreferences);
 const tasks=[
  {title:"Set up payments and banks",href:PAYMENT_ROUTE,done:progress.payment,Icon:CreditCard},
  {title:"Customize invoice template",href:"/dashboard/settings/invoice?from=getting-started",done:progress.invoice,Icon:FileText},
  {title:"Add business information",href:"/dashboard/getting-started?step=business",done:progress.business,Icon:Building2},
  {title:"Set up app lock",href:"/dashboard/getting-started/app-lock",done:progress.appLock,Icon:LockKeyhole}
 ];
 if(!isOpen)return null;
 return <div className="fixed inset-0 z-[70] lg:hidden">
  <button type="button" aria-label="Close setup checklist" className="absolute inset-0 w-full bg-black/50" onClick={onClose}/>
  <section role="dialog" aria-modal="true" aria-label="Getting Started" className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
   <header className="flex items-start justify-between gap-3"><div><h2 className="text-base font-bold text-[#173652]">Hello {user.fullName?.trim().split(" ")[0]||"there"}!</h2>
    <p className="mt-1 text-xs text-slate-500">Complete your setup checklist.</p></div>
    <button type="button" onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-[#F2F6FA]"><X size={19}/></button></header>
   <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E9F0F7]" role="progressbar" aria-label="Setup progress" aria-valuenow={progress.completed} aria-valuemin={0} aria-valuemax={4}><div className="h-full rounded-full bg-[#0064E0]" style={{width:progress.percent+"%"}}/></div>
   <p className="mt-2 text-xs text-slate-600">{progress.completed}/4 steps complete · {progress.percent}%</p>
   <nav className="mt-4 space-y-2" aria-label="Setup tasks">{tasks.map(t=><Link key={t.title} href={t.href} onClick={onClose} className="flex min-h-14 items-center gap-3 rounded-xl bg-[#F8FAFD] px-3">
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-[#0064E0]">{t.done?<Check size={17}/>:<t.Icon size={17}/>}</span>
    <span className="flex-1 text-sm font-medium text-[#173652]">{t.title}</span><ChevronRight size={17} className="text-slate-400"/></Link>)}</nav>
   <p className="mt-3 text-[11px] text-slate-500">Payment verification and app lock require the secure backend. Preview selections are not completed connections.</p>
  </section>
 </div>;
}
