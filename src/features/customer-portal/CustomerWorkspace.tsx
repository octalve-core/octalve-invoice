"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowRight,Bell,CalendarDays,CheckCircle2,ChevronRight,Clock3,FileText,MessageSquare,ReceiptText,Search,ShieldCheck,Store,WalletCards} from "lucide-react";
import {minorMoney,sampleCustomerInvoices,sampleCustomerSummary,sampleMerchants,sampleMessages,type CustomerInvoice} from "./sample-data";
export type CustomerSection="overview"|"invoices"|"payments"|"receipts"|"merchants"|"messages"|"notifications"|"settings";
export const customerSections:readonly CustomerSection[]=["overview","invoices","payments","receipts","merchants","messages","notifications","settings"];
const statusTone:Record<CustomerInvoice["status"],string>={
 paid:"bg-emerald-50 text-emerald-700",pending:"bg-blue-50 text-[#0064E0]",
 partial:"bg-violet-50 text-violet-700",overdue:"bg-rose-50 text-rose-700"};
const container="rounded-2xl border border-[#E3EBF5] bg-white p-4 sm:p-5";
const sectionTitles:Record<CustomerSection,string>={overview:"Overview",invoices:"My invoices",payments:"Payments",receipts:"Receipts",merchants:"My merchants",messages:"Messages",notifications:"Notifications",settings:"My account"};
function InvoiceRow({invoice}:{invoice:CustomerInvoice}){
 return <Link href={"/customer/invoices/"+invoice.id} className="block min-w-0 rounded-xl border border-[#EAF0F7] bg-white p-3 transition-colors hover:border-[#B9D8FF] hover:bg-[#F8FBFF]">
  <div className="flex min-w-0 items-start gap-3">
   <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF3FF] text-[#0064E0]"><FileText size={18}/></span>
   <div className="min-w-0 flex-1">
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-3 gap-y-1">
     <span className="min-w-0 break-words text-sm font-bold leading-5 text-[#18364F]">{invoice.merchant}</span>
     <span className="shrink-0 text-xs font-bold tabular-nums text-[#18364F] sm:text-sm">{minorMoney(invoice.amountMinor)}</span>
    </div>
    <p className="mt-1 break-words text-[11px] leading-4 text-[#647B94]">{invoice.reference} · {invoice.title}</p>
    <div className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-2">
     <span className="text-[11px] text-[#8495A8]">Due {invoice.dueOn}</span>
     <span className={"rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize "+statusTone[invoice.status]}>{invoice.status==="partial"?"Partially paid":invoice.status}</span>
    </div>
   </div>
  </div>
 </Link>;
}
function EmptyAccess({icon:Icon,title,note}:{icon:typeof Bell;title:string;note:string}){
 return <section className={container+" min-w-0 flex min-h-[190px] flex-col items-center justify-center text-center"}>
  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#EDF5FF] text-[#0064E0]"><Icon size={22}/></span>
  <h2 className="mt-3 text-sm font-bold text-[#173652]">{title}</h2>
  <p className="mt-1 max-w-sm text-xs leading-5 text-[#698099]">{note}</p>
 </section>;
}
export function CustomerWorkspace({section="overview"}:{section?:CustomerSection}){
 const [query,setQuery]=useState("");
 const summary=sampleCustomerSummary();
 const rows=useMemo(()=>sampleCustomerInvoices.filter(i=>[i.merchant,i.reference,i.title,i.status].some(x=>x.toLowerCase().includes(query.trim().toLowerCase()))),[query]);
 return <>
  <div className="flex flex-wrap items-start justify-between gap-3">
   <div><p className="text-xs font-semibold text-[#0064E0]">Customer workspace</p>
    <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#173652] sm:text-3xl">{section==="overview"?"Your invoices, in one place":sectionTitles[section]}</h1>
    <p className="mt-1 text-xs text-[#71869D]">{section==="overview"?"Across the businesses you buy from.":section==="invoices"?"View invoices from different businesses.":"Keep everything organised in one place."}</p>
   </div>
   <span className="inline-flex items-center gap-2 rounded-full border border-[#E2EAF4] bg-white px-3 py-2 text-[11px] font-semibold text-[#69809A]"><ShieldCheck size={15}/> Sample data</span>
  </div>
  {section==="overview"?<>
   <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
    {[
     {label:"Outstanding",value:minorMoney(summary.outstandingMinor),icon:WalletCards,tone:"text-[#0064E0] bg-[#EAF3FF]"},
     {label:"Payments shown",value:minorMoney(summary.paidMinor),icon:CheckCircle2,tone:"text-emerald-700 bg-emerald-50"},
     {label:"Open invoices",value:String(summary.unpaidCount),icon:FileText,tone:"text-violet-700 bg-violet-50"},
     {label:"Businesses",value:String(summary.merchantCount),icon:Store,tone:"text-amber-700 bg-amber-50"}
    ].map(({label,value,icon:Icon,tone})=><div className={container} key={label}>
     <span className={"grid h-9 w-9 place-items-center rounded-xl "+tone}><Icon size={18}/></span>
     <p className="mt-4 text-[11px] text-[#73889F]">{label}</p>
     <p className="mt-1 break-words text-lg font-bold text-[#173652] sm:text-xl">{value}</p>
    </div>)}
   </div>
   <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
    <section className={container+" min-w-0"}>
     <div className="mb-4 flex items-center justify-between gap-2"><h2 className="font-bold text-[#173652]">Recent invoices</h2><Link href="/customer/invoices" className="text-xs font-semibold text-[#0064E0]">View all <ArrowRight size={13} className="inline"/></Link></div>
     <div className="space-y-2">{sampleCustomerInvoices.slice(0,3).map(i=><InvoiceRow key={i.id} invoice={i}/>)}</div>
    </section>
    <section className={container+" min-w-0"}>
     <h2 className="font-bold text-[#173652]">Upcoming payments</h2>
     <p className="mt-1 text-xs text-slate-500">Dates on your sample invoices</p>
     <div className="mt-4 space-y-3">{sampleCustomerInvoices.filter(i=>i.status==="pending"||i.status==="partial").map(i=>
      <Link key={i.id} href={"/customer/invoices/"+i.id} className="flex min-w-0 items-start gap-2 rounded-xl bg-[#F7FAFE] p-3 hover:bg-[#ECF5FF]">
       <CalendarDays size={18} className="mt-1 shrink-0 text-[#0064E0]"/>
       <span className="min-w-0 flex-1"><span className="block break-words text-xs font-semibold text-[#173652]">{i.merchant}</span><span className="mt-1 block break-words text-[11px] leading-4 text-slate-500">{i.dueOn} · {minorMoney(i.amountMinor-i.paidMinor)} due</span></span>
       <ChevronRight size={16} className="shrink-0 text-[#9BADBF]"/>
      </Link>)}</div>
    </section>
   </div>
   <section className={container}><div className="mb-3 flex items-center justify-between"><h2 className="font-bold text-[#173652]">Businesses you follow</h2><Link href="/customer/merchants" className="text-xs font-semibold text-[#0064E0]">See all</Link></div>
    <div className="grid gap-3 sm:grid-cols-3">{sampleMerchants.map(m=><div key={m.id} className="flex items-center gap-3 rounded-xl border border-[#EAF0F8] p-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF3FF] text-xs font-bold text-[#0064E0]">{m.initials}</span><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#173652]">{m.name}</p><p className="truncate text-[11px] text-slate-500">{m.type}</p></div></div>)}</div>
   </section>
  </>:null}
  {section==="invoices"?<section className={container}>
   <label className="relative mb-4 block max-w-lg"><Search size={17} className="absolute left-3 top-3 text-[#8B9FB3]"/><input type="search" aria-label="Search customer invoices" placeholder="Search invoices or businesses" value={query} onChange={e=>setQuery(e.target.value)}
    className="h-11 w-full rounded-xl border border-[#DFE8F3] bg-[#F8FAFD] pl-10 pr-3 text-sm outline-none focus:border-[#0064E0]"/></label>
   <p className="mb-3 text-xs text-slate-500">{rows.length} sample invoice{rows.length===1?"":"s"}</p>
   <div className="space-y-2">{rows.map(i=><InvoiceRow key={i.id} invoice={i}/>)}
    {rows.length===0?<p className="rounded-xl bg-[#F8FAFD] p-8 text-center text-xs text-slate-500">No matching invoices.</p>:null}</div>
  </section>:null}
  {section==="payments"?<section className={container}>
   <h2 className="font-bold text-[#173652]">Payment activity</h2><p className="mt-1 text-xs text-slate-500">Amounts below are sample allocations, not transactions.</p>
   <div className="mt-4 space-y-2">{sampleCustomerInvoices.map(i=><div key={i.id} className="flex items-center gap-3 rounded-xl border border-[#EDF2F8] p-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF3FF] text-[#0064E0]">{i.paidMinor>0?<CheckCircle2 size={18}/>:<Clock3 size={18}/>}</span>
    <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{i.merchant}</p><p className="truncate text-[11px] text-slate-500">{i.reference} · {i.paidMinor>0?"Payment shown":"Awaiting payment"}</p></div>
    <span className="text-xs font-bold">{minorMoney(i.paidMinor)}</span>
   </div>)}</div>
  </section>:null}
  {section==="receipts"?<EmptyAccess icon={ReceiptText} title="Receipts will appear here" note="Issued receipts linked to your authorised payments will be available when customer access is active."/>:null}
  {section==="merchants"?<section className={container}><h2 className="mb-4 font-bold text-[#173652]">Your businesses</h2><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
   {sampleMerchants.map(m=><div key={m.id} className="rounded-xl border border-[#E9EFF6] p-4"><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#EAF3FF] font-bold text-[#0064E0]">{m.initials}</span><h3 className="mt-3 text-sm font-bold">{m.name}</h3><p className="mt-1 text-xs text-slate-500">{m.type}</p>
    <p className="mt-3 text-[11px] text-[#69819B]">Example business · Account access not enabled</p></div>)}
  </div></section>:null}
  {section==="messages"?<section className={container}><h2 className="mb-4 font-bold">Conversations</h2><div className="space-y-2">{sampleMessages.map(m=><Link href={"/customer/messages/"+m.id} key={m.id} className="flex items-center gap-3 rounded-xl border border-[#E8EFF7] p-4 hover:bg-[#F7FAFF]">
   <MessageSquare size={19} className="text-[#0064E0]"/><div className="min-w-0 flex-1"><p className="text-xs font-bold">{m.subject}</p><p className="mt-1 truncate text-[11px] text-slate-500">{m.sender} · {m.date}</p></div></Link>)}</div>
   <p className="mt-4 text-xs text-slate-500">Sample messages are read-only until secure customer access is available.</p></section>:null}
  {section==="notifications"?<EmptyAccess icon={Bell} title="You're all caught up" note="Invoice updates and payment reminders will appear here after customer notifications are enabled."/>:null}
  {section==="settings"?<section className={container}><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold">Account preferences</h2><Link href="/customer/access" className="inline-flex min-h-10 items-center rounded-full border border-[#0064E0] px-3 text-xs font-medium text-[#0064E0]">Access readiness</Link></div>
   <div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Profile","Identity and contact details"],["Security","Sessions, verification and access"],["Notifications","Email and in-app preferences"],["Connected businesses","Manage business-specific access"]].map(([title,note])=><div key={title} className="rounded-xl border border-[#E8EFF7] p-4"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-1 text-xs text-slate-500">{note}</p><span className="mt-3 inline-block text-[11px] font-medium text-[#0064E0]">Available after account setup</span></div>)}</div>
  </section>:null}
  <p className="text-[11px] leading-5 text-[#8395AA]">This customer experience uses fictional sample records. No live customer access, invoices or payments are connected.</p>
 </>;
}
export function CustomerInvoiceDetail({id}:{id:string}){
 const invoice=sampleCustomerInvoices.find(x=>x.id===id);
 if(!invoice)return null;
 return <div className="mx-auto max-w-4xl space-y-5">
  <Link href="/customer/invoices" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0064E0]">← All invoices</Link>
  <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="text-xs font-semibold text-[#0064E0]">Invoice details</p><h1 className="mt-1 text-2xl font-bold">{invoice.reference}</h1></div>
   <span className={"rounded-full px-3 py-2 text-xs font-semibold capitalize "+statusTone[invoice.status]}>{invoice.status==="partial"?"Partially paid":invoice.status}</span>
  </div>
  <section className={container+" space-y-5"}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBF1F8] pb-4"><div><p className="text-xs text-slate-500">From</p><h2 className="mt-1 text-lg font-bold">{invoice.merchant}</h2></div><span className="rounded-lg bg-[#F3F8FF] px-3 py-2 text-xs font-semibold text-[#0064E0]">Sample invoice</span></div>
   <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[["Invoice date",invoice.issuedOn],["Due date",invoice.dueOn],["Invoice total",minorMoney(invoice.amountMinor)],["Amount outstanding",minorMoney(invoice.amountMinor-invoice.paidMinor)]].map(([label,value])=><div key={label}><p className="text-[11px] text-slate-500">{label}</p><p className="mt-2 break-words text-sm font-bold text-[#173652]">{value}</p></div>)}</div>
   <div className="rounded-xl bg-[#F5F9FE] p-4"><p className="text-xs font-semibold">{invoice.title}</p><p className="mt-1 text-xs text-slate-500">Original issued document, payment details and receipts require secure customer authorisation.</p></div>
   <div className="flex flex-wrap gap-2"><button type="button" disabled title="Available after authorised issuance and customer access" className="rounded-full bg-[#0064E0] px-5 py-3 text-xs font-bold text-white opacity-50">Pay invoice</button>
    <button type="button" disabled title="Available for issued documents" className="rounded-full border border-[#C5D8EF] px-5 py-3 text-xs font-semibold text-[#0064E0] opacity-50">Download</button></div>
  </section>
 </div>;
}
