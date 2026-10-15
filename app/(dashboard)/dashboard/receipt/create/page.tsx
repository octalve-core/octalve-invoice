"use client";
import {Suspense,useState} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {ArrowLeft,Receipt,FileCheck2,Plus,Wallet} from "lucide-react";
import {previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {useMerchantPreview,getInitials} from "@/src/features/merchant-preview/MerchantPreviewProvider";
function ReceiptCreationForm(){
 const search=useSearchParams(),{settings,receiptAutoMode}=useMerchantPreview();
 const [invoiceId,setInvoiceId]=useState(search.get("invoice")||""),[source,setSource]=useState<"invoice"|"manual">("invoice");
 const [name,setName]=useState(""),[amount,setAmount]=useState(""),[paymentReference,setPaymentReference]=useState(""),[showPreview,setShowPreview]=useState(false);
 const eligible=previewInvoices.filter(i=>i.status==="paid");
 const selected=eligible.find(i=>i.id===invoiceId);
 const valid=source==="invoice"?Boolean(selected):Boolean(name.trim()&&Number(amount)>0&&paymentReference.trim());
 const displayName=source==="invoice"?selected?.customer:name,displayAmount=source==="invoice"?selected?.amount:"₦"+(Number(amount)||0).toLocaleString("en-NG",{minimumFractionDigits:2});
 return <main className="mx-auto max-w-4xl space-y-5"><header className="flex items-center gap-3"><Link href="/dashboard/receipt" aria-label="Back to receipts" className="rounded-full p-2"><ArrowLeft size={20}/></Link><div><h1 className="text-xl font-bold text-[#1e344c]">Create receipt</h1><p className="text-xs text-gray-500">A receipt is issued only when a merchant chooses to provide one.</p></div></header>
  <div className="grid gap-4 lg:grid-cols-2">
   <section className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
    <h2 className="font-semibold">Payment source</h2>
    <div className="grid grid-cols-2 gap-2">{([{key:"invoice",label:"Paid invoice",icon:FileCheck2},{key:"manual",label:"Other payment",icon:Wallet}] as const).map(p=><button key={p.key} onClick={()=>{setSource(p.key);setShowPreview(false);}} className={"flex items-center justify-center gap-2 rounded-xl border p-3 text-xs "+(source===p.key?"border-[#0064E0] bg-blue-50 text-[#0064E0]":"border-gray-200")}>
      <p.icon size={17}/>{p.label}</button>)}</div>
    {source==="invoice"?<label className="block space-y-2 text-xs font-medium">Select an already-paid invoice
     <select value={invoiceId} onChange={e=>{setInvoiceId(e.target.value);setShowPreview(false);}} className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm">
      <option value="">Choose invoice</option>{eligible.map(i=><option key={i.id} value={i.id}>{formatDocumentNumber(settings.businessName||"Octalve Limited",Number(i.id),"invoice")} — {i.customer} ({i.amount})</option>)}</select>
    <p className="font-normal leading-5 text-gray-500">The paid invoice stays unchanged. The new receipt references the corresponding payment. Payments through providers must have an independently verified transaction event.</p></label>:
    <div className="space-y-3">{([{key:"name",title:"Received from",value:name,change:setName},{key:"amount",title:"Amount received",value:amount,change:setAmount},{key:"paymentReference",title:"Payment reference",value:paymentReference,change:setPaymentReference}] as const).map(x=>
      <label key={x.key} className="block text-xs">{x.title}<input value={x.value} onChange={e=>{x.change(e.target.value);setShowPreview(false);}} className="mt-1 h-11 w-full rounded-xl border bg-gray-50 px-3 text-sm"/></label>)}
     <p className="text-xs leading-5 text-gray-500">Independent payments require evidence and controlled verification before receipt issuance. Entering data here does not confirm money was received.</p>
    </div>}
    <button disabled={!valid} onClick={()=>setShowPreview(true)} className="w-full rounded-full bg-[#0064E0] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">Preview receipt</button>
    <p className="text-xs text-gray-500">Automatic setting: {receiptAutoMode==="off"?"Manual receipt issuance":receiptAutoMode==="generate"?"Generate after verified payment":"Generate and email after verified payment"}. Live automation remains disabled.</p>
   </section>
   <section className="rounded-2xl bg-[#edf2f8] p-4">
     {!showPreview?<div className="grid min-h-80 place-items-center gap-2 text-center text-gray-500"><div><Receipt size={34} className="mx-auto mb-3 text-[#0064E0]"/><p className="text-sm font-medium">Select a payment to preview its receipt</p></div></div>:
      <div className="space-y-5 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-blue-50 text-xl font-bold text-[#0064E0]">{getInitials(settings.businessName)}</span><div><p className="text-xs text-[#0064E0]">{formatDocumentNumber(settings.businessName,1,"receipt")}</p><p className="font-black text-[#1d344c]">{settings.businessName}</p></div></div>
       <div className="rounded-xl bg-blue-50 p-4"><p className="text-xs text-gray-500">Payment received from</p><p className="mt-1 text-sm font-semibold">{displayName}</p></div>
       <div className="flex items-center justify-between text-sm"><span>Amount</span><strong>{displayAmount}</strong></div>
       {selected?<p className="text-xs text-gray-500">Related invoice: {formatDocumentNumber(settings.businessName,Number(selected.id),"invoice")}</p>:null}
       <p className="border-t pt-4 text-xs text-gray-500">This is a receipt layout preview. Nothing has been issued, emailed or persisted.</p>
      </div>}
   </section>
  </div>
 </main>;
}
export default function CreateReceiptPage(){return <Suspense fallback={null}><ReceiptCreationForm/></Suspense>;}
