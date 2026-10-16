"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {Search,Wallet,ShieldCheck,Clock3,ArrowRight} from "lucide-react";
import {paymentPreview,financeProjection} from "@/src/features/payments/ledger";
import {previewInvoices} from "@/src/features/invoices/lib/preview-records";
const minor=(s:string)=>Math.round((Number(s.replace(/[^\d.]/g,""))||0)*100);
const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:2}).format(n/100);
const claims=previewInvoices.map(i=>({id:i.id,amountMinor:minor(i.amount),issued:i.status!=="draft"}));
export default function PaymentReceivedPage(){
 const [query,setQuery]=useState(""),[status,setStatus]=useState<"all"|"verified"|"pending">("all");
 const rows=useMemo(()=>paymentPreview.filter(p=>(status==="all"||p.status===status)&&[p.customer,p.id,p.reference].some(v=>v.toLowerCase().includes(query.toLowerCase()))),[query,status]);
 const projection=useMemo(()=>financeProjection(claims,paymentPreview,[]),[]);
 return <main className="min-w-0 space-y-5">
  <header><h1 className="text-2xl font-bold text-[#1e3148]">Payment received</h1><p className="text-sm text-gray-500">Payment records, verification status and invoice allocations</p></header>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
   {[{label:"Recorded collections",value:money(projection.collectedMinor),icon:Wallet},{label:"Allocated to invoices",value:money(projection.allocatedMinor),icon:ShieldCheck},{label:"Unallocated payments",value:money(projection.unallocatedMinor),icon:Clock3}].map(c=>
    <section key={c.label} className="rounded-xl border border-gray-100 bg-white p-4"><c.icon size={19} className="text-[#0064E0]"/><p className="mt-3 text-xs text-gray-500">{c.label}</p><p className="mt-1 break-all text-lg font-semibold text-[#183650]">{c.value}</p></section>)}
  </div>
  <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
   <div className="flex flex-wrap items-center gap-3 border-b p-4">
    <div className="flex gap-2">{(["all","verified","pending"] as const).map(s=><button key={s} onClick={()=>setStatus(s)} className={"rounded-full px-3 py-2 text-xs capitalize "+(status===s?"bg-[#0064E0] text-white":"bg-gray-100 text-gray-600")}>{s}</button>)}</div>
    <label className="relative min-w-[150px] flex-1 sm:ml-auto sm:max-w-xs"><Search size={16} className="absolute left-3 top-2.5 text-gray-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search payments" className="h-9 w-full rounded-lg border pl-9 text-sm"/></label>
   </div>
   <div className="space-y-2 p-3">{rows.map(row=><div key={row.id} className="flex min-w-0 items-center gap-3 rounded-xl bg-[#f8f8f8] p-3">
    <span className={"grid h-10 w-10 shrink-0 place-items-center rounded-full "+(row.status==="verified"?"bg-green-100 text-green-600":"bg-amber-100 text-amber-600")}>{row.status==="verified"?<ShieldCheck size={20}/>:<Clock3 size={20}/>}</span>
    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[#163a55]">{row.customer}</p><p className="truncate text-xs text-gray-500">{row.id} · {row.source.replace("-"," ")} · {row.date}</p>
     <p className="mt-1 text-[11px] text-gray-500">{row.allocations.length?"Linked invoice #"+row.allocations[0]?.invoiceId:"Independent customer payment"}{row.receiptId?" · Receipt #"+row.receiptId:""}</p></div>
    <div className="shrink-0 text-right"><p className="text-sm font-semibold text-[#163a55]">{money(row.amountMinor)}</p><span className={"rounded px-2 py-1 text-[10px] "+(row.status==="verified"?"bg-green-100 text-green-600":"bg-amber-50 text-amber-600")}>{row.status==="verified"?"Verified*":"Awaiting verification"}</span></div>
   </div>)}</div>
  </div>
  <div className="rounded-xl border border-blue-100 bg-white p-4 text-xs leading-6 text-gray-600">
   These are example payments. Record a bank transfer only after checking your account. Online payments are confirmed by their payment provider.
   <Link href="/dashboard/invoice" className="mt-2 flex items-center gap-2 font-semibold text-[#0064E0]">Select an invoice to record payment <ArrowRight size={14}/></Link>
  </div>
 </main>;
}
