"use client";
import type {InvoiceDraft} from "@/src/features/invoice/types";
type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>};
function Field({label,value,onChange,placeholder="",disabled=false}:{label:string;value:string;placeholder?:string;disabled?:boolean;onChange:(x:string)=>void}){
 return <label className="flex min-w-0 flex-col gap-1.5 text-xs text-[#22334B]"><span className="font-medium">{label}</span>
 <input value={value} disabled={disabled} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
  className="h-10 w-full min-w-0 rounded-xl border border-gray-100 bg-gray-50 px-3 text-sm text-[#172f4d] outline-none focus:border-[#0064E0] disabled:cursor-not-allowed disabled:opacity-70"/></label>;
}
export function InvoiceMetadataSection({draft,setDraft}:Props){
 const update=<K extends keyof InvoiceDraft>(key:K,value:InvoiceDraft[K])=>setDraft(prev=>({...prev,[key]:value}));
 return <section aria-label="Invoice details" className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
  <Field label="Invoice number" value={draft.invoiceNo} onChange={v=>update("invoiceNo",v)}/>
  <label className="flex min-w-0 flex-col gap-1.5 text-xs"><span className="font-medium">Invoice status</span>
   <select disabled className="h-10 rounded-xl bg-gray-50 px-3 text-sm text-gray-500"><option>Preview draft — not issued</option></select></label>
  <Field label="Customer name" value={draft.clientName} onChange={v=>update("clientName",v)}/>
  <Field label="Customer email" value={draft.clientEmail} onChange={v=>update("clientEmail",v)}/>
  <label className="flex flex-col gap-1.5 text-xs"><span className="font-medium">Currency</span>
   <select value={draft.currency} onChange={e=>update("currency",e.target.value as InvoiceDraft["currency"])}
     className="h-10 min-w-0 rounded-xl bg-gray-50 px-3 text-sm">
     {["NGN","USD","GBP","EUR"].map(c=><option key={c} value={c}>{c}</option>)}
   </select></label>
  <Field label="Customer phone" value={draft.clientPhone} onChange={v=>update("clientPhone",v)}/>
  <fieldset className="min-w-0 sm:col-span-2"><legend className="mb-2 text-xs font-medium">Date issued</legend>
   <div className="grid grid-cols-3 gap-2">{([["day","Day"],["month","Month"],["year","Year"]] as const).map(([key,label])=><Field key={key} label={label} value={draft[key]} onChange={v=>update(key,v)}/>)}</div>
  </fieldset>
  <fieldset className="min-w-0 sm:col-span-2"><legend className="mb-2 text-xs font-medium">Due date</legend>
   <div className="grid grid-cols-3 gap-2">{([["dueDay","Day"],["dueMonth","Month"],["dueYear","Year"]] as const).map(([key,label])=><Field key={key} label={label} value={draft[key]} onChange={v=>update(key,v)}/>)}</div>
  </fieldset>
  <Field label="Invoice subject" value={draft.senderRole} onChange={v=>update("senderRole",v)} placeholder="What is this invoice for?"/>
  <label className="flex flex-col gap-1.5 text-xs"><span className="font-medium">Recurring duration</span>
   <select disabled className="h-10 rounded-xl bg-gray-50 px-3 text-sm text-gray-500"><option>Not configured</option></select></label>
  <label className="flex flex-col gap-1.5 text-xs"><span className="font-medium">Attachments</span>
   <span className="flex h-10 items-center rounded-xl bg-gray-50 px-3 text-xs text-gray-400">Coming later — secure file uploads</span></label>
  <label className="flex flex-col gap-1.5 text-xs"><span className="font-medium">Sales person</span>
   <span className="flex h-10 items-center rounded-xl bg-gray-50 px-3 text-xs text-gray-400">Coming later — merchant staff</span></label>
  <Field label="Customer address" value={draft.clientAddress} onChange={v=>update("clientAddress",v)}/>
  <Field label="Invoice sender" value={draft.senderName} onChange={v=>update("senderName",v)}/>
 </section>;
}