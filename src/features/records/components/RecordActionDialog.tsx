"use client";
import {useEffect} from "react";
import Link from "next/link";
import {getPreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import {Eye,Pencil,Send,Copy,Trash2,RotateCcw,X,ChevronRight,UserRoundCheck} from "lucide-react";
import type {PreviewRecord} from "../preview-records";
import {definitions} from "../preview-records";
import {RecordTypeIcon} from "./RecordVisual";
export type RecordAction="view"|"edit"|"send"|"duplicate"|"delete"|"refund"|"deactivate";
export function RecordActionDialog({record,onClose,onAction}:{record:PreviewRecord;onClose:()=>void;onAction:(action:RecordAction,record:PreviewRecord)=>void}){
 useEffect(()=>{function key(e:KeyboardEvent){if(e.key==="Escape")onClose();}document.addEventListener("keydown",key);return ()=>document.removeEventListener("keydown",key);},[onClose]);
 const invoice=record.kind==="invoice"?getPreviewInvoice(record.id):undefined;
 const paymentMode=invoice?.paymentMode;
 const title=record.kind==="customer"?"Customer":record.kind==="expense"?"Expense":definitions[record.kind].title;
 const actions:{key:RecordAction;label:string;icon:typeof Eye;danger?:boolean}[]=[
 {key:"view",label:"View "+title,icon:Eye},
 {key:"edit",label:"Edit "+title,icon:Pencil},
 ...(record.kind==="invoice"||record.kind==="receipt"||record.kind==="quotation"?[{key:"send" as const,label:"Send "+title,icon:Send}]:[]),
 ...(record.kind==="invoice"||record.kind==="receipt"||record.kind==="quotation"||record.kind==="expense"||record.kind==="item"?[{key:"duplicate" as const,label:"Duplicate "+title,icon:Copy}]:[]),
 {key:"delete",label:"Delete "+title,icon:Trash2,danger:true},
 ...((record.kind==="receipt"||record.kind==="invoice")&&(record.status==="paid"||record.status==="partial")?[{key:"refund" as const,label:"Mark as refunded",icon:RotateCcw}]:[]),
 ...(record.kind==="staff"||record.kind==="customer"?[{key:"deactivate" as const,label:"Deactivate "+title,icon:UserRoundCheck}]:[])
 ];
 return <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 p-0 lg:items-center lg:p-4" onClick={onClose}>
  <section role="dialog" aria-modal="true" aria-label={"Actions for "+record.reference} onClick={e=>e.stopPropagation()}
   className="max-h-[88dvh] w-full max-w-sm overflow-y-auto rounded-t-2xl bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl lg:rounded-2xl">
   <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 lg:hidden"/>
   <header className="mb-3 flex items-center gap-3 border-b border-gray-100 pb-3">
    <RecordTypeIcon kind={record.kind} status={record.status} size="sm"/>
    <div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-[#123b58]">{record.reference}</h3><p className="truncate text-xs text-gray-500">{record.title}</p></div>
    <button type="button" onClick={onClose} aria-label="Close record actions" className="rounded p-1 text-gray-500"><X size={19}/></button>
   </header>
   <div className="space-y-2">{actions.map(({key,label,icon:Icon,danger})=><button type="button" key={key}
    onClick={()=>{onClose();onAction(key,record);}}
    className={"flex w-full items-center gap-3 rounded-lg bg-[#f8f8f8] px-3 py-3 text-left text-sm hover:bg-gray-100 "+(danger?"text-red-600":"text-[#344357]")}>
    <Icon size={17}/><span className="flex-1">{label}</span><ChevronRight size={15} className={danger?"text-red-500":"text-gray-400"}/>
   </button>)}</div>
   {record.kind==="invoice"&&["pending","partial","overdue"].includes(record.status)?
     paymentMode==="manual"?<Link href={"/dashboard/invoice/"+record.id+"/record-payment"} onClick={onClose}
       className="mt-3 block rounded-lg bg-blue-50 px-3 py-3 text-center text-sm font-medium text-[#0064E0]">Record bank-transfer payment →</Link>:
     <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">Paid status for gateway or virtual-account invoices is controlled by verified provider events, not manual marking.</p>:null}
   {record.kind==="invoice"&&record.status==="paid"?<Link href={"/dashboard/receipt/create?invoice="+record.id} onClick={onClose}
     className="mt-3 block rounded-lg bg-blue-50 px-3 py-3 text-center text-sm font-medium text-[#0064E0]">Issue a receipt for this paid invoice →</Link>:null}
   <button onClick={onClose} className="mt-4 w-full rounded-full border border-[#0064E0] py-2.5 text-sm font-medium text-[#0064E0]">Cancel</button>
   <p className="mt-2 text-center text-[10px] text-gray-400">Preview-only actions; no record will be sent, deleted or refunded.</p>
  </section>
 </div>;
}
