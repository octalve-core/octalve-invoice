"use client";
import {useState} from "react";
import Link from "next/link";
import {FileText, MoreVertical} from "lucide-react";
import {previewInvoices,type InvoiceStatus} from "@/src/features/invoices/lib/preview-records";
const filters=["All","Invoices","Expenses","Quotation"] as const;
const color:Record<InvoiceStatus,string>={paid:"bg-green-100 text-green-700",pending:"bg-amber-50 text-amber-700",
 overdue:"bg-red-50 text-red-600",draft:"bg-gray-100 text-gray-600",partial:"bg-amber-50 text-amber-700",refunded:"bg-red-50 text-red-600"};
export default function TransactionTable(){
 const [filter,setFilter]=useState<(typeof filters)[number]>("All");
 const rows=filter==="All"||filter==="Invoices"?previewInvoices.slice(0,5):[];
 return <section aria-label="Recent transactions" className="min-w-0 overflow-hidden rounded-xl bg-white p-3 shadow-sm sm:p-5">
  <div className="flex items-center justify-between gap-2">
    <h2 className="text-lg font-semibold text-[#172f4d]">Recent transactions</h2>
    <Link href="/dashboard/invoice" className="shrink-0 text-sm font-medium text-[#0064E0]">View All</Link>
  </div>
  <div className="my-4 flex flex-wrap gap-2">{filters.map(f=><button key={f} type="button" onClick={()=>setFilter(f)}
    aria-pressed={f===filter} className={`rounded-full px-3 py-2 text-xs ${f===filter?"bg-blue-50 font-semibold text-[#0064E0]":"bg-gray-100 text-gray-500"}`}>{f}</button>)}</div>
  <div className="space-y-2">{rows.map(i=><div key={i.id} className="flex min-w-0 items-center gap-3 rounded-lg bg-gray-50 p-3">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0064E0]"><FileText size={18}/></div>
    <div className="min-w-0 flex-1">
      <Link href={`/dashboard/invoice/${i.id}`} className="block truncate text-sm font-semibold text-[#172f4d]">{i.customer}</Link>
      <p className="mt-1 truncate text-[11px] text-gray-500">{i.reference}</p>
      <p className="mt-0.5 truncate text-[11px] text-gray-400">Created: {i.date} · Due: {i.dueDate}</p>
    </div>
    <div className="shrink-0 text-right">
      <p className="text-xs font-semibold text-[#172f4d]">{i.amount}</p>
      <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-[11px] ${color[i.status]}`}>{i.status==="pending"?"Sent":i.status}</span>
    </div>
    <Link href={`/dashboard/invoice/${i.id}`} aria-label={`View ${i.reference}`} className="shrink-0 text-gray-400"><MoreVertical size={17}/></Link>
  </div>)}</div>
  {rows.length===0&&<p className="p-5 text-center text-sm text-gray-500">No sample records in this category.</p>}
  <p className="mt-3 text-xs text-gray-400">UI Preview — values are examples, not financial records.</p>
 </section>;
}