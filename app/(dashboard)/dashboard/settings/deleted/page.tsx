"use client";
import Link from "next/link";
import {useState} from "react";
import {ArrowLeft,ArchiveRestore,LockKeyhole,Trash2,ShieldCheck} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const DATE_MS=14*24*60*60*1000;
export default function DeletedRecordsPage(){
 const {archivedRecords,setArchivedRecords}=useMerchantPreview();
 const [filter,setFilter]=useState("all");
 const filtered=archivedRecords.filter(x=>filter==="all"||x.kind===filter);
 return <main className="w-full min-w-0 space-y-5">
  <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0064E0]"><ArrowLeft size={17}/> Back to Settings</Link>
  <header className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-bold text-[#173652]">Deleted Records</h1><p className="mt-1 text-sm text-slate-500">Review and restore temporarily removed workspace records.</p></div><span className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-[#254566]">{archivedRecords.length} in session</span></header>
  <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><ShieldCheck className="mt-0.5 shrink-0" size={21}/><p><strong>Retention rule proposal:</strong> 14 days to recover ordinary drafts and non-financial entries before an authorized purge review. Issued documents, payments, receipts, credit notes and immutable audit history must not be automatically erased. This Preview does not permanently delete anything.</p></div>
  <label className="flex items-center gap-3 text-sm text-slate-600">Show
   <select value={filter} onChange={e=>setFilter(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="all">All record types</option>{["invoice","receipt","quotation","expense","creditNote","customer","staff","item"].map(x=><option key={x} value={x}>{x==="creditNote"?"Credit note":x}</option>)}</select>
  </label>
  <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">{!filtered.length?<div className="grid min-h-[260px] place-items-center p-8 text-center"><div><Trash2 className="mx-auto mb-3 text-slate-300" size={38}/><h2 className="font-semibold text-[#173652]">No records in this view</h2><p className="mt-2 text-sm text-slate-500">Records removed during this preview session will appear here.</p></div></div>:<div className="divide-y divide-slate-100">{filtered.map(r=>{
   const eligibleUntil=new Date(new Date(r.archivedAt).getTime()+DATE_MS);
   const isFinancial=["invoice","receipt","creditNote","expense"].includes(r.kind);
   return <article key={r.kind+":"+r.id} className="flex flex-wrap items-start gap-3 p-4 sm:p-5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-red-50 text-red-500"><Trash2 size={18}/></span><div className="min-w-0 flex-1"><p className="font-semibold text-[#183854]">{r.reference} <span className="ml-1 text-xs font-normal capitalize text-slate-500">· {r.kind}</span></p><p className="mt-1 text-sm text-slate-600">{r.title}</p><p className="mt-2 text-xs text-slate-500">Removed: {new Date(r.archivedAt).toLocaleString("en-NG")} · Recover through: {eligibleUntil.toLocaleDateString("en-NG")}</p><p className="mt-1 text-xs text-slate-500">Reason: {r.reason}</p>{isFinancial?<p className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-700"><LockKeyhole size={13}/> Permanent financial erasure prohibited</p>:null}</div><button type="button" onClick={()=>setArchivedRecords(old=>old.filter(x=>!(x.kind===r.kind&&x.id===r.id)))} className="inline-flex items-center gap-2 rounded-full border border-[#0064E0] px-4 py-2 text-xs font-semibold text-[#0064E0]"><ArchiveRestore size={15}/> Restore</button></article>;
  })}</div>}</div>
  <p className="text-xs leading-5 text-slate-500">No automatic purge is scheduled. In production, archive, restore and expiry decisions will require organization authorization and a tamper-evident audit trail.</p>
 </main>;
}