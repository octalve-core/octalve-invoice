"use client";
import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {FileText,Receipt,Wallet,FileSpreadsheet,MoreVertical,FileMinus,X} from "lucide-react";
import {previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
type Category="Invoices"|"Expenses"|"Quotation"|"Receipts"|"Credit Notes";
type Status="paid"|"pending"|"overdue"|"draft"|"refunded";
type Row={id:string;customer:string;reference:string;amount:string;date:string;dueDate:string;status:Status;category:Category;href:string};
const filters=["All","Invoices","Expenses","Quotation","Receipts","Credit Notes"] as const;
const types:Record<Category,{style:string;icon:typeof FileText;list:string}>={
 "Invoices":{style:"bg-amber-50 text-amber-500",icon:FileText,list:"/dashboard/invoice"},
 "Expenses":{style:"bg-red-50 text-red-500",icon:Wallet,list:"/dashboard/expenses"},
 "Quotation":{style:"bg-emerald-50 text-emerald-500",icon:FileSpreadsheet,list:"/dashboard/quotation"},
 "Receipts":{style:"bg-green-50 text-green-500",icon:Receipt,list:"/dashboard/receipt"},
 "Credit Notes":{style:"bg-slate-50 text-[#17334c]",icon:FileMinus,list:"/dashboard/credit-note"}
};
const statuses:Record<Status,string>={paid:"bg-green-100 text-green-700",pending:"bg-amber-50 text-amber-600",overdue:"bg-red-100 text-red-600",draft:"bg-gray-100 text-[#17334c]",refunded:"bg-red-50 text-red-600"};
const statusLabel:Record<Status,string>={paid:"Paid",pending:"Pending",overdue:"Overdue",draft:"Draft",refunded:"Refunded"};
function ActivityCard({row,onAction}:{row:Row;onAction:(r:Row)=>void}){
 const Icon=types[row.category].icon;const router=useRouter();
 return <article aria-label={`${row.category} ${row.reference}`} className="group flex min-w-0 items-center gap-2 rounded-2xl bg-[#F8F8F8] px-3 py-3 transition-colors hover:bg-[#f0f5fc] sm:gap-4 sm:px-5">
  <span aria-hidden="true" className={`grid h-12 w-12 shrink-0 place-items-center rounded-full sm:h-14 sm:w-14 ${types[row.category].style}`}><Icon size={23} strokeWidth={1.7}/></span>
  <button type="button" onClick={()=>router.push(row.href)} className="min-w-0 flex-1 text-left">
   <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1">
    <span className="min-w-0 truncate text-[13px] font-semibold text-[#123b58] sm:text-base">{row.customer}</span>
    <span className="text-[12px] font-bold text-[#123b58] sm:text-sm">{row.amount}</span>
   </div>
   <div className="mt-1 flex items-center justify-between gap-2">
    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] text-gray-500 sm:text-xs">{row.reference}</span>
    <span className={`rounded-lg px-2 py-1 text-[11px] sm:text-xs ${statuses[row.status]}`}>{statusLabel[row.status]}</span>
   </div>
   <div className="mt-1.5 flex flex-wrap justify-between gap-1 text-[10px] text-gray-400 sm:text-xs"><span>Created: {row.date}</span><span>Due: {row.dueDate}</span></div>
  </button>
  <button type="button" aria-label={`Actions for ${row.reference}`} onClick={()=>onAction(row)} className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-white"><MoreVertical size={18}/></button>
 </article>;
}
export default function TransactionTable(){
 const {settings}=useMerchantPreview();
 const [filter,setFilter]=useState<(typeof filters)[number]>("All");
 const [action,setAction]=useState<Row|null>(null);
 const merchant=settings.businessName||"Octalve Limited";
 const invoices:Row[]=previewInvoices.slice(0,3).map((r)=>({id:r.id,customer:r.customer,reference:r.reference,amount:r.amount,date:r.date,dueDate:r.dueDate,status:r.status==="partial"?"pending":r.status,category:"Invoices",href:`/dashboard/invoice/${r.id}`}));
 const extras:Row[]=[
  {id:"sample-expense-1",customer:"Sample supplier",reference:formatDocumentNumber(merchant,1,"expense"),amount:"₦120,000.00",date:"12/6/2024",dueDate:"21/6/2024",status:"overdue",category:"Expenses",href:"/dashboard/expenses"},
  {id:"sample-quote-1",customer:"Sample customer",reference:formatDocumentNumber(merchant,1,"quotation"),amount:"₦120,000.00",date:"12/6/2024",dueDate:"21/6/2024",status:"paid",category:"Quotation",href:"/dashboard/quotation"},
  {id:"sample-receipt-1",customer:"Sample customer",reference:formatDocumentNumber(merchant,1,"receipt"),amount:"₦120,000.00",date:"12/6/2024",dueDate:"21/6/2024",status:"paid",category:"Receipts",href:"/dashboard/receipt"},
  {id:"sample-credit-1",customer:"Sample customer",reference:formatDocumentNumber(merchant,1,"creditNote"),amount:"₦120,000.00",date:"12/6/2024",dueDate:"21/6/2024",status:"draft",category:"Credit Notes",href:"/dashboard/credit-note"}
 ];
 const all:Row[]=[invoices[0],extras[0],extras[1],extras[2],extras[3],...invoices.slice(1)];
 const visible=filter==="All"?all.slice(0,5):all.filter(row=>row.category===filter);
 const viewAll=filter==="All"?"/dashboard/invoice":types[filter].list;
 return <section aria-label="Recent transactions" className="min-w-0 rounded-2xl bg-white p-3 shadow-sm sm:p-6">
  <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-medium text-slate-700 sm:text-2xl">Recent transactions</h2>
   <Link href={viewAll} className="shrink-0 text-sm font-medium text-green-600 sm:text-lg">View All</Link></div>
  <div className="my-5 flex flex-wrap gap-2">{filters.map(f=><button key={f} type="button" onClick={()=>setFilter(f)}
     aria-pressed={f===filter} className={`rounded-full px-3 py-2 text-xs sm:px-4 sm:text-sm ${f===filter?"bg-green-50 font-semibold text-green-600":"bg-gray-100 text-gray-400 hover:bg-gray-200"}`}>{f}</button>)}</div>
  <div className="space-y-3">{visible.map(row=><ActivityCard key={row.id} row={row} onAction={setAction}/>)}</div>
  {visible.length===0?<p className="p-6 text-center text-sm text-gray-500">No sample transactions in this category.</p>:null}
  <p className="mt-4 text-[11px] text-gray-400">Sample transactions — no live funds, invoices or payments.</p>
  {action?<div onClick={()=>setAction(null)} className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 sm:items-center sm:p-4">
   <section role="dialog" aria-modal="true" aria-label="Transaction actions" onClick={e=>e.stopPropagation()} className="w-full max-w-sm rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-xl">
    <div className="mb-4 flex items-center justify-between"><h3 className="font-semibold">{action.reference}</h3><button aria-label="Close actions" onClick={()=>setAction(null)}><X size={20}/></button></div>
    <Link href={action.href} onClick={()=>setAction(null)} className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-[#0064E0]">{action.category==="Invoices"?"View document":"Open "+action.category+" list"} →</Link>
    <p className="mt-3 text-xs text-gray-500">Further actions become available when secure merchant accounts and server records exist.</p>
   </section></div>:null}
 </section>;
}
