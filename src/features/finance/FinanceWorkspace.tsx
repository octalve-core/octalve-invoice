"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,Search,SlidersHorizontal,ChevronRight,Download,X,ShieldCheck,LockKeyhole,CalendarDays,RotateCcw,FileText} from "lucide-react";
import {getFinanceMetrics,getFinanceRows,financeDefinitions,formatMinor,type FinanceMode,type FinanceRow} from "./preview-data";

const iso=(value:string)=>{const [d,m,y]=value.split("/");return d&&m&&y?y+"-"+m.padStart(2,"0")+"-"+d.padStart(2,"0"):"";};
function rowCells(mode:FinanceMode,r:FinanceRow,balance:number|null):string[]{
 const amount=r.amountMinor==null?"—":formatMinor(Math.abs(r.amountMinor));
 switch(mode){
  case "statement":return [r.reference,r.title,r.status==="invoice"?"Invoice / Debit":"Payment / Credit",(r.amountMinor||0)<0?"− "+amount:"+ "+amount,balance==null?"Select customer":formatMinor(Math.max(0,balance))];
  case "receivables":return [r.reference,r.title,r.due||"—",amount,r.status];
  case "adjustments":return [r.reference,r.title,r.type,amount,r.type.replace(/^.*· /,"")];
  case "reconciliation":return [r.reference,r.title,r.type,amount,r.details.includes("linked invoice")?"Sample allocated":"Not allocated"];
  case "currencies":return [r.reference,r.title,"NGN",amount,"NGN 1:1"];
  case "communications":return [r.reference,r.title,r.type,r.status,r.date];
  case "audit":return [r.reference,r.title,r.type,r.status,r.date];
  default:return [r.reference,r.title,r.type,r.status,r.date];
 }
}
function isSelected(financeMode:FinanceMode,status:string){
 return financeMode==="statement"?status==="invoice"||status==="payment":true;
}
export default function FinanceWorkspace({mode}:{mode:FinanceMode}){
 const config=financeDefinitions[mode];
 const [query,setQuery]=useState(""),[status,setStatus]=useState("all"),[customer,setCustomer]=useState("all");
 const [from,setFrom]=useState(""),[to,setTo]=useState(""),[draft,setDraft]=useState({from:"",to:"",customer:"all",status:"all"});
 const [filterOpen,setFilterOpen]=useState(false),[selected,setSelected]=useState<FinanceRow|null>(null);
 const [compose,setCompose]=useState(false),[subject,setSubject]=useState("Invoice follow-up"),[message,setMessage]=useState(""),[notice,setNotice]=useState("");
 const all=useMemo(()=>getFinanceRows(mode),[mode]);
 const customers=useMemo(()=>[...new Set(all.map(r=>r.customer).filter((x):x is string=>Boolean(x)))].sort(),[all]);
 const filtered=useMemo(()=>all.filter(r=>{
  if(!isSelected(mode,r.status))return false;
  if(status!=="all"&&r.status!==status)return false;
  if(customer!=="all"&&r.customer!==customer)return false;
  if(from&&iso(r.date)<from)return false;
  if(to&&iso(r.date)>to)return false;
  const lower=query.toLowerCase().trim();return !lower||[r.reference,r.title,r.type,r.details,r.status].some(s=>s.toLowerCase().includes(lower));
 }),[all,mode,status,customer,from,to,query]);
 const balances=useMemo(()=>{
  const map=new Map<string,number>();let running=0;
  for(const r of filtered){if(mode!=="statement"||customer==="all")break;running+=(r.amountMinor||0);map.set(r.id,running);}
  return map;
 },[mode,customer,filtered]);
 const metrics=getFinanceMetrics(mode,all);
 const previewAction=()=>mode==="communications"?setCompose(true):setNotice(config.primaryAction+" requires authenticated merchant data, owner permissions and a secure backend. No record or payment was changed.");
 const reset=()=>{setQuery("");setStatus("all");setCustomer("all");setFrom("");setTo("");};
 return <main className="min-w-0 space-y-5 pb-12">
  <header className="flex flex-wrap items-start justify-between gap-3">
   <div className="min-w-0"><Link href="/dashboard/other-services" className="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-[#0064E0]"><ArrowLeft size={16}/> More services</Link><h1 className="text-2xl font-bold text-[#173652] sm:text-3xl">{config.title}</h1><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{config.description}</p></div>
   <span className="rounded-full bg-[#EAF3FF] px-3 py-1.5 text-xs font-semibold text-[#0064E0]">Demo data · Read-only</span>
  </header>
  <div className="flex items-start gap-2 rounded-xl border border-blue-100 bg-[#F3F8FF] p-3 text-xs leading-5 text-[#245078]"><ShieldCheck className="mt-0.5 shrink-0" size={18}/><p>{config.note} Nothing on this page sends messages, changes financial records, authorizes staff or reports to NRS.</p></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">{metrics.map(m=><article key={m.label} className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><p className="text-[11px] font-medium text-slate-500">{m.label}</p><p className="mt-2 break-words text-base font-bold text-[#183752] sm:text-lg">{m.value}</p></article>)}</div>
  <section aria-label={config.title+" records"} className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
   <header className="space-y-3 border-b border-slate-100 px-4 py-4 sm:px-5">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-base font-semibold text-[#193955]">{mode==="statement"?"Customer statement lines":mode==="receivables"?"Outstanding invoices":config.title+" records"}</h2><p className="mt-0.5 text-xs text-slate-500">{filtered.length} of {all.length} sample records · No data is stored by these controls</p></div>
     <div className="flex gap-2"><button type="button" onClick={()=>setNotice("Exports require an authenticated, immutable statement or report snapshot. No file has been generated.")} className="inline-flex items-center gap-2 rounded-full border border-[#DAE5F2] px-3 py-2 text-xs font-semibold text-[#315D87]"><Download size={15}/> Export</button>
     <button type="button" onClick={previewAction} className="rounded-full bg-[#0064E0] px-4 py-2 text-xs font-semibold text-white">{config.primaryAction}</button></div>
    </div>
    <div className="flex min-w-0 items-center gap-2">
     <label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input aria-label="Search finance records" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search reference, customer or status" className="h-11 w-full min-w-0 rounded-xl border border-slate-200 bg-[#FBFCFF] pl-9 pr-3 text-sm outline-none focus:border-[#0064E0]"/></label>
     <button type="button" aria-label="Filter finance records" onClick={()=>{setDraft({from,to,customer,status});setFilterOpen(true);}} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-[#315A7E]"><SlidersHorizontal size={18}/></button>
    </div>
    <div aria-label="Finance status filters" className="flex flex-wrap gap-1.5">
    {["all",...config.statuses].map(s=><button key={s} type="button" aria-pressed={status===s} onClick={()=>setStatus(s)} className={"rounded-full px-3 py-2 text-[11px] font-semibold "+(status===s?"bg-[#EAF3FF] text-[#0064E0]":"bg-[#F3F5F8] text-slate-500")}>{s==="all"?"All":s==="current"?"Not overdue":s}</button>)}
    </div>
    {mode==="statement"?<label className="flex items-center gap-2 text-xs text-slate-600">Customer <select aria-label="Statement customer" value={customer} onChange={e=>setCustomer(e.target.value)} className="min-w-0 max-w-[240px] rounded-lg border border-slate-200 p-2 text-sm"><option value="all">All customers (no combined balance)</option>{customers.map(c=><option value={c} key={c}>{c}</option>)}</select></label>:null}
   </header>
   <div className="divide-y divide-slate-100 lg:hidden">{filtered.map(r=><button type="button" key={r.id} onClick={()=>setSelected(r)} className="flex w-full min-w-0 items-start gap-3 px-4 py-4 text-left hover:bg-[#F8FBFF]">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EAF3FF] text-[#0064E0]"><FileText size={18}/></span>
      <span className="min-w-0 flex-1"><strong className="block truncate text-sm text-[#173652]">{r.title}</strong><span className="mt-0.5 block truncate text-xs text-slate-500">{r.reference} · {r.date}</span><span className="mt-1 inline-block rounded-full bg-[#F2F5F9] px-2 py-1 text-[10px] font-medium capitalize text-[#486178]">{r.status}</span><span className="mt-2 block text-xs leading-5 text-slate-500">{r.type}</span></span>
      <span className="max-w-[38%] shrink-0 text-right"><strong className="block break-words text-sm text-[#173652]">{r.amountMinor!=null?((r.amountMinor<0?"− ":"")+formatMinor(Math.abs(r.amountMinor))):"—"}</strong><ChevronRight size={17} className="ml-auto mt-2 text-slate-400"/></span>
    </button>)}</div>
   <div className="hidden lg:block"><table className="w-full table-fixed text-left text-sm"><thead className="bg-[#F5F8FC] text-[11px] uppercase tracking-wide text-slate-500"><tr>{config.columns.map((h,i)=><th key={h} className={"break-words px-4 py-3 font-semibold "+(i===0?"w-[18%]":"")}>{h}</th>)}<th className="w-[52px] px-2 py-3"><span className="sr-only">Actions</span></th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(r=><tr key={r.id} className="hover:bg-[#F7FAFF]">{rowCells(mode,r,balances.get(r.id)??null).map((value,i)=><td key={i} className={"break-words px-4 py-4 text-xs "+(i===0?"font-semibold text-[#0064E0]":"text-[#3B5068]")}>{value}</td>)}<td className="px-2"><button type="button" aria-label={"View "+r.reference} onClick={()=>setSelected(r)} className="rounded-lg p-2 text-[#0064E0] hover:bg-[#EAF3FF]"><ChevronRight size={17}/></button></td></tr>)}</tbody></table></div>
   {!filtered.length?<div className="flex min-h-48 flex-col items-center justify-center px-5 py-10 text-center"><LockKeyhole size={30} className="text-slate-300"/><h3 className="mt-3 text-sm font-semibold text-[#193955]">No records match this view</h3><p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">{all.length?"Try clearing the search and filters.":"This workflow has no authenticated activity. We will only display actual events when its backend is approved."}</p><button type="button" onClick={reset} className="mt-4 rounded-full border border-[#0064E0] px-4 py-2 text-xs font-semibold text-[#0064E0]">Clear filters</button></div>:null}
   <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500"><span>Read-only preview · {filtered.length} result(s)</span><span>Desktop table / mobile cards</span></footer>
  </section>
  {notice?<p role="status" className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-xs leading-6 text-[#245078]">{notice}</p>:null}
  {filterOpen?<div className="fixed inset-0 z-[130] flex items-end justify-center bg-[#031C32]/60 lg:items-center lg:p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setFilterOpen(false);}}><section role="dialog" aria-modal="true" aria-label="Finance filters" className="max-h-[90dvh] w-full max-w-md overflow-auto rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl lg:rounded-2xl">
   <div className="mx-auto mb-3 h-1 w-11 rounded-full bg-slate-200 lg:hidden"/><header className="flex items-center justify-between"><h2 className="text-lg font-semibold text-[#173652]">Filter records</h2><button type="button" aria-label="Close filters" onClick={()=>setFilterOpen(false)}><X size={19}/></button></header>
   <div className="mt-5 grid grid-cols-2 gap-3"><label className="text-xs text-slate-600">From<input type="date" aria-label="From finance date" value={draft.from} onChange={e=>setDraft(d=>({...d,from:e.target.value}))} className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 p-2"/></label><label className="text-xs text-slate-600">To<input type="date" aria-label="To finance date" value={draft.to} onChange={e=>setDraft(d=>({...d,to:e.target.value}))} className="mt-2 w-full min-w-0 rounded-xl border border-slate-200 p-2"/></label></div>
   {draft.from&&draft.to&&draft.from>draft.to?<p role="alert" className="mt-2 text-xs text-red-600">End date cannot come before start date.</p>:null}
   <label className="mt-4 block text-xs text-slate-600">Status<select value={draft.status} onChange={e=>setDraft(d=>({...d,status:e.target.value}))} className="mt-2 w-full rounded-xl border border-slate-200 p-3"><option value="all">All statuses</option>{config.statuses.map(s=><option value={s} key={s}>{s}</option>)}</select></label>
   <label className="mt-4 block text-xs text-slate-600">Customer<select value={draft.customer} onChange={e=>setDraft(d=>({...d,customer:e.target.value}))} className="mt-2 w-full rounded-xl border border-slate-200 p-3"><option value="all">All customers</option>{customers.map(c=><option value={c} key={c}>{c}</option>)}</select></label>
   <div className="mt-6 flex gap-3"><button type="button" onClick={()=>{reset();setFilterOpen(false);}} className="flex-1 rounded-full border border-[#0064E0] py-3 text-xs font-semibold text-[#0064E0]">Reset</button><button type="button" disabled={Boolean(draft.from&&draft.to&&draft.from>draft.to)} onClick={()=>{setFrom(draft.from);setTo(draft.to);setCustomer(draft.customer);setStatus(draft.status);setFilterOpen(false);}} className="flex-1 rounded-full bg-[#0064E0] py-3 text-xs font-semibold text-white disabled:opacity-40">Apply filters</button></div>
  </section></div>:null}
  {selected?<div className="fixed inset-0 z-[130] flex items-end justify-center bg-[#031C32]/60 lg:items-center lg:p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section role="dialog" aria-modal="true" aria-label={"Record "+selected.reference} className="w-full max-w-lg space-y-4 rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl lg:rounded-2xl">
   <div className="mx-auto h-1 w-11 rounded-full bg-slate-200 lg:hidden"/><header className="flex items-center justify-between"><h2 className="font-bold text-[#173652]">{selected.reference}</h2><button type="button" onClick={()=>setSelected(null)} aria-label="Close record detail"><X size={20}/></button></header><p className="text-sm font-semibold text-[#173652]">{selected.title}</p><div className="grid grid-cols-2 gap-3 text-xs">{[["Type",selected.type],["Date",selected.date],["Status",selected.status],["Original amount",selected.amountMinor==null?"—":(selected.amountMinor<0?"− ":"")+formatMinor(Math.abs(selected.amountMinor))]].map(([k,v])=><div key={k} className="rounded-xl bg-[#F6F8FB] p-3"><p className="text-slate-500">{k}</p><p className="mt-1 break-words font-semibold text-[#173652]">{v}</p></div>)}</div><p className="rounded-xl bg-blue-50 p-3 text-xs leading-6 text-[#285174]">{selected.details}</p>
   {selected.sourceHref?<Link href={selected.sourceHref} className="block rounded-full bg-[#0064E0] px-4 py-3 text-center text-xs font-semibold text-white">Open source document</Link>:null}
   <button type="button" onClick={()=>setSelected(null)} className="w-full rounded-full border border-[#0064E0] py-3 text-xs font-semibold text-[#0064E0]">Close</button></section></div>:null}
  {compose?<div className="fixed inset-0 z-[130] flex items-end justify-center bg-[#031C32]/60 lg:items-center lg:p-4" onMouseDown={e=>{if(e.target===e.currentTarget)setCompose(false);}}><section role="dialog" aria-modal="true" aria-label="Preview message composer" className="w-full max-w-lg space-y-4 rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl lg:rounded-2xl"><div className="flex items-center justify-between"><h2 className="font-semibold text-[#173652]">Draft a customer message</h2><button type="button" onClick={()=>setCompose(false)} aria-label="Close message composer"><X size={19}/></button></div>
   <p className="text-xs leading-5 text-slate-600">Prepare wording for review. This is not connected to email or customer data and nothing will be sent or saved.</p>
   <label className="block text-xs text-slate-500">Subject<input value={subject} onChange={e=>setSubject(e.target.value)} maxLength={120} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"/></label><label className="block text-xs text-slate-500">Message<textarea value={message} onChange={e=>setMessage(e.target.value)} maxLength={3000} rows={5} placeholder="Write a respectful, factual update. Do not include unverified payment status." className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"/></label>
   <button type="button" onClick={()=>{setNotice("Draft reviewed locally. No message was sent, scheduled or saved.");setCompose(false);}} className="w-full rounded-full bg-[#0064E0] px-4 py-3 text-xs font-semibold text-white">Review draft (no sending)</button>
  </section></div>:null}
  <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><CalendarDays className="mt-0.5 shrink-0" size={16}/> All finance views require server-side tenant checks, immutable financial/event history, and audited approvals before operational launch. <RotateCcw className="mt-0.5 shrink-0" size={15}/></p>
 </main>;
}