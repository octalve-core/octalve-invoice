"use client";
import type {BusinessIdentityProfile,InvoiceDraft,InvoiceTotals} from "../../types";
import {formatMoney} from "../../lib/currency";
import {merchantInitials} from "@/src/features/invoices/lib/document-number";
interface Props {draft:InvoiceDraft;totals:InvoiceTotals;companyProfile:BusinessIdentityProfile;logoSrc?:string|null;}
/** Merchant source of truth is Business Settings, not Sapphire's demo identity. */
export function InvoiceHeader({draft,totals,companyProfile,logoSrc}:Props){
 return <header className="sq-v4-header">
  <div className="sq-v4-brand-side">
   <div className="sq-v4-logo-disc" aria-label={logoSrc?`${companyProfile.name} logo`:`${companyProfile.name} initials`}>
      {logoSrc?<img src={logoSrc} alt={`${companyProfile.name} logo`} className="sq-v4-brand-icon" />:
      <span className="flex h-full w-full items-center justify-center rounded-full bg-[#EAF2FF] text-2xl font-extrabold tracking-wide text-[#0064E0]">{merchantInitials(companyProfile.name||"Business")}</span>}
    </div>
   <div className="sq-v4-brand-copy">
    <div className="sq-v4-invoice-number" aria-label="Invoice number">{draft.invoiceNo}</div>
    <h1>{companyProfile.name || "Your business name"}</h1>
    {companyProfile.website?<p>{companyProfile.website}</p>:null}
    {companyProfile.address?<p>{companyProfile.address}</p>:null}
   </div>
  </div>
  <div className="sq-v4-meta-side">
   <div className="sq-v4-amount-line"><span>Amount Due</span><strong>{formatMoney(totals.total,draft.currency)}</strong></div>
   <div className="sq-v4-meta-grid">
    <div className="sq-meta-field"><span>Date Issued</span><strong>{[draft.day,draft.month,draft.year].join(" / ")}</strong></div>
    <div className="sq-meta-field"><span>Due Date</span><strong>{[draft.dueDay,draft.dueMonth,draft.dueYear].join(" / ")}</strong></div>
    <div className="sq-meta-field"><span>TIN No.</span><strong>{companyProfile.tinNo||"—"}</strong></div>
    <div className="sq-meta-field"><span>RC No.</span><strong>{companyProfile.rcNo||"—"}</strong></div>
   </div>
  </div>
 </header>;
}
