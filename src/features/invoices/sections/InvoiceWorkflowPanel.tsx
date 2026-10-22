"use client";
import {useState} from "react";
import Link from "next/link";
import {ChevronRight,CircleHelp,FileText,LockKeyhole,Mail,MessageSquare,Percent,QrCode,Send,ShieldCheck,X} from "lucide-react";
import type {PreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import {splitInstallment,allocateStages} from "@/src/features/invoices/lib/installments";
import {evaluateCollectionPlan,providerPublishedReference,type CollectionMode,type DynamicProvider,type ProposedStage} from "@/src/features/invoices/lib/collection-expiry";
import {dynamicAccountCapabilities} from "@/src/features/merchant-setup/payment-capabilities";
import {useAccessibleDialog} from "@/src/features/records/components/useAccessibleDialog";
type WorkflowTab="payments"|"communications"|"portal";
type MessageKind="issue"|"reminder"|"update"|"paid";
function minorAmount(v:string){const n=Number(v.replace(/[^0-9.]/g,""));const minor=Math.round(n*100);if(!Number.isSafeInteger(minor)||minor<0)throw new Error("Invalid invoice amount");return minor;}
const messageKinds:{kind:MessageKind;label:string;subject:string;body:string}[]=[
 {kind:"issue",label:"Send invoice",subject:"Your invoice is ready",body:"Hello, please find the invoice for your review. Let us know if you have any questions."},
 {kind:"reminder",label:"Payment reminder",subject:"Friendly invoice payment reminder",body:"Hello, this is a friendly reminder to review your outstanding invoice. Please disregard this message if payment is already being reconciled."},
 {kind:"update",label:"Account update",subject:"Update about your invoice",body:"Hello, we are writing to share an update about your invoice. Please contact us if you need clarification."},
 {kind:"paid",label:"Payment confirmation",subject:"Payment received – thank you",body:"Hello, thank you for your payment. A formal receipt can only be issued against a verified transaction."}
];
export default function InvoiceWorkflowPanel({invoice,currency="NGN",invoiceDueAtLagos=""}:{invoice:PreviewInvoice;currency?:"NGN"|"USD"|"GBP"|"EUR";invoiceDueAtLagos?:string}){
 const fmt=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(n/100);
 const [tab,setTab]=useState<WorkflowTab>("payments"),[percent,setPercent]=useState(70),[messageKind,setMessageKind]=useState<MessageKind>("reminder");
 const [stageMode,setStageMode]=useState<"full"|"two"|"custom">("two");
 const [collectionMode,setCollectionMode]=useState<CollectionMode>("company-bank");
 const [dynamicProvider,setDynamicProvider]=useState<DynamicProvider>("monnify-invoice");
 const [twoDates,setTwoDates]=useState<[string,string]>(["",""]);
 const [stages,setStages]=useState<{id:string;share:number;due:string}[]>([
  {id:"stage-1",share:50,due:""},{id:"stage-2",share:30,due:""},{id:"stage-3",share:20,due:""}
 ]);
 const [sheet,setSheet]=useState(false),[subject,setSubject]=useState(""),[body,setBody]=useState(""),[notice,setNotice]=useState("");
 useAccessibleDialog(sheet,()=>setSheet(false));
 const total=minorAmount(invoice.amount);
 const allocated=0; // A draft has no verified payment allocations.
 const outstanding=total-allocated;
 const [first,last]=splitInstallment(total,percent);
 const stageTotal=stages.reduce((sum,s)=>sum+s.share,0);
 const validSchedule=stages.length>=2&&stages.length<=6&&stageTotal===100&&stages.every(s=>Number.isInteger(s.share)&&s.share>0&&s.share<=99);
 const stageAmounts=validSchedule?allocateStages(total,stages.map(s=>s.share)):null;
 const proposedStages:ProposedStage[]=stageMode==="full"
  ?[{id:"full",share:100,dueAtLagos:invoiceDueAtLagos}]
  :stageMode==="two"
   ?[{id:"first",share:percent,dueAtLagos:twoDates[0]},{id:"remaining",share:100-percent,dueAtLagos:twoDates[1]}]
   :stages.map(s=>({id:s.id,share:s.share,dueAtLagos:s.due}));
 const planCheck=evaluateCollectionPlan({
  totalMinor:total,invoiceDueAtLagos,stages:proposedStages,mode:collectionMode,
  provider:collectionMode==="dynamic-account"?dynamicProvider:undefined
 });
 const previewReference=providerPublishedReference(dynamicProvider);
 const dateInputClass="mt-1 block w-full min-w-0 rounded-lg border border-[#DDEAF8] bg-white p-2 text-xs focus-visible:outline-2 focus-visible:outline-[#0064E0]";
 const message=messageKinds.find(x=>x.kind===messageKind)!;
 function openComposer(kind:MessageKind){
  const selected=messageKinds.find(x=>x.kind===kind)!;
  setMessageKind(kind);setSubject(selected.subject);setBody(selected.body);setSheet(true);setNotice("");
 }
 return <section aria-label="Invoice workflows" className="min-w-0 overflow-hidden rounded-2xl border border-[#E9EFF7] bg-white shadow-sm">
  <header className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 p-4 sm:p-5"><div><h2 className="text-base font-bold text-[#173652]">Invoice workflow</h2><p className="mt-1 text-xs text-slate-500">Set payment terms and customer messages.</p></div><span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-[#0064E0]">Draft</span></header>
  <div role="tablist" aria-label="Invoice workflow views" className="flex flex-wrap gap-1.5 border-b border-slate-100 p-3">{([
   ["payments","Installments",Percent],["communications","Communication",Mail],["portal","Share & portal",QrCode]
  ] as const).map(([value,label,Icon])=><button type="button" role="tab" aria-selected={tab===value} key={value} onClick={()=>setTab(value)} className={"flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold "+(tab===value?"bg-[#EAF3FF] text-[#0064E0]":"bg-[#F3F5F8] text-slate-600")}><Icon size={16}/>{label}</button>)}</div>
  {tab==="payments"?<div className="space-y-4 p-4 sm:p-5">
   <div className="grid grid-cols-3 gap-2">{[["Invoice total",fmt(total)],["Payments recorded",fmt(allocated)],["Balance to plan",outstanding<0?"Check total":fmt(outstanding)]].map(([k,v])=><div key={k} className="min-w-0 rounded-xl bg-[#F5F8FC] p-3"><span className="block text-[10px] text-slate-500">{k}</span><strong className="mt-1 block break-words text-xs text-[#173652] sm:text-sm">{v}</strong></div>)}</div>
   <div role="group" aria-label="Payment schedule options" className="flex w-fit rounded-full bg-[#F2F5FA] p-1">
    {(["full","two","custom"] as const).map(value=><button type="button" key={value} aria-pressed={stageMode===value} onClick={()=>setStageMode(value)} className={"rounded-full px-4 py-2 text-xs font-semibold "+(stageMode===value?"bg-[#0064E0] text-white":"text-[#4E6781]")}>{value==="full"?"Full payment":value==="two"?"Two installments":"Custom milestones"}</button>)}
   </div>
   <div className="grid gap-2 rounded-xl border border-blue-100 bg-[#F6F9FF] p-3 sm:grid-cols-2">
    <label className="text-xs font-semibold text-[#193955]">Payment method
     <select aria-label="Collection method preview" value={collectionMode} onChange={e=>setCollectionMode(e.target.value as CollectionMode)} className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-blue-100 bg-white px-2 text-sm">
      <option value="company-bank">Company bank transfer</option>
      <option value="dynamic-account">Dynamic Account (not connected)</option>
     </select>
    </label>
    {collectionMode==="dynamic-account"?<label className="text-xs font-semibold text-[#193955]">Provider
      <select aria-label="Dynamic account provider reference" value={dynamicProvider} onChange={e=>setDynamicProvider(e.target.value as DynamicProvider)}
        className="mt-1.5 h-10 w-full min-w-0 rounded-lg border border-blue-100 bg-white px-2 text-sm">
       {dynamicAccountCapabilities.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
     </label>:<p className="self-center text-[11px] leading-5 text-slate-600">Bank transfers are recorded after confirmation.</p>}
   </div>
   {collectionMode==="dynamic-account"?<p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
    {previewReference?.label} is a published capability reference, not your merchant limit. No account or expiry has been issued.
    Each payment date must be within the provider-confirmed account expiry.
   </p>:null}
   {stageMode==="full"?<p className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-[#17466D]">
    Full payment · {fmt(total)} · invoice due {invoiceDueAtLagos||"not set"} (Africa/Lagos).
   </p>:null}
   {stageMode==="two"?<div><label htmlFor={"deposit-"+invoice.id} className="flex flex-wrap justify-between gap-2 text-xs font-semibold text-[#193955]">First installment / deposit <span>{percent}% / {100-percent}%</span></label><input id={"deposit-"+invoice.id} type="range" min="1" max="99" step="1" value={percent} onChange={e=>setPercent(Number(e.target.value))} className="mt-3 w-full accent-[#0064E0]"/><div className="mt-2 grid grid-cols-2 gap-3">{[["First milestone",fmt(first)],["Remaining milestone",fmt(last)]].map(([k,v])=><div key={k} className="rounded-xl border border-blue-100 bg-blue-50 p-3"><span className="text-xs text-slate-600">{k}</span><strong className="mt-1 block text-sm text-[#17466D]">{v}</strong></div>)}</div>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">{([0,1] as const).map((n)=><label key={n} className="text-xs text-[#193955]">{n===0?"First milestone due (Lagos)":"Remaining milestone due (Lagos)"}
     <input type="datetime-local" step={60} aria-label={n===0?"First milestone due time":"Remaining milestone due time"}
      max={invoiceDueAtLagos||undefined} value={twoDates[n]}
      onChange={e=>setTwoDates(previous=>n===0?[e.target.value,previous[1]]:[previous[0],e.target.value])} className={dateInputClass}/>
    </label>)}</div></div>:stageMode==="custom"?
    <div className="space-y-3">
     <p className="text-xs text-slate-500">Split 100% across 2–6 payments.</p>
     {stages.map((stage,i)=><div key={stage.id} className="grid grid-cols-[minmax(0,1fr)_80px] gap-2 rounded-xl border border-[#DDEAF8] p-3 sm:grid-cols-[minmax(0,1fr)_85px_minmax(0,1fr)_auto]">
      <label className="text-xs text-slate-600">Milestone {i+1}<input aria-label={"Milestone "+(i+1)+" due time"} type="datetime-local" step={60} max={invoiceDueAtLagos||undefined} value={stage.due} onChange={e=>setStages(items=>items.map(s=>s.id===stage.id?{...s,due:e.target.value}:s))} className="mt-1 block w-full min-w-0 rounded-lg border border-[#DDEAF8] p-2 text-xs"/></label>
      <label className="text-xs text-slate-600">Share (%)<input aria-label={"Milestone "+(i+1)+" percentage"} type="number" min={1} max={99} step={1} value={stage.share} onChange={e=>setStages(items=>items.map(s=>s.id===stage.id?{...s,share:Number(e.target.value)}:s))} className="mt-1 block w-full rounded-lg border border-[#DDEAF8] p-2 text-xs"/></label>
      <div className="col-span-1 pt-1 text-xs sm:col-span-1 sm:pt-4"><span className="block text-slate-500">Proposed amount</span><strong className="mt-1 block text-[#173652]">{stageAmounts?fmt(stageAmounts[i]):"—"}</strong></div>
      <button type="button" disabled={stages.length<=2} onClick={()=>setStages(items=>items.filter(s=>s.id!==stage.id))} aria-label={"Remove milestone "+(i+1)} className="self-end rounded-full border border-[#DBE6F4] px-2 py-1 text-[11px] text-[#0064E0] disabled:opacity-40">Remove</button>
     </div>)}
     <div className="flex flex-wrap items-center justify-between gap-2">
      <button type="button" disabled={stages.length>=6} onClick={()=>setStages(items=>[...items,{id:crypto.randomUUID(),share:0,due:""}])} className="rounded-full border border-[#0064E0] px-3 py-2 text-xs font-semibold text-[#0064E0] disabled:opacity-40">Add milestone</button>
      <span role={validSchedule?"status":"alert"} className={"text-xs font-semibold "+(validSchedule?"text-[#118660]":"text-amber-800")}>Total allocation: {stageTotal}% {validSchedule?"· balanced":"· must be exactly 100%"}</span>
     </div>
    </div>:null}
   <p className="text-xs text-slate-500">Invoice due: <strong>{invoiceDueAtLagos||"invalid"}</strong> (Lagos time). Payment dates must be in order and no later than the due date.</p>
   {planCheck.errors.length>0?<div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
    <strong>Plan cannot be confirmed yet.</strong><ul className="mt-1 list-inside list-disc">{planCheck.errors.map(error=><li key={error}>{error}</li>)}</ul>
   </div>:<p role="status" className="text-xs font-semibold text-[#118660]">Draft dates and percentages are internally consistent. No collection has been activated.</p>}
   <p className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-950"><ShieldCheck size={17} className="mt-0.5 shrink-0"/>These payment terms take effect only when the invoice is issued.</p>
   <button type="button" disabled={planCheck.errors.length>0} onClick={()=>setNotice(stageMode==="full"?`Full payment of ${fmt(total)} proposed; not saved or issued.`:stageMode==="two"?`Proposed split: ${percent}% (${fmt(first)}) and ${100-percent}% (${fmt(last)}). No payment schedule was saved or communicated.`:`Proposed milestones: ${stages.map((s,i)=>`${s.share}% (${fmt(stageAmounts![i])})`).join(" · ")}. No payment schedule was saved or communicated.`)} className="rounded-full bg-[#0064E0] px-4 py-2.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Review proposed split</button>
  </div>:null}
  {tab==="communications"?<div className="space-y-4 p-4 sm:p-5"><p className="text-xs leading-5 text-slate-500">Prepare a message. Nothing is sent yet.</p><div className="grid gap-2 sm:grid-cols-2">{messageKinds.filter(m=>m.kind!=="paid").map(m=><button type="button" key={m.kind} onClick={()=>openComposer(m.kind)} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 p-3 text-left hover:bg-[#F5F9FF]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EDF5FF] text-[#0064E0]"><MessageSquare size={17}/></span><span className="min-w-0 flex-1 text-xs font-semibold text-[#193955]">{m.label}</span><ChevronRight size={16} className="text-slate-400"/></button>)}</div><p className="text-xs text-slate-500">Messages sent from this draft: <strong>0</strong></p></div>:null}
  {tab==="portal"?<div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5"><article className="rounded-xl border border-slate-100 p-4"><QrCode className="text-[#0064E0]" size={26}/><h3 className="mt-3 text-sm font-semibold text-[#173652]">Customer portal QR</h3><p className="mt-2 text-xs leading-6 text-slate-600">Customer access opens after the invoice is issued.</p></article><article className="rounded-xl border border-slate-100 p-4"><LockKeyhole className="text-[#0064E0]" size={26}/><h3 className="mt-3 text-sm font-semibold text-[#173652]">Customer self-service</h3><p className="mt-2 text-xs leading-6 text-slate-600">Secure document access will be available after setup.</p></article><p className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900 sm:col-span-2"><CircleHelp size={16} className="mr-2 inline"/>Customer, payment and NRS QR codes are different. None is active yet.</p><Link href="/portal" className="rounded-full border border-[#0064E0] px-4 py-3 text-center text-xs font-semibold text-[#0064E0] sm:col-span-2">Explore customer portal</Link></div>:null}
  {notice?<p role="status" className="mx-4 mb-4 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-[#21507B]">{notice}</p>:null}
  {sheet?<div className="fixed inset-0 z-[130] flex items-end justify-center bg-[#04182A]/60 lg:items-center lg:p-4"><section role="dialog" aria-modal="true" aria-label="Draft invoice communication" className="max-h-[92dvh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:rounded-2xl"><div className="flex items-center justify-between"><h2 className="font-semibold text-[#173652]">{message.label}</h2><button type="button" onClick={()=>setSheet(false)} aria-label="Close invoice message"><X size={18}/></button></div><p className="text-xs leading-5 text-slate-500">Recipient: {invoice.email||"Add a customer email first"} · This is a draft; reviewing it will not send a message.</p><label className="block text-xs text-slate-500">Subject<input value={subject} onChange={e=>setSubject(e.target.value)} maxLength={140} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"/></label><label className="block text-xs text-slate-500">Message<textarea rows={5} value={body} onChange={e=>setBody(e.target.value)} maxLength={4000} className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm"/></label><div className="rounded-xl bg-blue-50 p-3 text-xs leading-5 text-[#1D5278]"><FileText size={17} className="mr-2 inline"/> Related invoice: {invoice.reference}. Paid status must always be verified before a confirmation or receipt is actually sent.</div><button type="button" disabled={!subject.trim()||!body.trim()} onClick={()=>{setSheet(false);setNotice("Message draft reviewed locally. No email, SMS or reminder was sent or queued.");}} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] py-3 text-xs font-semibold text-white disabled:opacity-40"><Send size={15}/> Review draft (not sent)</button></section></div>:null}
  <footer className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">Nothing is sent or recorded from this draft.</footer>
 </section>;
}
