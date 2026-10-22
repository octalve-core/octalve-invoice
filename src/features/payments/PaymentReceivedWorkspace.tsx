"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeftRight,Search,ShieldCheck,Clock3,AlertTriangle,ExternalLink,ReceiptText,X} from "lucide-react";
import {useAccessibleDialog} from "@/src/features/records/components/useAccessibleDialog";
import {paymentPreview} from "./ledger";
import {paymentActivityPreview,activityTabs,activityProjection,filterPaymentActivity,type PaymentActivity,type ActivityFilter} from "./activity-preview";
import {previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {MerchantPageHeading} from "@/components/dashboard/ui/MerchantPageHeading";
const money=(amount:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:2}).format(amount/100);
const minor=(s:string)=>Math.round((Number(s.replace(/[^\d.]/g,""))||0)*100);
const claims=previewInvoices.map(i=>({id:i.id,amountMinor:minor(i.amount),issued:i.status!=="draft"}));
const sources=[...new Set(paymentActivityPreview.map(row=>row.provider))];
const badge=(phase:string,status:string)=>{
 if(phase==="verified-collection"&&status==="verified")return "bg-emerald-50 text-emerald-800";
 if(phase==="exception"||status==="expired"||status==="failed")return "bg-amber-50 text-amber-900";
 if(phase==="provider-payout")return "bg-sky-50 text-sky-800";
 return "bg-[#EEF5FF] text-[#0064E0]";
};
function StatusPill({row}:{row:PaymentActivity}){return <span className={"inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize "+badge(row.phase,row.status)}>{row.status.replaceAll("-"," ")}</span>;}
function ActivityDetail({row,onClose}:{row:PaymentActivity;onClose:()=>void}){
 useAccessibleDialog(true,onClose);
 return <div className="fixed inset-0 z-[110] flex items-end justify-center bg-[#06192A]/60 p-0 sm:items-center sm:p-4" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section role="dialog" aria-modal="true" aria-label="Payment activity details" className="max-h-[90vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-[26px] bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6">
   <header className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-[#0064E0]">SAMPLE ACTIVITY</p><h2 className="mt-1 text-lg font-bold text-[#173652]">Activity details</h2></div><button type="button" onClick={onClose} aria-label="Close activity details" className="rounded-full p-2 text-[#46627F] hover:bg-blue-50"><X size={20}/></button></header>
   <StatusPill row={row}/>
   <dl className="grid gap-3 text-sm sm:grid-cols-2">{[
    ["Reference",row.reference],["Customer",row.customer],["Provider / source",row.provider],["Activity",row.phase.replaceAll("-"," ")],
    ["Amount (example)",money(row.amountMinor)],["Occurred",row.occurredAt],
    ["Linked payment",row.paymentId??"Not confirmed"],["Invoice",row.invoiceId?"Example invoice "+row.invoiceId:"Unmatched / independent"]
   ].map(([label,value])=><div key={label} className="min-w-0 rounded-xl bg-[#F7FAFE] p-3"><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words font-semibold text-[#173652]">{value}</dd></div>)}</dl>
   <p className="rounded-xl border border-blue-100 bg-[#F2F7FF] p-3 text-xs leading-5 text-[#315477]">{row.note}</p>
   <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Investigation, renewal, allocation, refund or reconciliation requires authenticated provider evidence and financial permissions. No actions are available in this Preview.</div>
   <button type="button" onClick={onClose} className="min-h-11 w-full rounded-full bg-[#0064E0] text-sm font-semibold text-white">Done</button>
  </section>
 </div>;
}
export function PaymentReceivedWorkspace(){
 const [filter,setFilter]=useState<ActivityFilter>("all"),[query,setQuery]=useState(""),[provider,setProvider]=useState("all"),[selected,setSelected]=useState<PaymentActivity|null>(null);
 const rows=useMemo(()=>filterPaymentActivity(paymentActivityPreview,filter,query,provider),[filter,query,provider]);
 const projections=useMemo(()=>activityProjection(claims,paymentPreview),[]);
 const selectTab=(id:ActivityFilter)=>{setFilter(id);};
 return <main className="min-w-0 space-y-5 pb-8">
  <MerchantPageHeading title="Payment Received" description="Collections, provider settlement and payment exceptions"
   actions={<span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0064E0]">Example records · No connections</span>}/>
  <section className="grid grid-cols-2 gap-3 lg:grid-cols-3" aria-label="Verified payment example totals">
   {[{label:"Example verified collections",value:projections.collectedMinor,Icon:ShieldCheck},
     {label:"Allocated to invoices",value:projections.allocatedMinor,Icon:ArrowLeftRight},
     {label:"Unallocated verified funds",value:projections.unallocatedMinor,Icon:Clock3}
   ].map(({label,value,Icon})=><div key={label} className="min-w-0 rounded-2xl border border-[#E2EBF6] bg-white p-4"><Icon size={18} className="text-[#0064E0]"/><p className="mt-3 text-[11px] leading-4 text-slate-500">{label}</p><p className="mt-1 break-words text-base font-bold text-[#173652] sm:text-lg">{money(value)}</p></div>)}
  </section>
  <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E1EAF5] bg-white shadow-sm">
   <div className="border-b border-[#EEF1F6] p-3 sm:p-4">
    <div role="tablist" aria-label="Payment activity status" className="flex max-w-full gap-1.5 overflow-x-auto pb-1">{activityTabs.map(tab=><button key={tab.id} role="tab" type="button" aria-selected={filter===tab.id} onClick={()=>selectTab(tab.id)}
     className={"min-h-10 shrink-0 rounded-full px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-[#0064E0] "+(filter===tab.id?"bg-[#0064E0] text-white":"bg-[#F2F6FB] text-[#58708B] hover:bg-blue-50")}>{tab.label}</button>)}</div>
    <div className="mt-3 flex flex-wrap gap-2">
     <label className="relative min-w-[155px] flex-[2]"><Search size={16} className="absolute left-3 top-3 text-[#7890A8]"/><input aria-label="Search payment activity" placeholder="Customer, invoice, reference…" value={query} onChange={e=>setQuery(e.target.value)} className="h-10 w-full rounded-xl border border-[#DCE7F3] bg-[#F9FBFE] pl-9 pr-3 text-sm text-[#173652] focus-visible:outline-2 focus-visible:outline-[#0064E0]"/></label>
     <label className="min-w-[120px] flex-1"><span className="sr-only">Provider filter</span><select aria-label="Provider filter" value={provider} onChange={e=>setProvider(e.target.value)} className="h-10 w-full rounded-xl border border-[#DCE7F3] bg-white px-3 text-xs text-[#173652] focus-visible:outline-2 focus-visible:outline-[#0064E0]"><option value="all">All providers</option>{sources.map(source=><option key={source} value={source}>{source}</option>)}</select></label>
    </div>
    <p className="mt-2 text-[11px] text-slate-500">{rows.length} example activities. Initialized/pending/expired attempts are not counted as collections.</p>
   </div>
   <div className="space-y-2 p-2 md:p-3">
    {rows.map(row=><button type="button" key={row.id} onClick={()=>setSelected(row)} aria-label={"View activity "+row.id} className="flex w-full min-w-0 items-start gap-3 rounded-xl border border-transparent bg-[#F8FAFD] p-3 text-left transition hover:border-[#CBE1FA] hover:bg-[#F0F6FF] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
     <span className={"mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl "+(row.phase==="exception"?"bg-amber-50 text-amber-700":"bg-blue-50 text-[#0064E0]")}>{row.phase==="exception"?<AlertTriangle size={18}/>:row.phase==="refund-credit"?<ReceiptText size={18}/>:row.phase==="verified-collection"?<ShieldCheck size={18}/>:<Clock3 size={18}/>}</span>
     <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#173652]">{row.customer}</span>
      <span className="mt-1 block truncate text-[11px] text-[#627B96]">{row.id} · {row.provider} · {row.reference}</span>
      <span className="mt-2 inline-flex"><StatusPill row={row}/></span>
     </span>
     <span className="shrink-0 text-right"><span className="block text-xs font-bold text-[#173652] sm:text-sm">{money(row.amountMinor)}</span><span className="mt-1 block text-[10px] text-slate-500">{row.occurredAt}</span><ExternalLink size={15} className="ml-auto mt-1 text-slate-400"/></span>
    </button>)}
    {rows.length===0?<div className="rounded-xl bg-[#F8FAFD] p-8 text-center text-sm text-slate-500">No example activities match these filters.</div>:null}
   </div>
  </section>
  <aside className="flex items-start gap-2 rounded-xl border border-blue-100 bg-[#F5F9FF] p-4 text-xs leading-5 text-[#365976]"><AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#0064E0]"/><div><strong>Preview only.</strong> Invoice claims, collections and receipts are separate records. Payout after fees is not new income, and late transfers remain under investigation until independently verified.
   <Link href="/dashboard/invoice" className="mt-2 block font-semibold text-[#0064E0]">View invoices</Link></div></aside>
  {selected?<ActivityDetail row={selected} onClose={()=>setSelected(null)}/>:null}
 </main>;
}
