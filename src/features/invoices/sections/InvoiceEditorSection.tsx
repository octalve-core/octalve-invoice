"use client";
import {useState,type ReactNode} from "react";
import type {InvoiceDraft} from "@/src/features/invoice/types";
import {calculateDraftPreviewTotals} from "@/src/features/invoice/lib/draft-preview-totals";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {InvoiceMetadataSection} from "./InvoiceMetadataSection";
import {InvoiceItemsSection} from "./InvoiceItemsSection";
import InvoiceWorkflowPanel from "./InvoiceWorkflowPanel";
import {newDraftPaymentPlan} from "@/src/features/invoices/lib/draft-payment-plan";
import {lagosDateTime} from "@/src/features/invoices/lib/collection-expiry";

export type InvoiceStep="details"|"items"|"charges"|"workflow"|"preview";
type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>;step:InvoiceStep};

/** Keep the four steps mounted within the shared route layout so customer, item and
 * payment-plan state survives Next.js navigation. Only the selected page is visible.
 */
function StepPanel({name,title,description,active,children}:{name:Exclude<InvoiceStep,"preview">;title:string;description:string;active:boolean;children:ReactNode}){
 return <section hidden={!active} aria-label={title} data-invoice-step={name}
  className="min-w-0 rounded-2xl border border-[#E2EBF6] bg-white p-4 sm:p-6">
  <div className="mb-5 border-b border-[#EDF2F8] pb-4">
   <h2 className="text-lg font-bold text-[#173652]">{title}</h2>
   <p className="mt-1 text-xs text-[#73869C]">{description}</p>
  </div>
  {children}
 </section>;
}

export function InvoiceEditorSection({draft,setDraft,step}:Props){
 const {paymentMode,taxPolicy}=useMerchantPreview();
 const [dueTime,setDueTime]=useState("23:59");
 const update=<K extends keyof InvoiceDraft>(key:K,value:InvoiceDraft[K])=>setDraft(p=>({...p,[key]:value}));
 const total=calculateDraftPreviewTotals(draft,taxPolicy).total;
 const totalMinor=Math.round(total*100);
 const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
 const index=months.indexOf(draft.dueMonth.toUpperCase());
 const dueIso=index>=0&&/^\d{4}$/.test(draft.dueYear)&&Number(draft.dueDay)>=1
  ?draft.dueYear+"-"+String(index+1).padStart(2,"0")+"-"+String(draft.dueDay).padStart(2,"0"):"";
 const invoiceDueAtLagos=lagosDateTime(dueIso,dueTime);
 const validTotal=Number.isSafeInteger(totalMinor)&&totalMinor>0;
 return <div aria-label="Invoice input" className={step==="preview"?"hidden":"min-w-0"}>
  <StepPanel name="details" title="Invoice & customer details" description="Customer, invoice dates and payment method" active={step==="details"}>
   <InvoiceMetadataSection draft={draft} setDraft={setDraft} dueTime={dueTime} setDueTime={setDueTime}/>
  </StepPanel>
  <StepPanel name="items" title="Products & services" description="Add what you are billing for" active={step==="items"}>
   <InvoiceItemsSection draft={draft} setDraft={setDraft}/>
  </StepPanel>
  <StepPanel name="charges" title="Totals, tax & notes" description="Review charges and add a note" active={step==="charges"}>
   <p role="status" className="mb-3 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Tax Centre ({taxPolicy.jurisdiction} · {taxPolicy.version}): verify the classifications and effective dates before any future issuance.</p>


   <div className="grid grid-cols-2 gap-3">
    <label className="text-xs">Discount %
     <input aria-label="Overall discount percentage" value={draft.discount} onChange={e=>update("discount",e.target.value)} className="mt-1 h-10 w-full rounded-xl bg-gray-50 px-3 text-sm"/>
    </label>
    <div className="text-xs"><span className="font-medium">Tax status</span><div aria-label="Tax classification status" className="mt-1 flex h-10 items-center rounded-xl bg-amber-50 px-3 text-xs text-amber-900">Line-by-line review required</div></div>
   </div>
   <p className="mt-2 text-[11px] leading-5 text-slate-500">Use the Tax Centre treatment assigned to each item. Unknown or conditional treatments require review; no blanket invoice tax is applied.</p>
   <label className="mt-4 block space-y-1 text-xs"><span className="font-medium">Mail for customer / Notes</span>
    <textarea value={draft.notes} onChange={e=>update("notes",e.target.value)} className="min-h-20 w-full resize-y rounded-xl bg-gray-50 p-3 text-sm focus:outline-blue-500"/>
   </label>
   <p className="mt-3 rounded-lg bg-[#F2F7FD] p-3 text-xs text-[#355D82]">Check payment details before issuing.</p>
  </StepPanel>
  <StepPanel name="workflow" title="Payment plan & communication" description="Set terms and prepare customer messages" active={step==="workflow"}>
   {validTotal?<InvoiceWorkflowPanel invoice={{id:"unsaved-draft",reference:draft.invoiceNo,customer:draft.clientName||"Customer",email:draft.clientEmail,amount:(totalMinor/100).toFixed(2),date:"",dueDate:"",status:"draft",paymentMode}} currency={draft.currency} invoiceDueAtLagos={invoiceDueAtLagos} plan={draft.paymentPlan??newDraftPaymentPlan()} onPlanChange={value=>setDraft(p=>({...p,paymentPlan:typeof value==="function"?value(p.paymentPlan??newDraftPaymentPlan()):value}))}/>:
   <p role="alert" className="text-xs text-red-700">Add an item with a positive amount before planning installments.</p>}
  </StepPanel>
 </div>;
}
