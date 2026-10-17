"use client";
import Link from "next/link";
import {Check,ChevronRight,CreditCard,FileText,Building2,LockKeyhole} from "lucide-react";
import {QuickCreatePanel} from "@/src/features/dashboard/QuickCreatePanel";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {previewSetupProgress} from "./setup-progress";
import {PAYMENT_ROUTE} from "./payment-catalog";

export function GettingStartedHome(){
 const {settings,user,invoiceAppearance,invoicePreferences}=useMerchantPreview();
 const progress=previewSetupProgress(settings,invoiceAppearance,invoicePreferences);
 const tasks=[
  {title:"Set up payments and banks",href:PAYMENT_ROUTE,done:progress.payment,Icon:CreditCard,detail:"0 connected in Preview"},
  {title:"Customize invoice template",href:"/dashboard/settings/invoice?from=getting-started",done:progress.invoice,Icon:FileText,detail:progress.invoice?"Preferences chosen":"Choose your style"},
  {title:"Add business information",href:"/dashboard/getting-started/business",done:progress.business,Icon:Building2,detail:progress.business?"Preview details entered":"Business details"},
  {title:"Set up app lock",href:"/dashboard/getting-started/app-lock",done:progress.appLock,Icon:LockKeyhole,detail:"Secure sign-in required"}
 ] as const;
 return <main className="mx-auto w-full max-w-[720px] space-y-4 px-1 pb-8 sm:px-2">
  <header>
   <p className="text-xs font-semibold text-[#0064E0]">GETTING STARTED</p>
   <h1 className="mt-1 text-xl font-bold text-[#153450]">Your setup checklist</h1>
  </header>
  <section className="rounded-[22px] border border-[#E4EBF3] bg-white p-4 shadow-sm sm:p-6" aria-label="Setup progress">
   <div className="flex gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#EFF5FF] text-2xl" aria-hidden="true">👋</span>
    <div className="min-w-0"><h2 className="font-semibold text-[#173652]">Hello {user.fullName?.trim().split(" ")[0]||"there"}!</h2>
     <p className="mt-0.5 text-xs text-slate-500">Complete your workspace in four steps.</p></div>
   </div>
   <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#EAF0F7]" role="progressbar" aria-label="Setup completion" aria-valuenow={progress.completed} aria-valuemin={0} aria-valuemax={4}>
    <div className="h-full rounded-full bg-[#0064E0] transition-[width]" style={{width:progress.percent+"%"}}/>
   </div>
   <p className="mt-2 text-xs font-medium text-[#42576D]">{progress.completed}/4 steps complete · {progress.percent}%</p>
   <div className="mt-4 space-y-2">
    {tasks.map(task=><Link key={task.title} href={task.href} className="flex min-h-14 items-center gap-3 rounded-xl bg-[#F8FAFD] px-3 py-2.5 transition hover:bg-[#EFF5FF] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
     <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full "+(task.done?"bg-[#E5F8F0] text-[#15815B]":"bg-white text-[#0064E0]")}>{task.done?<Check size={16}/>:<task.Icon size={17}/>}</span>
     <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#173652]">{task.title}</span><span className="block text-[11px] text-slate-500">{task.detail}</span></span>
     <ChevronRight size={17} className="shrink-0 text-[#8B9AAE]"/>
    </Link>)}
   </div>
   <p className="mt-3 text-[11px] text-slate-500">Preview progress only. Actual payment connections and app lock are not enabled yet.</p>
  </section>
  <QuickCreatePanel/>
 </main>;
}
