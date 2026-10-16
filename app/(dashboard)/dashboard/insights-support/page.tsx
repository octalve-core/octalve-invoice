"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,BarChart3,Bot,Check,ChevronRight,Headset,MessageSquareText,Search,Send,ShieldCheck,Sparkles,WalletCards,X} from "lucide-react";
import {previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {paymentPreview} from "@/src/features/payments/ledger";
const toMinor=(s:string)=>Math.round(Number(s.replace(/[^0-9.]/g,""))*100);
const fmt=(minor:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:2,maximumFractionDigits:2}).format(minor/100);
const verified=paymentPreview.filter(p=>p.status==="verified");
const allocated=verified.flatMap(p=>p.allocations);
const claims=previewInvoices.filter(x=>x.status!=="draft");
const due=claims.reduce((n,i)=>n+toMinor(i.amount),0)-allocated.reduce((n,a)=>n+a.amountMinor,0);
const collected=verified.reduce((n,p)=>n+p.amountMinor,0);
const metricQuestions=[
 {prompt:"How much has been collected?",answer:fmt(collected)+" is shown as verified sample collections. This excludes pending virtual-account attempts and does not treat receipts as extra collections.",link:"/dashboard/report",source:"Sample payment ledger"},
 {prompt:"What is outstanding?",answer:fmt(Math.max(0,due))+" of sample issued invoice claims is not yet matched to verified payment allocations. Credit-note and tax treatment need authenticated review.",link:"/dashboard/finance/receivables",source:"Issued invoice fixtures + verified allocations"},
 {prompt:"Which invoices need attention?",answer:claims.filter(x=>x.status==="overdue"||x.status==="pending"||x.status==="partial").length+" sample invoice(s) are marked pending, partially paid or overdue. Review actual remaining amounts before sending a reminder.",link:"/dashboard/invoice",source:"Invoice example statuses"},
 {prompt:"Are tax returns filed?",answer:"No NRS submission or official filing acknowledgment exists in the Preview. The Tax Centre will require classified invoice lines and verified authority responses.",link:"/dashboard/tax-centre",source:"Tax Centre integration status"}
];
const faq=[
 {title:"Invoices & receipts",summary:"Understand invoice status, payment verification and receipt issuance.",href:"/dashboard/settings/faqs"},
 {title:"Subscription and billing",summary:"Review Octalve plan proposals and account billing availability.",href:"/dashboard/settings/subscription"},
 {title:"Tax and NRS",summary:"Understand fiscal status, filing evidence and missing classifications.",href:"/dashboard/tax-centre"}
];
export default function InsightsSupportPage(){
 const [tab,setTab]=useState<"insights"|"support">("insights"),[question,setQuestion]=useState(metricQuestions[0].prompt),[search,setSearch]=useState("");
 const [message,setMessage]=useState(""),[drafts,setDrafts]=useState<string[]>([]),[feedback,setFeedback]=useState("");
 const selected=metricQuestions.find(q=>q.prompt===question)||metricQuestions[0];
 const articles=useMemo(()=>faq.filter(x=>(x.title+" "+x.summary).toLowerCase().includes(search.toLowerCase())),[search]);
 return <main className="min-w-0 space-y-5 pb-12">
  <div><Link href="/dashboard/other-services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0064E0]"><ArrowLeft size={16}/> More services</Link><h1 className="mt-2 text-2xl font-bold text-[#173652] sm:text-3xl">Insights & Support</h1><p className="mt-1 text-sm text-slate-500">Understand your workspace at a glance or find help from Octalve.</p></div>
  <div role="tablist" aria-label="Insights and support" className="grid grid-cols-2 gap-1 rounded-full bg-white p-1 shadow-sm">{([["insights","Business Insights",BarChart3],["support","Octalve Support",Headset]] as const).map(([value,label,Icon])=><button type="button" role="tab" aria-selected={tab===value} key={value} onClick={()=>setTab(value)} className={"flex min-w-0 items-center justify-center gap-2 rounded-full px-2 py-3 text-xs font-semibold sm:text-sm "+(tab===value?"bg-[#0064E0] text-white":"text-[#58718C]")}><Icon size={17}/>{label}</button>)}</div>
  {tab==="insights"?<>
   <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-[#F0F7FF] p-4 text-xs leading-5 text-[#21507E]"><ShieldCheck size={19} className="mt-0.5 shrink-0"/><p><strong>Evidence-linked sample insights, not AI-generated financial authority.</strong> Figures below are derived from the seeded invoices and sample verified payment allocations. No private merchant data is being sent to an AI model, and no action is taken automatically.</p></div>
   <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[
    {label:"Sample collections",value:fmt(collected),icon:WalletCards},
    {label:"Sample outstanding",value:fmt(Math.max(0,due)),icon:BarChart3},
    {label:"Issued demo invoices",value:String(claims.length),icon:MessageSquareText},
    {label:"Automated actions",value:"0",icon:Bot}
   ].map(card=><article key={card.label} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><card.icon size={19} className="text-[#0064E0]"/><p className="mt-3 text-xs text-slate-500">{card.label}</p><p className="mt-1 break-words text-base font-bold text-[#173652] sm:text-lg">{card.value}</p></article>)}</div>
   <section className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="flex items-center gap-2 font-semibold text-[#173652]"><Sparkles size={19} className="text-[#0064E0]"/> Ask about your sample workspace</h2><p className="text-xs leading-5 text-slate-500">Choose a verified read-only question. Live conversational analysis will be added only with secure tenant-scoped data.</p><div className="space-y-2">{metricQuestions.map(q=><button type="button" key={q.prompt} onClick={()=>setQuestion(q.prompt)} aria-pressed={question===q.prompt} className={"flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left text-xs "+(question===q.prompt?"border-[#0064E0] bg-blue-50 text-[#0064E0]":"border-slate-100 text-[#31516E]")}><span>{q.prompt}</span><ChevronRight size={16}/></button>)}</div></div>
    <article aria-label="Grounded business insight" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-blue-50 text-[#0064E0]"><Bot size={21}/></span><div><h2 className="font-semibold text-[#173652]">Octalve Insights</h2><p className="text-[11px] text-slate-500">Rule-based Preview · no external model call</p></div></div><h3 className="mt-6 text-sm font-semibold text-[#173652]">{selected.prompt}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{selected.answer}</p><div className="mt-6 rounded-xl bg-[#F6F9FD] p-4 text-xs"><strong className="text-[#193955]">Source: {selected.source}</strong><p className="mt-1 text-slate-500">Snapshot: bundled Phase 0I sample data · not a live business event</p><Link href={selected.link} className="mt-3 inline-flex items-center gap-1 font-semibold text-[#0064E0]">Open supporting records <ChevronRight size={14}/></Link></div></article>
   </section>
  </>:<>
   <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-[#285174]"><ShieldCheck size={19} className="shrink-0"/><p>Octalve Support is a UI preview. No agent is connected, no ticket is created and no customer message is sent. Local drafts are not transmitted, retained or assigned.</p></div>
   <div className="grid gap-4 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h2 className="font-semibold text-[#173652]">Help & knowledge base</h2><label className="relative mt-4 block"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input aria-label="Search support articles" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search support topics" className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm"/></label><div className="mt-4 divide-y divide-slate-100">{articles.map(article=><Link key={article.title} href={article.href} className="flex items-center gap-3 py-4"><span className="min-w-0 flex-1"><strong className="block text-sm text-[#193955]">{article.title}</strong><span className="mt-1 block text-xs leading-5 text-slate-500">{article.summary}</span></span><ChevronRight size={17} className="shrink-0 text-slate-400"/></Link>)}{!articles.length?<p className="py-7 text-sm text-slate-500">No matching article.</p>:null}</div></section>
    <section className="flex min-h-[385px] flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center gap-3 border-b border-slate-100 pb-4"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-[#0064E0]"><Headset size={20}/></span><div><h2 className="text-sm font-semibold text-[#193955]">Contact Octalve Support</h2><p className="text-xs text-slate-500">Offline draft mode · No operator connected</p></div></div>
     <div className="flex-1 space-y-3 py-5">{!drafts.length?<div className="grid min-h-[145px] place-items-center text-center"><div><MessageSquareText className="mx-auto text-slate-300" size={28}/><p className="mt-2 text-sm font-semibold text-[#173652]">Your support conversation</p><p className="mt-1 text-xs text-slate-500">Messages will appear here after secure support is connected.</p></div></div>:drafts.map((d,i)=><div key={i} className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-blue-50 p-3"><p className="break-words text-sm text-[#173652]">{d}</p><p className="mt-2 flex items-center gap-1 text-[10px] text-slate-500"><X size={12}/> Local draft · Not sent</p></div>)}</div>
     <label className="block text-xs font-medium text-slate-500">Message<input aria-label="Support message draft" value={message} maxLength={1200} onChange={e=>setMessage(e.target.value)} placeholder="Describe what you need help with" className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm"/></label>
     <button type="button" disabled={!message.trim()} onClick={()=>{setDrafts(d=>[...d,message.trim()]);setMessage("");setFeedback("Draft added locally; nothing was sent.");}} className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] p-3 text-xs font-semibold text-white disabled:opacity-40"><Send size={15}/> Preview message (not sent)</button>{feedback?<p role="status" className="mt-2 text-xs text-[#0064E0]">{feedback}</p>:null}
    </section>
   </div>
  </>}
  <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><Check size={16} className="mt-0.5 shrink-0"/> Security baseline: OWASP ASVS 5.0, tenant-scoped evidence, redacted customer data, no model-authoritative money movement, explicit approval for future actions.</p>
 </main>;
}