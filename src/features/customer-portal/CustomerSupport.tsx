"use client";
import Link from "next/link";
import {useState} from "react";
import {ArrowLeft,ChevronRight,LifeBuoy,MessageSquare,ShieldCheck,SlidersHorizontal} from "lucide-react";
export const supportExamples=[
 {id:"CSP-101",subject:"Invoice access question",merchant:"Weyport Energy",status:"Open",category:"Invoice access"},
 {id:"CSP-102",subject:"Payment status clarification",merchant:"Atlas Supplies",status:"Pending",category:"Payment"}
] as const;
const messages=[
 {id:"msg-1",subject:"Your invoice is ready",merchant:"Weyport Energy",note:"An invoice has been prepared for your review."},
 {id:"msg-2",subject:"Your payment plan",merchant:"Atlas Supplies",note:"Your payment dates are available in the invoice."}
] as const;
const shell="rounded-2xl border border-[#E2EBF5] bg-white p-4 sm:p-6";
export function CustomerSupport(){
 const [status,setStatus]=useState("All"),[showFilter,setShowFilter]=useState(false),[search,setSearch]=useState("");
 const rows=supportExamples.filter(v=>(status==="All"||v.status===status)&&[v.id,v.subject,v.merchant].some(x=>x.toLowerCase().includes(search.toLowerCase().trim())));
 return <div className="space-y-5"><header><p className="text-xs font-semibold text-[#0064E0]">Customer workspace</p><h1 className="mt-1 text-2xl font-bold">Help & support</h1><p className="mt-1 text-xs text-slate-500">Your enquiries, all in one place.</p></header>
  <section className={shell}><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-sm font-bold">Support cases</h2>
   <button onClick={()=>setShowFilter(x=>!x)} aria-expanded={showFilter} className="inline-flex items-center gap-2 rounded-xl border border-[#D9E6F5] px-3 py-2 text-xs font-semibold text-[#0064E0]"><SlidersHorizontal size={15}/> Filters</button></div>
   <label className="mt-3 block"><span className="sr-only">Search support cases</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cases" className="h-11 w-full rounded-xl border border-[#DFE8F3] px-3 text-sm outline-none focus:border-[#0064E0]"/></label>
   {showFilter?<div className="mt-3 flex gap-2" aria-label="Support status filters">{["All","Open","Pending"].map(x=><button onClick={()=>setStatus(x)} key={x} aria-pressed={status===x} className={"rounded-full px-3 py-2 text-xs "+(status===x?"bg-[#0064E0] text-white":"bg-[#F0F4FA]")}>{x}</button>)}</div>:null}
   <div className="mt-4 space-y-2">{rows.map(x=><Link href={"/customer/support/"+x.id} key={x.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#ECF1F8] p-3 hover:bg-[#F7FAFF]">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EBF4FF] text-[#0064E0]"><LifeBuoy size={18}/></span><span className="min-w-0 flex-1"><span className="block break-words text-xs font-bold">{x.subject}</span><span className="mt-1 block break-words text-[11px] text-slate-500">{x.id} · {x.merchant} · {x.status}</span></span><ChevronRight size={17} className="shrink-0 text-slate-400"/></Link>)}</div>
   <button type="button" disabled className="mt-5 rounded-full bg-[#0064E0] px-5 py-3 text-xs font-semibold text-white opacity-50">New support request</button>
   <p className="mt-2 text-xs text-slate-500">New cases require secure customer sign-in.</p>
  </section></div>;
}
export function CustomerSupportDetail({id}:{id:string}){
 const item=supportExamples.find(x=>x.id===id);if(!item)return null;
 return <div className="mx-auto max-w-4xl space-y-5"><Link href="/customer/support" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={16}/> Support cases</Link>
  <header><p className="text-xs text-[#0064E0]">{item.id}</p><h1 className="mt-1 text-2xl font-bold">{item.subject}</h1><p className="mt-1 text-xs text-slate-500">{item.merchant} · {item.status}</p></header>
  <section className={shell}><h2 className="text-sm font-bold">Case details</h2><p className="mt-3 text-xs leading-6 text-slate-600">Your enquiry is shown for interface review. No message has been delivered or case opened in a live support system.</p>
   <p className="mt-4 inline-flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs text-[#315C83]"><ShieldCheck size={17} className="shrink-0"/> A support case does not give Octalve unrestricted access to merchant or customer financial records.</p>
   <button type="button" disabled className="mt-5 block rounded-full bg-[#0064E0] px-5 py-3 text-xs font-semibold text-white opacity-50">Reply to support</button></section></div>;
}
export function CustomerMessageDetail({id}:{id:string}){
 const item=messages.find(m=>m.id===id);if(!item)return null;
 return <div className="mx-auto max-w-4xl space-y-5"><Link href="/customer/messages" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={16}/> Messages</Link>
  <section className={shell}><div className="flex items-center gap-3"><MessageSquare size={21} className="text-[#0064E0]"/><div><h1 className="text-xl font-bold">{item.subject}</h1><p className="text-xs text-slate-500">{item.merchant} · Sample message</p></div></div>
   <p className="mt-5 rounded-xl bg-[#F6F9FD] p-4 text-sm leading-6">{item.note}</p><p className="mt-3 text-xs text-slate-500">No real message was sent, delivered or viewed.</p>
   <button type="button" disabled className="mt-4 rounded-full bg-[#0064E0] px-5 py-3 text-xs font-semibold text-white opacity-50">Reply</button>
  </section></div>;
}
