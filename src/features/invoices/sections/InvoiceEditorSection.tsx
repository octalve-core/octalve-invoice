"use client";
import {useState,type ReactNode} from "react";
import {ChevronDown,ChevronUp} from "lucide-react";
import type {InvoiceDraft} from "@/src/features/invoice/types";
import {calculateInvoiceTotals} from "@/src/features/invoice/lib/calculations";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {InvoiceMetadataSection} from "./InvoiceMetadataSection";
import {InvoiceItemsSection} from "./InvoiceItemsSection";
import InvoiceWorkflowPanel from "./InvoiceWorkflowPanel";

type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>};
type Part="details"|"items"|"charges"|"workflow";
const parts:Part[]=["details","items","charges","workflow"];

function Panel({name,title,description,open,onToggle,children}:{name:Part;title:string;description:string;open:boolean;onToggle:()=>void;children:ReactNode}){
 return <section className="min-w-0 overflow-hidden rounded-xl border border-[#E7EDF5] bg-white" aria-label={title}>
  <h2><button type="button" aria-expanded={open} aria-controls={"invoice-section-"+name} onClick={onToggle}
   className="flex min-h-14 w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-[#F7FAFE] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0064E0]">
   <span className="min-w-0"><span className="block text-sm font-bold text-[#173652]">{title}</span><span className="mt-1 block text-[11px] leading-4 text-[#74869A]">{description}</span></span>
   {open?<ChevronUp size={19} className="shrink-0 text-[#0064E0]"/>:<ChevronDown size={19} className="shrink-0 text-[#0064E0]"/>}
  </button></h2>
  <div id={"invoice-section-"+name} hidden={!open} className="border-t border-[#E9EFF6] p-4 sm:p-5">{children}</div>
 </section>;
}

export function InvoiceEditorSection({draft,setDraft}:Props){
 const {paymentMode}=useMerchantPreview();
 const [open,setOpen]=useState<Part[]>(["details"]);
 const allOpen=open.length===parts.length;
 const toggle=(part:Part)=>setOpen(previous=>previous.includes(part)?previous.filter(x=>x!==part):[part]);
 const update=<K extends keyof InvoiceDraft>(key:K,value:InvoiceDraft[K])=>setDraft(p=>({...p,[key]:value}));
 const total=calculateInvoiceTotals(draft.rows,draft.discount,draft.tax).total;
 const totalMinor=Math.round(total*100);
 const validTotal=Number.isSafeInteger(totalMinor)&&totalMinor>=0;
 return <section aria-label="Invoice input" className="min-w-0 space-y-3">
  <div className="flex flex-wrap items-center justify-between gap-2 px-1">
   <p className="text-xs text-slate-500">Complete each section while reviewing your invoice alongside.</p>
   <button type="button" onClick={()=>setOpen(allOpen?[]:parts)} className="rounded-full border border-[#DCE7F5] px-3 py-2 text-xs font-semibold text-[#0064E0]">{allOpen?"Collapse all":"Expand all"}</button>
  </div>
  <Panel name="details" title="Invoice & customer details" description="Number, customer, dates, sender and payment method" open={open.includes("details")} onToggle={()=>toggle("details")}>
   <InvoiceMetadataSection draft={draft} setDraft={setDraft}/>
  </Panel>
  <Panel name="items" title="Products & services" description={draft.rows.length+" item"+(draft.rows.length===1?"":"s")+" · expand an item to edit it"} open={open.includes("items")} onToggle={()=>toggle("items")}>
   <InvoiceItemsSection draft={draft} setDraft={setDraft}/>
  </Panel>
  <Panel name="charges" title="Totals, tax & notes" description="Discounts, optional tax and customer notes" open={open.includes("charges")} onToggle={()=>toggle("charges")}>
   <div className="grid grid-cols-2 gap-3">
    <label className="text-xs">Discount %
     <input aria-label="Overall discount percentage" value={draft.discount} onChange={e=>update("discount",e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-gray-50 px-3 text-sm"/>
    </label>
    <label className="text-xs">Tax %
     <input aria-label="Tax percentage" value={draft.tax} onChange={e=>update("tax",e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-gray-50 px-3 text-sm"/>
    </label>
   </div>
   <p className="mt-2 text-[11px] leading-5 text-slate-500">Enter the tax rate applicable to this transaction; it is not selected automatically.</p>
   <label className="mt-4 block space-y-1 text-xs"><span className="font-medium">Mail for customer / Notes</span>
    <textarea value={draft.notes} onChange={e=>update("notes",e.target.value)} className="min-h-20 w-full resize-y rounded-xl bg-gray-50 p-3 text-sm focus:outline-blue-500"/>
   </label>
   <p className="mt-3 rounded-lg bg-[#F2F7FD] p-3 text-xs text-[#355D82]">Check your payment method and business bank details before sharing an invoice. Online payment options require activation.</p>
  </Panel>
  <Panel name="workflow" title="Payment plan & communication" description="Installments, draft messages and customer-sharing options" open={open.includes("workflow")} onToggle={()=>toggle("workflow")}>
   {validTotal?<InvoiceWorkflowPanel invoice={{id:"unsaved-draft",reference:draft.invoiceNo,customer:draft.clientName||"Customer",email:draft.clientEmail,amount:(totalMinor/100).toFixed(2),date:"",dueDate:"",status:"draft",paymentMode}} currency={draft.currency}/>:
   <p role="alert" className="text-xs text-red-700">Check the amounts and quantities before planning installments.</p>}
  </Panel>
  <div className="flex flex-wrap gap-2 rounded-xl bg-white p-4">
   <button type="button" disabled className="rounded-full bg-[#0064E0] px-5 py-2.5 text-xs font-medium text-white opacity-55">Save draft</button>
   <button type="button" disabled className="rounded-full border border-[#0064E0] px-5 py-2.5 text-xs font-medium text-[#0064E0] opacity-55">Save and send</button>
   <p className="w-full text-[11px] text-slate-500">Saving and sending become available when your account is ready. You can review or download this draft now.</p>
  </div>
 </section>;
}
