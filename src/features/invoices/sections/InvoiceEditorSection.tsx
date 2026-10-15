"use client";
import type {InvoiceDraft} from "@/src/features/invoice/types";
import {InvoiceMetadataSection} from "./InvoiceMetadataSection";
import {InvoiceItemsSection} from "./InvoiceItemsSection";
type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>};
export function InvoiceEditorSection({draft,setDraft}:Props){
 const update=<K extends keyof InvoiceDraft>(key:K,value:InvoiceDraft[K])=>setDraft(p=>({...p,[key]:value}));
 return <section aria-label="Invoice input" className="min-w-0 space-y-5 rounded-xl bg-white p-4 shadow-sm sm:p-5">
  <InvoiceMetadataSection draft={draft} setDraft={setDraft}/>
  <div className="border-t border-gray-100 pt-4"><InvoiceItemsSection draft={draft} setDraft={setDraft}/></div>
  <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
   <label className="text-xs">Discount %
    <input aria-label="Overall discount percentage" value={draft.discount} onChange={e=>update("discount",e.target.value)}
      className="mt-1 h-10 w-full rounded-xl bg-gray-50 px-3 text-sm"/>
   </label>
   <label className="text-xs">Tax %
    <input aria-label="Tax percentage" value={draft.tax} onChange={e=>update("tax",e.target.value)}
      className="mt-1 h-10 w-full rounded-xl bg-gray-50 px-3 text-sm"/>
   </label>
  </div>
  <label className="block space-y-1 text-xs"><span className="font-medium">Mail for customer / Notes</span>
   <textarea value={draft.notes} onChange={e=>update("notes",e.target.value)}
     className="min-h-20 w-full resize-y rounded-xl bg-gray-50 p-3 text-sm focus:outline-blue-500"/>
  </label>
  <div className="rounded-xl bg-blue-50 p-3"><p className="text-xs font-semibold text-[#0052B8]">Payment details</p>
   <p className="mt-1 text-xs text-slate-600">Manual bank transfer and provider payment connections become available after secure merchant setup.</p></div>
  <div className="flex flex-wrap gap-2">
   <button disabled className="rounded-full bg-[#0064E0] px-5 py-2.5 text-xs font-medium text-white opacity-55">Save draft</button>
   <button disabled className="rounded-full border border-[#0064E0] px-5 py-2.5 text-xs font-medium text-[#0064E0] opacity-55">Save and send</button>
  </div>

 </section>;
}