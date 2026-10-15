"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import {ArrowLeft,BarChart3,FileText,Wallet,Clock3} from "lucide-react";
import {previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {getPreviewRecords} from "@/src/features/records/preview-records";
import {financeProjection,paymentPreview} from "@/src/features/payments/ledger";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const amount=(v?:string)=>Number((v||"0").replace(/[^\d.]/g,""))||0;
const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:2}).format(n);
export default function ReportPage(){
 const {settings}=useMerchantPreview(),[category,setCategory]=useState<"overview"|"invoices"|"collections">("overview");
 const values=useMemo(()=>{
  const issued=previewInvoices.filter(r=>r.status!=="draft"),paid=issued.filter(r=>r.status==="paid"),unpaid=issued.filter(r=>!["paid","refunded"].includes(r.status));
  const receipts=getPreviewRecords("receipt",settings.businessName).filter(r=>r.status==="paid");
  const finance=financeProjection(previewInvoices.map(r=>({id:r.id,amountMinor:Math.round(amount(r.amount)*100),issued:r.status!=="draft"})),paymentPreview,[]);
  return {issued:issued.reduce((a,r)=>a+amount(r.amount),0),receivable:finance.outstandingMinor/100,collected:finance.collectedMinor/100,paidInvoices:paid.length,receiptCount:receipts.length,invoiceCount:issued.length};
 },[settings.businessName]);
 const cards=[
  {label:"Invoiced amount",value:money(values.issued),icon:FileText},
  {label:"Outstanding invoice amount",value:money(values.receivable),icon:Clock3},
  {label:"Recorded collections",value:money(values.collected),icon:Wallet},
  {label:"Receipt documents",value:String(values.receiptCount),icon:BarChart3}
 ];
 return <main className="mx-auto max-w-6xl space-y-5">
  <div className="flex items-center gap-3"><Link aria-label="Back to dashboard" href="/dashboard" className="rounded-full p-2"><ArrowLeft size={20}/></Link><div><h1 className="text-2xl font-bold text-[#1e2e44]">Reports</h1><p className="text-sm text-gray-500">Business performance and financial reporting</p></div></div>
  <div className="flex flex-wrap gap-2">{(["overview","invoices","collections"] as const).map(x=><button onClick={()=>setCategory(x)} key={x} className={"rounded-full px-4 py-2 text-sm capitalize "+(category===x?"bg-[#0064E0] text-white":"bg-white text-slate-600")}>{x}</button>)}</div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.filter((c,i)=>category==="overview"||category==="invoices"&&i<3||category==="collections"&&i>1).map(c=><div key={c.label} className="min-w-0 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
   <c.icon size={18} className="mb-3 text-[#0064E0]"/><p className="text-xs text-gray-500">{c.label}</p><p className="mt-2 break-all text-lg font-bold text-[#173650]">{c.value}</p></div>)}</div>
  <section className="rounded-2xl border border-gray-100 bg-white p-5"><h2 className="mb-3 font-semibold text-[#1d3149]">Reporting foundations</h2>
   <p className="text-sm leading-7 text-gray-600">Invoice totals show billed amounts. Outstanding amounts track receivables. Verified payment events will become the source for cash collected. Receipt documents represent payments already recorded and are never added to collections again.</p>
   <p className="mt-3 text-xs text-gray-400">Illustrative records; the secure payment ledger and accounting reports are not yet active.</p>
   <Link href="/dashboard/invoice" className="mt-4 inline-flex rounded-full bg-[#0064E0] px-5 py-2.5 text-xs font-semibold text-white">View invoices</Link>
  </section>
 </main>;
}
