"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft,ClipboardCheck,ShieldCheck,ChevronDown} from "lucide-react";
import {adminPreviewRecord,type AdminRecordKind} from "./admin-preview-data";
export function AdminRecordDetail({kind,id}:{kind:AdminRecordKind;id:string}){
 const row=adminPreviewRecord(kind,id),[assignment,setAssignment]=useState("Unassigned"),[show,setShow]=useState(false);
 if(!row)return null;
 const assigning=kind==="support"||kind==="staff"||kind==="verifications";
 return <div className="mx-auto min-w-0 max-w-5xl space-y-5">
  <Link href={"/admin/"+kind} className="inline-flex items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={16}/> Back to {kind}</Link>
  <header className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs text-[#0064E0]">{row.id}</p><h1 className="mt-1 text-2xl font-bold text-[#173652]">{row.name}</h1><p className="mt-1 text-xs text-slate-500">{row.detail}</p></div>
   <span className="rounded-full bg-[#ECF4FF] px-3 py-2 text-xs font-semibold text-[#0064E0]">{row.status}</span></header>
  <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(240px,1fr)]">
   <section className="rounded-2xl border border-[#E2EBF5] bg-white p-5">
    <h2 className="text-sm font-bold">Record overview</h2>
    <dl className="mt-4 space-y-4">{[["Reference",row.id],["Category",row.category],["Description",row.detail],["Recorded status",row.status]].map(([label,value])=><div key={label} className="border-b border-[#EDF2F8] pb-3"><dt className="text-[11px] text-slate-500">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl>
    <p className="mt-4 rounded-xl bg-[#F6F9FD] p-3 text-xs leading-5 text-slate-600">This is a sample record. Decisions, account changes and customer financial information require authorised staff access.</p>
   </section>
   <section className="rounded-2xl border border-[#E2EBF5] bg-white p-5">
    <h2 className="flex items-center gap-2 text-sm font-bold"><ShieldCheck size={18} className="text-[#0064E0]"/> Work controls</h2>
    <p className="mt-2 text-xs leading-5 text-slate-500">Actions are reviewed and recorded after secure sign-in is available.</p>
    {assigning?<div className="mt-4 space-y-3">
      <label className="block text-xs font-semibold">Assigned to</label>
      <button type="button" onClick={()=>setShow(true)} aria-label="Choose sample assignment" className="flex h-11 w-full items-center justify-between rounded-xl border border-[#DDE8F5] px-3 text-xs font-semibold">{assignment}<ChevronDown size={16}/></button>
      <button type="button" disabled className="w-full rounded-full bg-[#0064E0] px-4 py-3 text-xs font-semibold text-white opacity-50">Save assignment</button>
      <p className="text-[11px] text-slate-500">Selection is local to this view; no staff assignment is saved.</p>
     </div>:null}
    <button type="button" disabled className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-[#BDDAFF] px-4 py-3 text-xs font-semibold text-[#0064E0] opacity-50"><ClipboardCheck size={16}/> Approve or update</button>
   </section>
  </div>
  {show?<div role="presentation" className="fixed inset-0 z-[120] flex items-end justify-center bg-[#00111F]/55 lg:items-center lg:p-4" onClick={()=>setShow(false)}>
   <section role="dialog" aria-modal="true" aria-label="Choose sample assignment" onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl lg:rounded-2xl lg:pb-5">
    <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 lg:hidden"/>
    <h2 className="mb-4 text-sm font-bold">Choose sample assignment</h2>
    {["Unassigned","Support specialist","Billing operations","Compliance reviewer"].map(name=><button key={name} type="button" onClick={()=>{setAssignment(name);setShow(false);}} className={"block w-full rounded-xl px-4 py-3 text-left text-sm "+(name===assignment?"bg-[#EAF3FF] text-[#0064E0]":"hover:bg-slate-50")}>{name}</button>)}
   </section>
  </div>:null}
 </div>;
}
