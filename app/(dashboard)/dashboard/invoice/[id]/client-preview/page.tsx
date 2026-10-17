"use client";
import {useParams} from "next/navigation";
import Link from "next/link";
import {useState} from "react";
import {getPreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import {buildAudiencePreviewDraft} from "@/src/features/invoices/lib/audience-preview";
import {createPreviewInvoice} from "@/src/features/invoices/lib/preview-fixture";
import {InvoiceDocumentPreviewSection} from "@/src/features/invoices/sections/InvoiceDocumentPreviewSection";
import {InvoiceAudienceToolbar} from "@/src/features/invoices/components/InvoiceAudienceToolbar";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {merchantCompany,merchantPayment} from "@/src/features/merchant-preview/merchant-presentation";
/** Client-Facing PREVIEW within the merchant workspace; NOT a public invoice URL. */
export default function ClientInvoicePreviewPage(){
 const {id}=useParams<{id:string}>();
 const invoice=getPreviewInvoice(id);
 const {settings,logoPreview,invoiceAppearance}=useMerchantPreview();
 const [draft,setDraft]=useState(()=>invoice?buildAudiencePreviewDraft(invoice,settings.businessName):createPreviewInvoice());
 const profile=merchantCompany(settings);
 const payment=merchantPayment(settings);
 if(!invoice)return <main className="rounded-xl bg-white p-6 text-sm">Preview invoice not found. <Link href="/dashboard/invoice" className="text-[#0064E0]">Back to invoices</Link></main>;
 return <main className="mx-auto w-full max-w-[1080px] min-w-0 space-y-5 pb-8">
  <header>
   <p className="text-[11px] font-semibold uppercase tracking-widest text-[#0064E0]">Invoice experience</p>
   <h1 className="mt-1 text-xl font-bold text-[#173652] sm:text-2xl">Client-facing invoice preview</h1>
   <p className="mt-1 text-xs leading-5 text-slate-500">Merchant-controlled demonstration of what a customer will see after genuine issuance. No link is sent.</p>
  </header>
  <InvoiceAudienceToolbar invoice={invoice} audience="client"/>
  <div className="mx-auto min-w-0 max-w-[900px]">
   <InvoiceDocumentPreviewSection
    draft={draft} setDraft={setDraft}
    profile={profile} setProfile={()=>{}}
    payment={payment} setPayment={()=>{}}
    template={invoiceAppearance.template}
    merchantLogo={logoPreview} paymentMode={invoice.paymentMode}/>
  </div>
 </main>;
}
