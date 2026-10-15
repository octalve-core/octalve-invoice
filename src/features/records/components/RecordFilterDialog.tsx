"use client";
import {useEffect,useState} from "react";
import {X} from "lucide-react";
import type {RecordStatus} from "../preview-records";
import {statusLabels} from "./RecordVisual";
export interface FilterCriteria {status:RecordStatus|"all";from:string;to:string;}
export function RecordFilterDialog({statuses,initial,onApply,onClose}:{statuses:ReadonlyArray<RecordStatus>;initial:FilterCriteria;onApply:(v:FilterCriteria)=>void;onClose:()=>void}){
 const [draft,setDraft]=useState(initial);
 useEffect(()=>{function key(e:KeyboardEvent){if(e.key==="Escape")onClose();}document.addEventListener("keydown",key);return ()=>document.removeEventListener("keydown",key)},[onClose]);
 const invalid=Boolean(draft.from&&draft.to&&draft.from>draft.to);
 return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 lg:items-center lg:p-4" onClick={onClose}>
   <section role="dialog" aria-modal="true" aria-label="Filters" onClick={e=>e.stopPropagation()} className="max-h-[88dvh] w-full max-w-sm overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl lg:rounded-2xl lg:p-5">
    <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 lg:hidden"/>
    <header className="mb-4 flex items-center justify-between border-b pb-3"><h2 className="text-lg font-semibold text-[#1d2d43]">Filters</h2><button aria-label="Close filters" onClick={onClose} className="rounded p-1 text-gray-500"><X size={19}/></button></header>
    <p className="mb-3 text-center text-sm font-semibold text-[#1e324a]">Filter by date</p>
    <div className="grid grid-cols-2 gap-3">
     <label className="min-w-0 text-xs text-gray-500">From<input aria-label="From date" type="date" value={draft.from} onChange={e=>setDraft(v=>({...v,from:e.target.value}))} className="mt-1 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2.5 text-xs text-slate-700"/></label>
     <label className="min-w-0 text-xs text-gray-500">To<input aria-label="To date" type="date" value={draft.to} onChange={e=>setDraft(v=>({...v,to:e.target.value}))} className="mt-1 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2.5 text-xs text-slate-700"/></label>
    </div>
    {invalid?<p role="alert" className="mt-2 text-xs text-red-600">The end date cannot precede the start date.</p>:null}
    <h3 className="mb-3 mt-5 text-center text-sm font-semibold text-[#1e324a]">Filter by status</h3>
    <div className="space-y-1">{(["all",...statuses] as const).map(value=><label key={value} className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 hover:bg-gray-50">
     <span className="text-xs font-medium text-slate-700">{value==="all"?"All":statusLabels[value]}</span>
     <input type="radio" name="recordStatus" value={value} checked={draft.status===value} onChange={()=>setDraft(v=>({...v,status:value}))} className="h-4 w-4 accent-[#0064E0]"/>
    </label>)}</div>
    <footer className="mt-5 grid grid-cols-2 gap-2 border-t pt-4"><button onClick={onClose} className="rounded-full border border-[#0064E0] py-2.5 text-xs font-medium text-[#0064E0]">Cancel</button>
     <button disabled={invalid} onClick={()=>{onApply(draft);onClose();}} className="rounded-full bg-[#0064E0] py-2.5 text-xs font-medium text-white disabled:opacity-50">Apply Filter</button></footer>
   </section>
 </div>;
}
