"use client";
import { useMemo,useState } from "react";
import Link from "next/link";
import {Search,Plus,SlidersHorizontal,Download,MoreVertical,FileText,Eye,Pencil,Send,Copy,Trash2,RotateCcw,X,ChevronRight,} from "lucide-react";
import {previewInvoices,type PreviewInvoice,type InvoiceStatus} from "../lib/preview-records";

const tabs: {label:string,value:InvoiceStatus|"all"}[]=[
 {label:"All",value:"all"},{label:"Paid",value:"paid"},{label:"Overdue",value:"overdue"},
 {label:"Draft",value:"draft"},{label:"Partial",value:"partial"},{label:"Refunded",value:"refunded"}
];
const labels:Record<InvoiceStatus,string>={paid:"Paid",pending:"Sent",overdue:"Overdue",draft:"Draft",partial:"Partially",refunded:"Refunded"};
const styles:Record<InvoiceStatus,string>={
 paid:"bg-green-100 text-green-700",pending:"bg-amber-50 text-amber-700",
 overdue:"bg-red-100 text-red-700",draft:"bg-slate-100 text-slate-600",
 partial:"bg-amber-50 text-amber-700",refunded:"bg-red-50 text-red-600"
};
function Status({status}:{status:InvoiceStatus}){
 return <span className={`rounded-md px-2 py-1 text-[11px] font-medium ${styles[status]}`}>{labels[status]}</span>;
}
type Action="send"|"duplicate"|"delete"|"refund"|"export";
function InvoiceActionSheet({invoice,close,action}:{
 invoice:PreviewInvoice;close:()=>void;action:(a:Action,i:PreviewInvoice)=>void;
}){
 const items=[
 {name:"View Invoice",icon:Eye,act:()=>{close();location.assign(`/dashboard/invoice/${invoice.id}`);}},
 {name:"Edit Invoice",icon:Pencil,act:()=>{close();location.assign(`/dashboard/invoice/${invoice.id}/edit`);}},
 {name:"Send Invoice",icon:Send,act:()=>action("send",invoice)},
 {name:"Duplicate Invoice",icon:Copy,act:()=>action("duplicate",invoice)},
 {name:"Delete Invoice",icon:Trash2,act:()=>action("delete",invoice)},
 {name:"Mark as refunded",icon:RotateCcw,act:()=>action("refund",invoice)}
 ];
 return <div role="presentation" className="fixed inset-0 z-[90] flex items-end justify-center bg-black/40 md:items-center" onClick={close}>
  <section role="dialog" aria-modal="true" aria-label={`Actions for ${invoice.reference}`}
    className="w-full max-w-md rounded-t-2xl bg-white p-4 pb-8 shadow-xl md:rounded-xl md:pb-4" onClick={e=>e.stopPropagation()}>
   <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200 md:hidden"/>
   <div className="mb-3 flex items-center justify-between border-b pb-3">
    <div><p className="text-sm font-semibold">{invoice.reference}</p><p className="text-xs text-gray-500">{invoice.customer}</p></div>
    <button aria-label="Close invoice actions" onClick={close}><X size={20}/></button>
   </div>
   <div className="space-y-2">{items.map(({name,icon:Icon,act})=><button key={name} type="button" onClick={act}
     className="flex w-full items-center gap-3 rounded-lg bg-gray-50 px-3 py-3 text-left text-sm text-[#22334B] hover:bg-blue-50">
     <Icon size={17} className="text-[#0064E0]"/><span className="flex-1">{name}</span><ChevronRight size={15}/>
   </button>)}</div>
  </section>
 </div>;
}
export function InvoiceListSection(){
 const [query,setQuery]=useState("");
 const [status,setStatus]=useState<InvoiceStatus|"all">("all");
 const [selected,setSelected]=useState<PreviewInvoice|null>(null);
 const [notice,setNotice]=useState("");
 const [page,setPage]=useState(1);
 const list=useMemo(()=>previewInvoices.filter(r=>(status==="all"||r.status===status)&&
  [r.customer,r.reference,r.email].some(x=>x.toLowerCase().includes(query.toLowerCase()))),[status,query]);
 const pageSize=10;
 const visible=list.slice((page-1)*pageSize,page*pageSize);
 function selectStatus(value:InvoiceStatus|"all"){setStatus(value);setPage(1);}
 function previewAction(a:Action,invoice:PreviewInvoice){
  setSelected(null);
  const messages:Record<Action,string>={
   send:"No message sent. Email delivery will be enabled after merchant authentication.",
   duplicate:"No invoice duplicated. This action will create a new draft in the backend phase.",
   delete:"No record deleted. Server-side cancellation rules are required.",
   refund:"No refund or credit created. Verified finance controls are required.",
   export:"No financial export generated. Server-backed records are required."
  };
  setNotice(`${invoice.reference}: ${messages[a]}`);
 }
 return <section aria-label="Invoice history" className="min-w-0 space-y-4">
   <div className="flex flex-wrap gap-2" aria-label="Invoice status filters">
    {tabs.map(t=><button type="button" key={t.value} onClick={()=>selectStatus(t.value)}
      aria-pressed={status===t.value}
      className={`rounded-full px-3 py-1.5 text-xs font-medium ${status===t.value?"bg-blue-50 text-[#0064E0]":"bg-gray-100 text-gray-700"}`}>
      {t.label}</button>)}
   </div>
   <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-[auto_minmax(170px,1fr)_auto] lg:items-center">
    <p className="text-sm font-medium text-gray-600">{list.length} invoices <span className="text-xs font-normal text-gray-400">(sample data)</span></p>
    <label className="relative block min-w-0">
      <Search size={16} className="absolute left-3 top-3 text-gray-400"/>
      <input aria-label="Search invoices" value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}}
        placeholder="Search" className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#0064E0]"/>
    </label>
    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
      <button type="button" onClick={()=>previewAction("export",previewInvoices[0])}
        className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs"><Download size={15}/>Export</button>
      <button type="button" onClick={()=>setNotice("Select a status chip or search to filter sample invoices.")}
        className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 text-xs"><SlidersHorizontal size={15}/>Filters</button>
      <Link href="/dashboard/invoice/create" className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full bg-[#0064E0] px-4 text-xs font-medium text-white hover:bg-[#0052B8] sm:flex-none">
        <Plus size={15}/>Create Invoice</Link>
    </div>
   </div>
   {notice&&<div role="status" className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
     <div className="flex justify-between gap-3"><span>{notice}</span><button aria-label="Dismiss message" onClick={()=>setNotice("")}><X size={16}/></button></div>
   </div>}
   <div className="hidden min-w-0 overflow-hidden rounded-xl border border-gray-100 bg-white md:block">
    <table className="w-full table-fixed text-left text-[11px] lg:text-xs">
     <thead className="bg-gray-50 text-gray-500"><tr>
      <th className="w-[16%] px-2 py-3 lg:px-3">Invoice no</th>
      <th className="w-[18%] px-2 py-3 lg:px-3">Name</th>
      <th className="w-[14%] px-2 py-3 lg:px-3">Amount</th>
      <th className="w-[13%] px-2 py-3 lg:px-3">Created</th>
      <th className="hidden w-[17%] px-2 py-3 xl:table-cell lg:px-3">Email</th>
      <th className="w-[14%] px-2 py-3 lg:px-3">Status</th>
      <th className="w-[5%] py-3"><span className="sr-only">Actions</span></th>
     </tr></thead>
     <tbody>{visible.map(i=><tr key={i.id} className="border-t border-gray-100 align-middle hover:bg-gray-50">
       <td className="truncate px-2 py-4 font-medium text-[#172f4d] lg:px-3"><Link href={`/dashboard/invoice/${i.id}`} className="hover:underline">{i.reference}</Link></td>
       <td className="truncate px-2 py-4 text-[#172f4d] lg:px-3">{i.customer}</td>
       <td className="truncate px-2 py-4 font-semibold text-[#172f4d] lg:px-3">{i.amount}</td>
       <td className="truncate px-2 py-4 text-gray-500 lg:px-3">{i.date}</td>
       <td className="hidden truncate px-2 py-4 text-gray-500 xl:table-cell lg:px-3">{i.email}</td>
       <td className="px-2 py-4 lg:px-3"><Status status={i.status}/></td>
       <td className="py-4"><button type="button" aria-label={`Actions for ${i.reference}`} onClick={()=>setSelected(i)}
         className="rounded p-1 hover:bg-blue-50"><MoreVertical size={17}/></button></td>
     </tr>)}</tbody></table>
   </div>
   <div className="space-y-2 md:hidden">{visible.map(i=><article key={i.id}
     className="rounded-xl border border-gray-100 bg-white px-3 py-3 shadow-sm">
    <div className="flex items-start gap-3">
      <Link href={`/dashboard/invoice/${i.id}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0064E0]" aria-label={`View ${i.reference}`}>
        <FileText size={19}/></Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-1">
          <Link href={`/dashboard/invoice/${i.id}`} className="min-w-0 truncate text-sm font-semibold text-[#172f4d]">{i.customer}</Link>
          <span className="shrink-0 whitespace-nowrap text-xs font-bold text-[#172f4d]">{i.amount}</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate rounded-full bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500">{i.reference}</span>
          <Status status={i.status}/>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">Created: {i.date} · Due: {i.dueDate}</p>
      </div>
      <button aria-label={`Actions for ${i.reference}`} onClick={()=>setSelected(i)} className="shrink-0 rounded p-1 text-gray-500"><MoreVertical size={18}/></button>
    </div>
   </article>)}</div>
   {visible.length===0&&<div className="rounded-lg bg-white p-8 text-center text-sm text-gray-500">No invoices match your filters.</div>}
   <nav aria-label="Invoice pages" className="flex items-center justify-between rounded-b-xl bg-white p-3 text-xs">
    <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="rounded border px-3 py-2 disabled:opacity-30">← Previous</button>
    <span>Page {page} of {Math.max(1,Math.ceil(list.length/pageSize))}</span>
    <button disabled={page*pageSize>=list.length} onClick={()=>setPage(p=>p+1)} className="rounded border px-3 py-2 disabled:opacity-30">Next →</button>
   </nav>
   {selected&&<InvoiceActionSheet invoice={selected} close={()=>setSelected(null)} action={previewAction}/>}
 </section>;
}
