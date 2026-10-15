"use client";
import {FileText,FileSpreadsheet,Receipt,Wallet,FileMinus,Users,UserRoundCog,Package,MoreVertical} from "lucide-react";
import type {RecordKind,RecordStatus,PreviewRecord} from "../preview-records";
export const recordIcons:Record<RecordKind,typeof FileText>={
 invoice:FileText,receipt:Receipt,quotation:FileSpreadsheet,expense:Wallet,creditNote:FileMinus,customer:Users,staff:UserRoundCog,item:Package
};
export const statusLabels:Record<RecordStatus,string>={
 pending:"Pending",paid:"Paid",overdue:"Overdue",draft:"Draft",refunded:"Refunded",partial:"Partially",sent:"Sent",declined:"Declined",accepted:"Accepted",active:"Active",inactive:"Inactive",available:"Available",settled:"Settled",open:"Open"
};
const stateTone:Record<RecordStatus,string>={
 pending:"bg-amber-50 text-amber-600",paid:"bg-green-100 text-green-600",overdue:"bg-red-100 text-red-600",draft:"bg-slate-100 text-[#183b58]",refunded:"bg-red-100 text-red-600",
 partial:"bg-orange-100 text-orange-600",sent:"bg-amber-50 text-amber-600",declined:"bg-red-100 text-red-600",accepted:"bg-green-100 text-green-600",
 active:"bg-green-100 text-green-600",inactive:"bg-slate-100 text-slate-500",available:"bg-green-100 text-green-600",
 settled:"bg-green-100 text-green-600",open:"bg-blue-100 text-[#0064E0]"
};
const kindTone:Record<RecordKind,string>={
 invoice:"bg-amber-50 text-amber-500",receipt:"bg-green-100 text-green-600",quotation:"bg-orange-50 text-orange-600",expense:"bg-red-50 text-red-600",
 creditNote:"bg-slate-100 text-[#123b58]",customer:"bg-green-100 text-green-600",staff:"bg-blue-100 text-[#0064E0]",item:"bg-blue-100 text-[#0064E0]"
};
export function RecordStatusBadge({status}:{status:RecordStatus}){
 return <span className={"inline-flex max-w-full items-center rounded-md px-2 py-1 text-[10px] font-medium sm:text-xs "+stateTone[status]}>{statusLabels[status]}</span>;
}
export function RecordTypeIcon({kind,status,size="md"}:{kind:RecordKind;status:RecordStatus;size?:"sm"|"md"}){
 const Icon=recordIcons[kind];
 const tone=kind==="invoice"||kind==="receipt"||kind==="quotation"||kind==="expense"?stateTone[status]:kindTone[kind];
 return <span aria-hidden="true" className={"grid shrink-0 place-items-center rounded-full "+tone+(size==="sm"?" h-9 w-9":" h-11 w-11 sm:h-12 sm:w-12")}>
  <Icon size={size==="sm"?17:21} strokeWidth={1.7}/>
 </span>;
}
export function RecordMobileCard({record,onSelect}:{record:PreviewRecord;onSelect:(record:PreviewRecord)=>void}){
 return <article role="link" tabIndex={0} aria-label={"Actions for "+record.reference}
  onClick={()=>onSelect(record)}
  onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onSelect(record);}}}
  className="flex min-w-0 cursor-pointer items-center gap-2 rounded-xl bg-[#f8f8f8] px-2.5 py-3 focus-visible:outline-2 focus-visible:outline-[#0064E0] sm:gap-3 sm:px-4">
  <RecordTypeIcon kind={record.kind} status={record.status}/>
  <div className="min-w-0 flex-1">
   <div className="flex min-w-0 items-center justify-between gap-2">
    <p className="min-w-0 truncate text-[12px] font-semibold text-[#123b58] sm:text-sm">{record.title}</p>
    {record.amount?<strong className="shrink-0 text-[11px] text-[#123b58] sm:text-sm">{record.amount}</strong>:null}
   </div>
   <div className="mt-1 flex min-w-0 items-center justify-between gap-1.5">
    <span className="min-w-0 truncate rounded-full bg-white px-2 py-1 text-[10px] text-[#667487] sm:text-xs">{record.reference}</span>
    <RecordStatusBadge status={record.status}/>
   </div>
   <div className="mt-1.5 flex flex-wrap justify-between gap-x-2 gap-y-0.5 text-[10px] text-gray-400 sm:text-xs">
    <span>{record.kind==="receipt"?"Received":"Created"}: {record.date}</span>
    {record.dueDate?<span>Due: {record.dueDate}</span>:record.paymentMethod?<span>{record.paymentMethod}</span>:null}
   </div>
  </div>
  <button type="button" aria-label={"Actions for "+record.reference} onClick={e=>{e.stopPropagation();onSelect(record);}}
    className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-100"><MoreVertical size={17}/></button>
 </article>;
}
