"use client";
import Link from "next/link";
import {useMerchantPreview,type DueDatePreference} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import type {CurrencyCode} from "@/src/features/invoice/types";
import {merchantInitials} from "@/src/features/invoices/lib/document-number";
import {InvoiceTemplateGallery} from "@/src/features/invoices/components/InvoiceTemplateGallery";
const field="mt-1 block h-11 w-full rounded-xl border border-[#D7E2EF] bg-white px-3 text-sm text-[#18334B] focus-visible:outline-2 focus-visible:outline-[#0064E0]";
export default function InvoiceSettingsPage(){
 const {settings,invoicePreferences,setInvoicePreferences,invoiceAppearance,setInvoiceAppearance,receiptAutoMode,setReceiptAutoMode}=useMerchantPreview();
 const preference=<K extends keyof typeof invoicePreferences>(key:K,value:(typeof invoicePreferences)[K])=>setInvoicePreferences(p=>({...p,[key]:value}));
 const appearance=<K extends keyof typeof invoiceAppearance>(key:K,value:(typeof invoiceAppearance)[K])=>setInvoiceAppearance(p=>({...p,[key]:value}));
 return <main className="mx-auto w-full max-w-5xl space-y-5 pb-8">
  <header className="space-y-2"><Link href="/dashboard/settings" className="text-xs font-semibold text-[#0064E0]">← Settings</Link>
   <h1 className="text-2xl font-bold text-[#193955]">Invoice preferences</h1>
   <p className="text-sm text-slate-500">Choose how new invoices should look and the details they start with. Changes here also appear on new invoice drafts.</p>
  </header>
  <div className="grid gap-5 lg:grid-cols-2">
   <section className="space-y-4 rounded-2xl border border-[#E0EAF5] bg-white p-5 shadow-sm" aria-label="Document appearance settings">
    <header><h2 className="font-bold text-[#193955]">Document appearance</h2><p className="mt-1 text-xs text-slate-500">Your selected template and colours apply to new document previews.</p></header>
    <div className="space-y-2"><p className="text-xs font-semibold text-[#314761]">Default invoice template</p>
     <InvoiceTemplateGallery selected={invoiceAppearance.template} onSelect={style=>appearance("template",style)}/>
     <p className="text-[11px] text-slate-500">Only Octalve Modern and Classic Ledger are available. New original template layouts and the owner-supplied Legal design will follow separately.</p>
    </div>
    <label className="flex items-center justify-between gap-3 text-xs font-semibold text-[#314761]">Template accent colour
     <input type="color" aria-label="Template accent colour" value={invoiceAppearance.accent} onChange={e=>appearance("accent",e.target.value)} className="h-10 w-16 cursor-pointer rounded-md border border-slate-200 bg-white p-1"/>
    </label>
    <div className="grid gap-3 sm:grid-cols-2">
     <label className="block text-xs font-semibold text-[#314761]">Font style
      <select className={field} value={invoiceAppearance.font} onChange={e=>appearance("font",e.target.value as typeof invoiceAppearance.font)}><option value="system">Modern</option><option value="serif">Classic serif</option><option value="rounded">Rounded</option></select>
     </label>
     <label className="block text-xs font-semibold text-[#314761]">Spacing
      <select className={field} value={invoiceAppearance.density} onChange={e=>appearance("density",e.target.value as typeof invoiceAppearance.density)}><option value="comfortable">Comfortable</option><option value="compact">Compact</option></select>
     </label>
    </div>
    <label className="flex items-center gap-3 text-sm text-[#314761]"><input type="checkbox" className="h-4 w-4 accent-[#0064E0]" checked={invoiceAppearance.showFooter} onChange={e=>appearance("showFooter",e.target.checked)}/>Show document footer</label>
    <p className="text-xs text-slate-500">Your business logo comes from <Link href="/dashboard/settings/business" className="font-semibold text-[#0064E0] underline">Business Settings</Link>. Every unissued document receives a draft watermark, regardless of theme.</p>
   </section>
   <section className="space-y-4 rounded-2xl border border-[#E0EAF5] bg-white p-5 shadow-sm" aria-label="Invoice defaults settings">
    <header><h2 className="font-bold text-[#193955]">New invoice defaults</h2><p className="mt-1 text-xs text-slate-500">These choices affect new drafts only, not previously issued invoices.</p></header>
    <label className="block text-xs font-semibold text-[#314761]">Default currency
     <select className={field} value={invoicePreferences.currency} onChange={e=>preference("currency",e.target.value as CurrencyCode)}><option value="NGN">Nigerian naira (NGN)</option><option value="USD">US dollar (USD)</option><option value="GBP">Pound sterling (GBP)</option><option value="EUR">Euro (EUR)</option></select>
    </label>
    <label className="block text-xs font-semibold text-[#314761]">Default payment term
     <select className={field} value={invoicePreferences.preferredDueDate} onChange={e=>preference("preferredDueDate",e.target.value as DueDatePreference)}><option value="1week">7 days</option><option value="2weeks">14 days</option><option value="1month">1 calendar month</option><option value="custom">Choose on each invoice</option></select>
    </label>
    <label className="block text-xs font-semibold text-[#314761]">Invoice prefix
     <input className={field+" bg-[#F7F9FC]"} value={merchantInitials(settings.businessName||"Octalve Limited")} readOnly aria-label="Invoice prefix"/>
    </label>
    <p className="text-xs leading-5 text-slate-500">Numbers are allocated when an invoice is issued. Tax rates are never assumed: review the correct treatment for each item and invoice.</p>
    <label className="flex items-center gap-3 text-sm text-[#314761]"><input type="checkbox" className="h-4 w-4 accent-[#0064E0]" checked={invoicePreferences.showPaymentHistory} onChange={e=>preference("showPaymentHistory",e.target.checked)}/>Show payment history where available</label>
    <label className="flex items-center gap-3 text-sm text-[#314761]"><input type="checkbox" className="h-4 w-4 accent-[#0064E0]" checked={invoicePreferences.enableAutoReminder} onChange={e=>preference("enableAutoReminder",e.target.checked)}/>Prefer payment reminders when enabled</label>
   </section>
   <section className="space-y-4 rounded-2xl border border-[#E0EAF5] bg-white p-5 shadow-sm" aria-label="Receipt preferences">
    <header><h2 className="font-bold text-[#193955]">Payment receipts</h2><p className="mt-1 text-xs text-slate-500">Choose what should happen after a verified online payment.</p></header>
    <label className="block text-xs font-semibold text-[#314761]">Automatic receipt preference
     <select className={field} value={receiptAutoMode} onChange={e=>setReceiptAutoMode(e.target.value as typeof receiptAutoMode)}><option value="off">Create receipt manually when needed</option><option value="generate">Generate receipt after verified payment</option><option value="generate_and_email">Generate and email after verified payment</option></select>
    </label>
    <p className="text-xs text-slate-500">Automatic processing is not active yet. A receipt does not count a payment twice.</p>
   </section>
   <section className="space-y-4 rounded-2xl border border-[#E0EAF5] bg-white p-5 shadow-sm" aria-label="Account and compliance settings">
    <h2 className="font-bold text-[#193955]">Business, payments and tax</h2>
    <p className="text-xs text-slate-500">Business identity, bank details and tax registration should be completed once for the whole workspace.</p>
    <Link href="/dashboard/settings/business" className="block rounded-xl border border-[#C8DFF9] px-4 py-3 text-sm font-semibold text-[#0064E0] hover:bg-blue-50">Review business identity and bank details →</Link>
    <Link href="/dashboard/tax-centre" className="block rounded-xl border border-[#C8DFF9] px-4 py-3 text-sm font-semibold text-[#0064E0] hover:bg-blue-50">Review tax and NRS readiness →</Link>
    <p className="text-xs text-slate-500">No tax filing, online payment or invoice issuance is activated by these preferences.</p>
   </section>
  </div>
  <p role="status" className="rounded-xl border border-blue-100 bg-[#F2F7FF] p-4 text-xs text-[#365778]">Changes are applied to this session’s new invoice drafts. Account saving will become available after secure sign-in is activated.</p>
 </main>;
}
