"use client";
import {X} from "lucide-react";
import type {InvoiceStatus} from "../lib/preview-records";
export type InvoiceFilterCriteria={status:InvoiceStatus|"all";from:string;to:string};
const statuses:{label:string,value:InvoiceFilterCriteria["status"]}[]=[
 {label:"All",value:"all"},{label:"Draft",value:"draft"},{label:"Sent",value:"pending"},
 {label:"Overdue",value:"overdue"},{label:"Partially paid",value:"partial"},{label:"Paid",value:"paid"},{label:"Refunded",value:"refunded"}
];
export function InvoiceFiltersDialog({criteria,onChange,onClose}:{criteria:InvoiceFilterCriteria;onChange:(criteria:InvoiceFilterCriteria)=>void;onClose:()=>void}){
 return <div role="presentation" onClick={onClose} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
  <section role="dialog" aria-modal="true" aria-label="Filter invoices" onClick={e=>e.stopPropagation()}
   className="flex max-h-[85dvh] w-full max-w-md min-w-0 flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl">
   <div className="flex items-center justify-between border-b px-4 py-3"><h2 className="text-lg font-semibold">Filters</h2>
     <button aria-label="Close filters" onClick={onClose} className="rounded-lg p-2 hover:bg-gray-50"><X size={18}/></button></div>
   <div className="min-w-0 space-y-5 overflow-y-auto px-4 py-5">
    <fieldset><legend className="mb-3 text-center font-medium">Filter by date</legend>
     <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="min-w-0 text-xs text-gray-600">From
       <input aria-label="Invoice from date" type="date" value={criteria.from} max={criteria.to||undefined}
        onChange={e=>onChange({...criteria,from:e.target.value})} className="mt-1 block h-10 min-w-0 w-full rounded-lg border border-gray-200 px-2 text-sm"/>
      </label>
      <label className="min-w-0 text-xs text-gray-600">To
       <input aria-label="Invoice to date" type="date" value={criteria.to} min={criteria.from||undefined}
        onChange={e=>onChange({...criteria,to:e.target.value})} className="mt-1 block h-10 min-w-0 w-full rounded-lg border border-gray-200 px-2 text-sm"/>
      </label>
     </div></fieldset>
    <fieldset><legend className="mb-3 text-center font-medium">Filter by status</legend>
     <div className="grid grid-cols-1 gap-1">{statuses.map(s=><label key={s.value}
      className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 text-sm hover:bg-gray-50">
      {s.label}<input type="radio" name="invoice-status" checked={criteria.status===s.value} onChange={()=>onChange({...criteria,status:s.value})} className="h-4 w-4 accent-[#0064E0]"/></label>)}</div>
    </fieldset>
   </div>
   <div className="grid grid-cols-2 gap-3 border-t p-4">
    <button type="button" onClick={()=>onChange({status:"all",from:"",to:""})} className="rounded-full border border-[#0064E0] px-3 py-2 text-sm font-medium text-[#0064E0]">Clear filters</button>
    <button type="button" onClick={onClose} className="rounded-full bg-[#0064E0] px-3 py-2 text-sm font-medium text-white">Apply Filter</button>
   </div>
  </section>
 </div>;
}
