"use client";
import Link from "next/link";
import {ArrowLeft,ArrowRight,ExternalLink,FileText,Landmark,LockKeyhole,ShieldCheck} from "lucide-react";
import {NrsReadinessPanel} from "@/src/features/finance/NrsReadinessPanel";
import {financeJourney,nrsAuthorityBoundaries,nrsPaymentStatusReference,nrsReferenceLinks} from "@/src/features/finance/nrs-journey";

const phaseTitle:Record<"preview"|"specified"|"external",string>={
 preview:"Previewed UI",specified:"Specified · backend required",external:"External authorisation required"
};
export function NrsJourneyWorkspace(){
 return <main className="min-w-0 space-y-5 pb-10" aria-label="NRS and invoice lifecycle review">
  <header className="flex flex-wrap items-start justify-between gap-3">
   <div className="min-w-0">
    <Link href="/dashboard/tax-centre" className="inline-flex min-h-9 items-center gap-1.5 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={15}/> Tax Centre</Link>
    <h1 className="mt-1 text-xl font-bold text-[#173652] sm:text-2xl">NRS & invoice journey</h1>
    <p className="mt-1 text-xs text-slate-500">Connection readiness, document authority and collection flow</p>
   </div>
   <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900">Not connected</span>
  </header>
  <NrsReadinessPanel/>
  <section className="rounded-2xl border border-[#E1EAF5] bg-white p-4 sm:p-5" aria-labelledby="eight-stage-title">
   <div className="flex flex-wrap items-start justify-between gap-2"><div>
    <h2 id="eight-stage-title" className="font-bold text-[#173652]">Invoice-to-reconciliation journey</h2>
    <p className="mt-1 text-xs text-slate-500">Eight linked responsibilities, not eight completed integrations.</p>
   </div><span className="text-[11px] font-semibold text-[#0064E0]">Merchant → customer → reconciliation</span></div>
   <ol className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" aria-label="Eight-stage user journey">
    {financeJourney.map((stage,index)=><li key={stage.id} className="min-w-0 rounded-xl border border-[#DBE7F6] bg-[#F6F9FF] p-3">
      <div className="flex items-center justify-between gap-2"><span className="text-xs font-bold text-[#0064E0]">{String(index+1).padStart(2,"0")}</span>
       {index<financeJourney.length-1?<ArrowRight size={15} className="shrink-0 text-[#8BA6CE]" aria-hidden/>:null}
      </div>
      <h3 className="mt-2 text-sm font-bold text-[#173652]">{stage.title}</h3>
      <p className="mt-1 text-xs leading-5 text-[#435E78]">{stage.summary}</p>
      <p className="mt-2 text-[10px] font-semibold text-[#0064E0]">{phaseTitle[stage.mode]}</p>
      <p className="mt-1 text-[11px] leading-4 text-slate-500">{stage.dependency}</p>
    </li>)}
   </ol>
  </section>
  <div className="grid gap-4 lg:grid-cols-2">
   <section className="rounded-2xl border border-[#E1EAF5] bg-white p-4 sm:p-5" aria-labelledby="authority-title">
    <h2 id="authority-title" className="font-bold text-[#173652]">What each record proves</h2>
    <div className="mt-3 divide-y divide-[#EEF2F7]">{nrsAuthorityBoundaries.map(a=><div key={a.id} className="py-3">
      <h3 className="text-sm font-semibold text-[#173652]">{a.title}</h3><p className="mt-1 text-xs leading-5 text-slate-600">{a.detail}</p>
    </div>)}</div>
   </section>
   <section className="rounded-2xl border border-[#E1EAF5] bg-white p-4 sm:p-5" aria-labelledby="compliance-title">
    <h2 id="compliance-title" className="font-bold text-[#173652]">NRS connection milestones</h2>
    <p className="mt-1 text-xs text-slate-500">Official qualification belongs to NRS, not a Preview checkbox.</p>
    <div className="mt-3 space-y-2">{[
      ["Determine applicability","Confirm taxpayer category and relevant rollout obligations"],
      ["Authorise integration","Choose SI/APP or an accredited provider; confirm merchant consent"],
      ["Map & validate","Business/Service IDs, structured invoice, tax and invoice-line resources"],
      ["Receive fiscal response","Signed/confirmed status, official IRN and QR where applicable"],
      ["Update payment status","NRS documents PARTIAL for verified instalments, then PAID when fully settled"]
     ].map(([title,detail],i)=><div key={title} className="flex items-start gap-2 rounded-lg bg-[#F7FAFE] px-3 py-2.5">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E5F0FF] text-[11px] font-bold text-[#0064E0]">{i+1}</span>
      <span className="min-w-0"><strong className="block text-xs text-[#173652]">{title}</strong><span className="mt-1 block text-[11px] leading-4 text-slate-500">{detail}</span></span>
     </div>)}</div>
    <p className="mt-3 text-[11px] leading-5 text-amber-800">No taxpayer link, accreditation, official IRN, fiscal QR, submission, or payment update exists in this Preview.</p>
   </section>
  </div>
  <section className="rounded-2xl border border-[#E1EAF5] bg-white p-4 sm:p-5">
   <h2 className="text-sm font-bold text-[#173652]">NRS payment-state reference</h2>
   <div className="mt-3 flex flex-wrap gap-2">{nrsPaymentStatusReference.map(status=><span key={status} className="rounded-lg border border-blue-100 bg-[#F3F8FF] px-3 py-1.5 text-xs font-semibold text-[#0064E0]">{status}</span>)}</div>
   <p className="mt-2 text-xs leading-5 text-slate-600">The April 2026 NRS changelog supports PARTIAL payment updates for instalments. They require a genuine source-confirmed payment; choosing 70/30, generating a receipt or receiving a payout does not itself establish paid status.</p>
   <div className="mt-4 flex flex-wrap gap-2">
    <Link href="/dashboard/payment-received" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#0064E0] px-4 text-xs font-semibold text-white"><Landmark size={15}/> Payment Received</Link>
    <Link href="/dashboard/invoice" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#CDE0F6] px-4 text-xs font-semibold text-[#0064E0]"><FileText size={15}/> Invoice workspace</Link>
   </div>
  </section>
  <section className="rounded-2xl border border-[#D7E5F4] bg-[#F7FAFE] p-4 sm:p-5" aria-label="Technical and partner readiness">
   <h2 className="flex items-center gap-2 text-sm font-bold text-[#173652]"><LockKeyhole size={17} className="text-[#0064E0]"/> Accreditation & banking integration</h2>
   <p className="mt-2 text-xs leading-5 text-slate-600">Octalve proposes to integrate merchant invoicing with authorised NRS routes and regulated bank/PSP collection APIs. A bank virtual collection account is not automatically a corporate current account for every invoice. Secure KYC/KYB, tenancy, credential vaults, webhooks, expiries, settlement, retries and audit controls require written partner agreements and separately authorised backend work.</p>
   <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
    {nrsReferenceLinks.map(ref=><a key={ref.url} href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-[#0064E0]">{ref.name} <ExternalLink size={13}/></a>)}
   </div>
   <p className="mt-2 inline-flex items-center gap-2 text-[11px] text-slate-500"><ShieldCheck size={15}/> Readiness display only · no NRS connection or keys</p>
  </section>
 </main>;
}
