"use client";
import {X,ExternalLink} from "lucide-react";
import Link from "next/link";
import type {PreviewRecord} from "../preview-records";
import {definitions,getRelatedPreviewInvoice} from "../preview-records";
import {RecordStatusBadge,RecordTypeIcon} from "./RecordVisual";
/** View never changes financial state. Receipts may be standalone or explicitly linked to an invoice. */
export function RecordDetailDialog({record,onClose}:{record:PreviewRecord;onClose:()=>void}){
 const invoice=getRelatedPreviewInvoice(record);
 const fields=[
  ["Reference",record.reference],["Name",record.title],["Amount",record.amount],["Date",record.date],
  ["Due date",record.dueDate],["Email",record.email],["Payment method",record.paymentMethod],["Category",record.category]
 ].filter((pair):pair is [string,string]=>Boolean(pair[1]));
 return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 lg:items-center lg:p-4" onClick={onClose}>
  <section role="dialog" aria-modal="true" aria-label={definitions[record.kind].title+" details"} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl lg:rounded-2xl" onClick={e=>e.stopPropagation()}>
   <div className="flex items-center justify-between border-b pb-4"><div className="flex items-center gap-3"><RecordTypeIcon kind={record.kind} status={record.status}/>
    <div><h2 className="font-semibold text-[#18334b]">{definitions[record.kind].title} details</h2><p className="text-xs text-gray-500">Preview-only record</p></div></div>
    <button onClick={onClose} aria-label="Close details" className="rounded p-2 text-gray-600"><X size={19}/></button></div>
   <div className="my-4"><RecordStatusBadge status={record.status}/></div>
   <dl className="divide-y rounded-xl border border-gray-100">{fields.map(([label,value])=><div key={label} className="grid grid-cols-[100px_1fr] gap-3 px-3 py-3 text-xs sm:grid-cols-[140px_1fr]"><dt className="text-gray-500">{label}</dt><dd className="break-words font-semibold text-[#15354e]">{value}</dd></div>)}</dl>
   {record.kind==="receipt"?<section className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
     {invoice?<><p>Receipt sample linked to Invoice {invoice.reference}.</p><Link href={"/dashboard/invoice/"+invoice.id} className="mt-2 inline-flex items-center gap-1 font-semibold underline">View related invoice <ExternalLink size={13}/></Link></>:
      <p>This receipt sample was recorded independently of an invoice. A live manual receipt will require a verified payment entry and explicit merchant decision to issue a receipt.</p>}
    </section>:null}
   {record.kind==="quotation"?<p className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">Quotation status concerns the estimate only. Acceptance or sending a quotation does not establish payment or issue a receipt.</p>:null}
   {record.kind==="creditNote"?<p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">Customer credit, invoice settlement and bank refund are different ledger events. The preview makes no financial changes.</p>:null}
   <p className="mt-5 text-xs text-gray-500">Illustrative display only. No live merchant account, payment verification or financial document issuance.</p>
   <button onClick={onClose} className="mt-3 w-full rounded-full bg-[#0064E0] px-4 py-3 text-sm text-white">Close</button>
  </section>
 </div>;
}
