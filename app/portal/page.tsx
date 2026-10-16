"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft,CalendarDays,CheckCircle2,FileCheck2,FileText,LockKeyhole,MessageSquare,ReceiptText,ShieldCheck,UserRound} from "lucide-react";
type Area="documents"|"payments"|"messages"|"account";
const tabs:{id:Area;label:string;icon:typeof FileText}[]=[
 {id:"documents",label:"Documents",icon:FileText},
 {id:"payments",label:"Payments",icon:ReceiptText},
 {id:"messages",label:"Messages",icon:MessageSquare},
 {id:"account",label:"My account",icon:UserRound}
];
const detail:Record<Area,{heading:string;description:string;features:string[]}>={
 documents:{heading:"Your documents, privately organized",description:"Invoices, accepted estimates, credit notes and receipts will be listed here for the verified customer and the specific issuing business.",features:["Invoice and quotation details","Original document downloads","Document history and linked receipts"]},
 payments:{heading:"Only verified payments appear here",description:"A customer will see paid, partial and outstanding balances based on authoritative allocations, never a payment screenshot or unverified gateway redirect.",features:["Verified installment schedule","Remaining balance and payment evidence","Secure payment options after provider approval"]},
 messages:{heading:"Conversation and reminders",description:"Read your invoice correspondence and send a question to the issuing merchant after authentication and communication preferences are verified.",features:["Invoice delivery history","Reminder and notification preferences","Customer-to-business support messages"]},
 account:{heading:"Your customer profile",description:"Customer identity and contacts will be scoped to the business you belong to; your access will never reveal another organization's documents.",features:["Verified name and email","Authorized organization access","Invite/session revocation"]}
};
export default function CustomerPortalPreview(){
 const [tab,setTab]=useState<Area>("documents");
 const item=detail[tab];
 return <main className="min-h-screen bg-[#F5F8FC] pb-12 text-[#173652]">
  <header className="border-b border-[#E8EEF6] bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6"><div><span className="text-lg font-extrabold tracking-tight text-[#0064E0]">OCTALVE</span><span className="ml-2 text-xs font-semibold text-slate-500">Customer Portal</span></div><Link href="/onboarding" className="flex items-center gap-1 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={15}/> Octalve Invoice</Link></div></header>
  <div className="mx-auto max-w-6xl space-y-6 px-4 py-7 sm:px-6">
   <section className="grid gap-6 rounded-[24px] bg-gradient-to-br from-[#073D7A] to-[#0064E0] p-6 text-white sm:grid-cols-[minmax(0,1fr)_auto] sm:p-8"><div><span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs"><LockKeyhole size={15}/> Secure customer area</span><h1 className="mt-4 max-w-xl text-2xl font-bold sm:text-3xl">Everything about your invoices in one place.</h1><p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">Your business can share quotations, invoices, verified receipts and statements in a private customer workspace.</p></div><ShieldCheck size={54} className="hidden text-white/80 sm:block"/></section>
   <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-950"><ShieldCheck className="mt-0.5 shrink-0" size={19}/><p><strong>Preview only — no customer data is exposed.</strong> Portal access requires a verified invitation or expiring customer-specific link. Authentication, MFA where applicable, token revocation and per-business permissions will be introduced in the approved backend. No existing sample invoices are publicly accessible here.</p></div>
   <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(205px,265px)_minmax(0,1fr)]">
    <nav aria-label="Customer portal sections" className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm lg:flex lg:flex-col">{tabs.map(t=><button type="button" key={t.id} onClick={()=>setTab(t.id)} aria-current={tab===t.id?"page":undefined} className={"flex min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-semibold sm:text-sm "+(tab===t.id?"bg-[#EAF3FF] text-[#0064E0]":"text-[#526B82] hover:bg-[#F7FAFF]")}><t.icon size={18} className="shrink-0"/><span>{t.label}</span></button>)}</nav>
    <section className="min-w-0 space-y-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><LockKeyhole size={20}/></span><div><h2 className="text-lg font-bold">{item.heading}</h2><p className="mt-1 text-xs text-slate-500">Authenticated access required</p></div></div><p className="text-sm leading-7 text-slate-600">{item.description}</p><div className="grid gap-3 sm:grid-cols-2">{item.features.map((feature,i)=><article key={feature} className="rounded-xl border border-slate-100 bg-[#FAFBFD] p-4"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-[#0064E0]">{i===0?<FileCheck2 size={17}/>:i===1?<CalendarDays size={17}/>:<CheckCircle2 size={17}/>}</span><h3 className="mt-3 text-sm font-semibold text-[#183852]">{feature}</h3><span className="mt-2 block text-xs text-slate-500">Available after secure customer verification</span></article>)}</div><div className="flex items-start gap-2 rounded-xl bg-blue-50 p-4 text-xs leading-5 text-[#275278]"><LockKeyhole size={16} className="mt-0.5 shrink-0"/>No live payment or customer session can be initiated from this Preview. Never share a customer token with another person.</div></section>
   </div>
  </div>
 </main>;
}
