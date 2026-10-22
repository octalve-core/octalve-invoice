"use client";
import Link from "next/link";
import {useParams,usePathname} from "next/navigation";
import {useState} from "react";
import {ArrowLeft,ArrowRight,FileText,LockKeyhole} from "lucide-react";
import {getPreviewInvoice} from "@/src/features/invoices/lib/preview-records";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";
import {calculateInvoiceTotals} from "@/src/features/invoice/lib/calculations";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {merchantCompany,merchantPayment} from "@/src/features/merchant-preview/merchant-presentation";
import {InvoiceEditorSection,type InvoiceStep} from "./InvoiceEditorSection";
import {InvoiceDocumentPreviewSection} from "./InvoiceDocumentPreviewSection";
import {createPreviewInvoice} from "@/src/features/invoices/lib/preview-fixture";
import {applyNewInvoicePreferences} from "@/src/features/invoices/lib/invoice-preferences";
import {newDraftPaymentPlan} from "@/src/features/invoices/lib/draft-payment-plan";

const steps:{id:InvoiceStep;label:string;short:string}[]=[
 {id:"details",label:"Invoice details",short:"Details"},
 {id:"items",label:"Items & services",short:"Items"},
 {id:"charges",label:"Tax & notes",short:"Totals"},
 {id:"workflow",label:"Payment terms",short:"Payments"},
 {id:"preview",label:"Review invoice",short:"Preview"}
];
const isStep=(value:string|undefined):value is InvoiceStep=>steps.some(step=>step.id===value);

export function InvoiceComposer({mode="create",invoiceId}:{mode?:"create"|"edit";invoiceId?:string}){
 const params=useParams<{id?:string;step?:string}>();
 const pathname=usePathname();
 const currentInvoiceId=invoiceId??params.id;
 const leaf=pathname.split("/").filter(Boolean).at(-1);
 const step:InvoiceStep=isStep(leaf)?leaf:"details";
 const currentIndex=steps.findIndex(item=>item.id===step);
 const base=mode==="edit"?"/dashboard/invoice/"+currentInvoiceId+"/edit":"/dashboard/invoice/create";
 const {settings,setSettings,logoPreview,paymentMode,invoiceAppearance,invoicePreferences}=useMerchantPreview();
 const [draft,setDraft]=useState(()=>{
  const initial={...(mode==="create"?applyNewInvoicePreferences(createPreviewInvoice(),invoicePreferences):createPreviewInvoice()),paymentPlan:newDraftPaymentPlan()};
  const matching=mode==="edit"&&currentInvoiceId?getPreviewInvoice(currentInvoiceId):undefined;
  return matching?{...initial,invoiceNo:matching.reference,clientName:matching.customer,clientEmail:matching.email}:
   {...initial,invoiceNo:formatDocumentNumber(settings.businessName||"Octalve Limited",1,"invoice")};
 });
 const [templateOverride,setTemplateOverride]=useState<"modern"|"ledger"|null>(null);
 const template=templateOverride??invoiceAppearance.template;
 const profile=merchantCompany(settings);
 const payment=merchantPayment(settings);
 const setProfile:React.Dispatch<React.SetStateAction<typeof profile>>=(value)=>setSettings(old=>{
  const changed=typeof value==="function"?value(merchantCompany(old)):value;
  return {...old,businessName:changed.name,businessPhone:changed.phone,email:changed.email,
   businessAddress:changed.address,website:changed.website,rcNumber:changed.rcNo,taxId:changed.tinNo};
 });
 const setPayment:React.Dispatch<React.SetStateAction<typeof payment>>=(value)=>setSettings(old=>{
  const changed=typeof value==="function"?value(merchantPayment(old)):value;
  return {...old,bankName:changed.bankName,accountNumber:changed.accountNumber};
 });
 const totals=calculateInvoiceTotals(draft.rows,draft.discount,draft.tax);
 const formattedTotal=Number.isFinite(totals.total)?new Intl.NumberFormat("en-NG",{style:"currency",currency:draft.currency,maximumFractionDigits:2}).format(totals.total):"Check amounts";
 const href=(value:InvoiceStep)=>base+"/"+value;
 const previous=currentIndex>0?steps[currentIndex-1]:null;
 const next=currentIndex<steps.length-1?steps[currentIndex+1]:null;
 return <div className="min-w-0 space-y-5 pb-12">
  <header className="flex flex-wrap items-end justify-between gap-3">
   <div>
    <Link href="/dashboard/invoice" className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={15}/> All invoices</Link>
    <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#173652]">{mode==="edit"?"Edit invoice":"Create invoice"}</h1>
    <p className="mt-1 text-xs text-slate-500">Step {currentIndex+1} of {steps.length} · {steps[currentIndex].label}</p>
   </div>
   <div className="flex items-center gap-2">
    <span className="rounded-full border border-[#E7D6D6] bg-[#FFF4F4] px-3 py-1.5 text-[11px] font-semibold text-[#943C44]">Draft</span>
    {step!=="preview"?<Link href={href("preview")} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#B8D6FC] bg-white px-4 text-xs font-semibold text-[#0064E0]">
     <FileText size={16}/> View invoice</Link>:null}
   </div>
  </header>

  <nav aria-label="Invoice steps" className="grid min-w-0 grid-cols-5 gap-1.5 sm:gap-2">
   {steps.map((item,index)=><Link key={item.id} href={href(item.id)} aria-current={step===item.id?"step":undefined} title={item.label}
     className={"flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border px-1 py-3 text-center transition-colors sm:flex-row sm:justify-start sm:gap-2 sm:rounded-2xl sm:px-3 "+
      (step===item.id?"border-[#0064E0] bg-[#E9F3FF] text-[#0064E0] shadow-[inset_0_3px_0_#0064E0]":"border-[#E5ECF5] bg-white text-[#677B93] hover:border-[#BAD9FF] hover:bg-[#F6FAFF]")}>
      <span className={"grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold "+
       (step===item.id?"bg-[#0064E0] text-white":index<currentIndex?"bg-[#DCEBFF] text-[#0064E0]":"bg-[#EDF2F8] text-[#7489A0]")}>
       {index+1}
      </span>
      <span className="truncate text-[10px] font-semibold sm:text-xs">{item.short}</span>
    </Link>)}
  </nav>

  <div className={step==="preview"?"min-w-0":"grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_300px]"}>
   <InvoiceEditorSection draft={draft} setDraft={setDraft} step={step}/>
   {step==="preview"?
    <div className="mx-auto w-full max-w-[1050px] space-y-4">
     <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E4EDF7] bg-white p-4">
      <div><h2 className="text-sm font-bold text-[#173652]">Invoice preview</h2>
       <p className="mt-1 text-xs text-slate-500">Check the information and layout before issuing.</p></div>
      <label className="flex items-center gap-2 text-xs font-medium text-[#173652]">Template
       <select aria-label="Template" value={template} onChange={e=>setTemplateOverride(e.target.value as "modern"|"ledger")}
        className="h-10 rounded-xl border border-[#DCE7F4] bg-white px-3 text-xs focus-visible:outline-2 focus-visible:outline-[#0064E0]">
        <option value="modern">Octalve Modern</option><option value="ledger">Classic Ledger</option>
       </select></label>
     </div>
     <InvoiceDocumentPreviewSection draft={draft} setDraft={setDraft} profile={profile} setProfile={setProfile}
      payment={payment} setPayment={setPayment} template={template} merchantLogo={logoPreview} paymentMode={paymentMode}/>
    </div>:
    <aside className="space-y-4 rounded-2xl border border-[#E2EBF6] bg-white p-4 lg:sticky lg:top-5">
     <div className="flex items-center gap-2"><FileText className="text-[#0064E0]" size={18}/><h2 className="text-sm font-bold text-[#173652]">Invoice summary</h2></div>
     <div className="rounded-xl bg-[#F4F8FF] p-4">
      <p className="text-[11px] text-[#6B8198]">Total</p>
      <p className="mt-1 break-words text-xl font-bold text-[#173652]">{formattedTotal}</p>
      <p className="mt-2 text-xs text-[#6B8198]">{draft.rows.length} item{draft.rows.length===1?"":"s"} · {draft.currency}</p>
     </div>
     <dl className="space-y-3 text-xs">
      <div><dt className="text-slate-500">Customer</dt><dd className="mt-1 truncate font-semibold text-[#173652]">{draft.clientName||"Not selected"}</dd></div>
      <div><dt className="text-slate-500">Reference</dt><dd className="mt-1 break-all font-semibold text-[#173652]">{draft.invoiceNo}</dd></div>
     </dl>
     <Link href={href("preview")} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] px-4 text-xs font-semibold text-white"><FileText size={16}/> Review invoice</Link>
     <p className="text-[11px] leading-5 text-slate-500">Your edits stay in place while you switch steps.</p>
    </aside>}
  </div>

  <footer className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#E2EBF6] bg-white p-4">
   {previous?<Link href={href(previous.id)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#DCE7F4] px-5 text-xs font-semibold text-[#315273]"><ArrowLeft size={15}/> Back</Link>:
    <Link href="/dashboard/invoice" className="inline-flex min-h-11 items-center rounded-full border border-[#DCE7F4] px-5 text-xs font-semibold text-[#315273]">All invoices</Link>}
   {next?<Link href={href(next.id)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0064E0] px-5 text-xs font-semibold text-white">
    {next.id==="preview"?"Review invoice":"Continue"}<ArrowRight size={15}/></Link>:
   <div className="flex flex-wrap items-center gap-3">
    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#74869A]"><LockKeyhole size={14}/> Issuing available after account setup</span>
    <button type="button" disabled className="min-h-11 rounded-full bg-[#0064E0] px-5 text-xs font-semibold text-white opacity-55">Issue invoice</button>
   </div>}
  </footer>
 </div>;
}
