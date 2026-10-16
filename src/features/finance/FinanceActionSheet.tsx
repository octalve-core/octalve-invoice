"use client";
import {useState} from "react";
import {CheckCircle2,Info,LockKeyhole,X} from "lucide-react";
import type {FinanceMode} from "./preview-data";

type Field={key:string;label:string;kind?:"select"|"date"|"textarea"|"money"|"rate";options?:string[];hint?:string;required?:boolean};
type Spec={title:string;intro:string;fields:Field[];authority:string};
const specs:Record<Exclude<FinanceMode,"communications">,Spec>={
 statement:{
  title:"Prepare customer statement",
  intro:"Choose the customer and date window for a statement request. Only an authenticated, tenant-scoped ledger can produce a downloadable original.",
  fields:[{key:"customer",label:"Customer",kind:"select",required:true},{key:"from",label:"Start date",kind:"date",required:true},{key:"to",label:"End date",kind:"date",required:true}],
  authority:"Issued invoice, verified allocation, credit, refund and reversal history must be snapshotted and reconciled before a document is issued."
 },
 approvals:{
  title:"Prepare an approval request",
  intro:"Record why a sensitive action needs a different authorized reviewer. Nothing is submitted or granted here.",
  fields:[{key:"action",label:"Requested change",kind:"select",options:["Record bank-confirmed payment","Issue credit note","Void issued document","Change staff privileges","Approve refund"],required:true},{key:"reason",label:"Business reason",kind:"textarea",required:true}],
  authority:"Maker and checker must be different authorized persons; MFA, transaction context, attachments, audit and optimistic versioning remain mandatory."
 },
 receivables:{
  title:"Plan receivables follow-up",
  intro:"Select an ageing group and a contact approach. Never claim a debtor is overdue until the source invoice, due date and verified allocations are checked.",
  fields:[{key:"age",label:"Age group",kind:"select",options:["Not yet overdue","1–30 days","31–60 days","61–90 days","90+ days"],required:true},{key:"approach",label:"Next step",kind:"select",options:["Review invoice evidence","Prepare gentle reminder","Request account reconciliation","Escalate for owner approval"],required:true}],
  authority:"Unpaid balance and overdue state must originate from immutable issued documents, verified payments, credits and time-zone-aware due dates."
 },
 adjustments:{
  title:"Prepare credit or debit note",
  intro:"Review an adjustment against the original document without editing the financial ledger or sending a fiscal document.",
  fields:[{key:"type",label:"Document type",kind:"select",options:["Credit note","Debit note"],required:true},{key:"invoice",label:"Original invoice",kind:"select",required:true},{key:"amount",label:"Adjustment amount (NGN)",kind:"money",required:true},{key:"reason",label:"Reason and item/tax context",kind:"textarea",required:true}],
  authority:"An approved note needs reason codes, versioned original invoice, line-level tax/quantity changes, numbering, fiscal authority rules and role-restricted posting."
 },
 reconciliation:{
  title:"Plan statement reconciliation",
  intro:"Specify the account and statement period for a future import. Payment fixtures here are not proof of cleared bank receipts.",
  fields:[{key:"account",label:"Account label",required:true},{key:"from",label:"Statement start",kind:"date",required:true},{key:"to",label:"Statement end",kind:"date",required:true},{key:"approach",label:"Matching method",kind:"select",options:["Exact bank reference","Amount/date/customer review","Investigate unmatched credit","Review duplicate or reversal"],required:true}],
  authority:"Import must validate file origin, duplicate fingerprints, cleared bank entries, maker/checker decisions and an immutable matching trail."
 },
 audit:{
  title:"Prepare exception investigation",
  intro:"Choose a category and severity for review. The authenticated event log is deliberately empty until the server exists.",
  fields:[{key:"category",label:"Exception category",kind:"select",options:["Bank payment mismatch","Provider webhook mismatch","Unauthorized change attempt","Tax validation error","Duplicate recurring job","Document retention exception"],required:true},{key:"severity",label:"Review priority",kind:"select",options:["Informational","Moderate","High","Critical"],required:true},{key:"reason",label:"Investigation summary",kind:"textarea",required:true}],
  authority:"Real incidents require secure actor/time/event IDs, evidence hashes, tenant isolation, immutable append-only storage and controlled resolution."
 },
 currencies:{
  title:"Preview foreign-currency setup",
  intro:"Describe a business currency requirement. Rates are not imported and no exchange gain, invoice or financial entry is posted.",
  fields:[{key:"currency",label:"Document currency",kind:"select",options:["USD","GBP","EUR","NGN"],required:true},{key:"source",label:"Rate source / quotation reference",required:true},{key:"rate",label:"Example NGN per foreign unit",kind:"rate",required:true},{key:"reason",label:"Business purpose",kind:"textarea",required:true}],
  authority:"Actual exchange rates must have signed source, timestamp, effective date, ISO currency minor units, approval and immutable base-currency amounts."
 }
};
export default function FinanceActionSheet({mode,customers,invoices,onClose}:{mode:Exclude<FinanceMode,"communications">;customers:string[];invoices:string[];onClose:()=>void}){
 const spec=specs[mode],[values,setValues]=useState<Record<string,string>>({}),[reviewed,setReviewed]=useState(false);
 const fields=spec.fields.map(f=>({...f,options:f.key==="customer"?customers:f.key==="invoice"?invoices:f.options}));
 const complete=fields.every(f=>{
  const v=values[f.key]||"";
  if(f.required&&!v.trim())return false;
  if(f.kind==="money"&&(!/^\d+(?:\.\d{1,2})?$/.test(v)||Number(v)<=0||Number(v)>1e12))return false;
  if(f.kind==="rate"&&(!/^\d+(?:\.\d{1,8})?$/.test(v)||Number(v)<=0||Number(v)>1e9))return false;
  return true;
 })&&(!values.from||!values.to||values.from<=values.to);
 return <div className="fixed inset-0 z-[145] flex items-end justify-center bg-[#031C32]/60 lg:items-center lg:p-4" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
  <section role="dialog" aria-modal="true" aria-label={spec.title} className="max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl lg:rounded-2xl">
   <div className="mx-auto mb-4 h-1 w-11 rounded-full bg-[#D8E3EF] lg:hidden"/>
   <header className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-[#173652]">{spec.title}</h2><p className="mt-2 text-xs leading-6 text-[#687F96]">{spec.intro}</p></div><button type="button" aria-label="Close finance workflow" onClick={onClose} className="rounded-lg p-2 text-[#607991] hover:bg-[#F2F7FF]"><X size={19}/></button></header>
   {reviewed?<div className="mt-5 space-y-4">
    <p className="flex items-center gap-2 rounded-xl bg-blue-50 p-3 text-sm font-semibold text-[#1F5A8D]"><CheckCircle2 size={19}/> Request details reviewed locally</p>
    <dl className="grid grid-cols-2 gap-3">{fields.map(f=><div key={f.key} className="min-w-0 rounded-xl bg-[#F6F9FD] p-3"><dt className="text-[11px] text-slate-500">{f.label}</dt><dd className="mt-1 break-words text-xs font-semibold text-[#1B3A56]">{values[f.key]}</dd></div>)}</dl>
    <p className="rounded-xl border border-blue-100 p-3 text-xs leading-6 text-[#385D7F]"><LockKeyhole size={16} className="mr-2 inline"/>No workflow, approval, email, payment, rate or bank import was created. This is a local preview of the information the authorized backend will require.</p>
   </div>:<form className="mt-5 space-y-4" onSubmit={e=>{e.preventDefault();if(complete)setReviewed(true);}}>
    {fields.map(f=><label key={f.key} className="block"><span className="mb-1.5 block text-xs font-semibold text-[#345574]">{f.label}</span>
     {f.kind==="select"?<select required={f.required} aria-label={f.label} value={values[f.key]||""} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} className="h-11 w-full min-w-0 rounded-xl border border-[#DCE7F3] bg-white px-3 text-sm text-[#173652]"><option value="">Select one</option>{(f.options||[]).map(x=><option value={x} key={x}>{x}</option>)}</select>
     :f.kind==="textarea"?<textarea required={f.required} aria-label={f.label} maxLength={1600} rows={3} value={values[f.key]||""} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} placeholder="Enter context for a reviewer" className="w-full rounded-xl border border-[#DCE7F3] p-3 text-sm text-[#173652]"/>
     :<input required={f.required} aria-label={f.label} type={f.kind==="date"?"date":"text"} inputMode={f.kind==="money"||f.kind==="rate"?"decimal":undefined} maxLength={f.kind==="money"?18:120} value={values[f.key]||""} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} placeholder={f.kind==="money"?"0.00":f.kind==="rate"?"e.g. 1520.50":"Enter details"} className="h-11 w-full min-w-0 rounded-xl border border-[#DCE7F3] px-3 text-sm text-[#173652]"/>}
     {f.hint?<span className="mt-1 block text-[11px] text-slate-500">{f.hint}</span>:null}
    </label>)}
    {values.from&&values.to&&values.from>values.to?<p role="alert" className="text-xs text-red-600">The end date must not precede the start date.</p>:null}
    <button type="submit" disabled={!complete} className="w-full rounded-full bg-[#0064E0] py-3 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45">Review details (no submission)</button>
   </form>}
   <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#F3F8FF] p-3 text-xs leading-5 text-[#366081]"><Info size={17} className="mt-0.5 shrink-0"/><p>{spec.authority}</p></div>
   {reviewed?<button type="button" onClick={onClose} className="mt-4 w-full rounded-full border border-[#0064E0] p-3 text-xs font-semibold text-[#0064E0]">Close review</button>:null}
  </section>
 </div>;
}
