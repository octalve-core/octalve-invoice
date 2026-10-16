"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,ChevronDown,HelpCircle,Search,ShieldCheck} from "lucide-react";
const topics=[
 {name:"Invoices & documents",questions:[
 ["What is the difference between an invoice and a receipt?","An invoice requests or records money owed. A receipt confirms a payment already received. Receipts can reference invoices, but producing a receipt never creates additional revenue."],
 ["Can I create a receipt after an invoice has been paid?","Yes. Select an eligible paid invoice when creating a receipt, or choose an independently verified payment. A receipt can be generated later without changing the original invoice."],
 ["Can I download an invoice again?","You can download previews in this phase. After secure issuance is implemented, exact issued PDF snapshots will be stored so later profile or template changes cannot alter past invoices."],
 ["Can I customize invoice colours, fonts and layout?","Theme Settings contains approved document-style options and a live design preview. Final exported-template parity must pass PDF/PNG checks before customised styles can be issued."]]},
 {name:"Payments & accounting",questions:[
 ["When is an invoice treated as paid?","Only verified funds count. For direct company bank transfers, an authorized staff member must confirm bank-cleared payment evidence. Gateway or dynamic-account invoices require provider verification; a browser redirect or screenshot alone is insufficient."],
 ["Are receipts counted as separate revenue?","No. Verified payment transactions are the source of collections. An invoice contributes to receivables until allocated payment is verified; a receipt only documents that payment."],
 ["Can customers pay through Paystack, Flutterwave or a virtual account?","These options will become available once your business payment methods are connected and verified."]]},
 {name:"Security & records",questions:[
 ["What happens when I delete a record?","Deletion requires a second confirmation and a reason. Recoverable records go to Deleted Records for a proposed 14-day period; the current workspace uses example records that are not permanently saved. Issued invoices, payment records, receipts and audit evidence are never silently erased at 14 days."],
 ["Can staff hide or permanently remove payments?","No staff member should be able to erase payment evidence. Permanent financial records will require owner/admin privileges, immutable audit logs, retained finance history and authorization for voids or reversals."],
 ["Are my changes saved permanently now?","Not yet. Some screens use example records and changes may reset when you refresh. Secure, organization-specific storage must be enabled before records can be saved permanently."]]},
 {name:"Financial planning tools",questions:[
 ["What calculators are available?","The Finance Calculator includes 20 tools across loans, savings, investments, pricing, cash flow and business analysis. You can change assumptions, view projection schedules, copy summaries and export relevant CSV models."],
 ["How are loan repayments and savings returns calculated?","Loan estimates use a fixed nominal annual rate divided by 12 and equal monthly amortization. Savings and investment growth use monthly compounding, with recurring contributions credited at each month's end. Provider terms may differ."],
 ["Does the Finance Calculator use my invoices or bank balance automatically?","No. These are standalone planning tools driven by values you enter. They do not fetch customer balances, access bank connections, post accounting entries or alter invoices."],
 ["Is gross margin the same as markup?","No. Gross margin divides unit profit by selling price; markup divides unit profit by cost. The calculator shows both and uses the correct denominator for each."],
 ["Does the tax calculator determine the correct NRS tax rate?","No. Sales-tax examples require the user to enter a rate. Actual tax applicability, invoice-line classification, statutory exemptions and NRS submissions must be verified separately; the calculator does not file or remit tax."],
 ["Can I use calculator projections as proof of business income?","No. Projections are what-if estimates, not statements of account, verified collections or audit evidence. Official reports must come from authenticated and reconciled business records."]]},
 {name:"Recurring, customer portal & support",questions:[
 ["Can I create a 70/30 invoice installment arrangement?","The invoice screen previews a custom first-and-remaining installment calculation. Saving a binding installment schedule, sending milestone reminders and accepting installment payments will require the approved server-side payment ledger and document history."],
 ["How does the customer portal protect my clients?","The current customer portal is a design preview without customer data. Operational access will use scoped merchant/customer identity, revocable expiring invites and object-level permission checks."],
 ["Do recurring invoices issue automatically?","Not yet. The recurring screen previews dates, frequencies and amounts. Live recurring document generation will require authorization, versioned schedules, idempotent jobs and a trusted server clock."],
 ["Are Octalve Support draft messages delivered?","No. Drafts are local-only demonstrations until a secure support inbox, ticket assignment, consent and verified messaging service is active."]]},
 {name:"Plans & support",questions:[
 ["How does the free plan work?","A proposed free tier allows 25 invoices monthly for one business. It is a pricing proposal, not an activated subscription or charge."],
 ["Are payment processing fees included?","No. External provider fees and applicable taxes must be shown separately and verified against the provider's active contract before collection is enabled."],
 ["How do I contact support?","Use Octalve's verified business contact channels. This Preview does not send support tickets or messages."]]}
];
export default function FAQsPage(){
 const [query,setQuery]=useState(""),[expanded,setExpanded]=useState("");
 const matches=useMemo(()=>topics.map(g=>({...g,questions:g.questions.filter(([q,a])=>(q+" "+a).toLowerCase().includes(query.toLowerCase()))})).filter(g=>g.questions.length),[query]);
 return <main className="w-full min-w-0 space-y-5 pb-12">
 <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-sm font-medium text-[#0064E0]"><ArrowLeft size={17}/> Back to Settings</Link>
 <header className="rounded-2xl bg-gradient-to-br from-[#073B78] to-[#0064E0] p-6 text-white sm:p-8"><HelpCircle size={30}/><h1 className="mt-3 text-2xl font-bold sm:text-3xl">How can we help?</h1><p className="mt-2 text-sm text-blue-100">Clear answers about invoices, payments and your workspace.</p></header>
 <label className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4"><Search size={19} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} aria-label="Search FAQs" placeholder="Search help topics" className="w-full bg-transparent text-sm outline-none"/></label>
 <div className="grid gap-5 lg:grid-cols-2">{matches.map(group=><section key={group.name} className="self-start overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><h2 className="border-b border-slate-100 bg-[#F8FAFD] px-5 py-4 text-sm font-semibold text-[#15344F]">{group.name}</h2><div className="divide-y divide-slate-100">{group.questions.map(([question,answer])=><div key={question}><button aria-expanded={expanded===question} onClick={()=>setExpanded(expanded===question?"":question)} className="flex min-h-16 w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-[#183550]">{question}<ChevronDown size={17} className={`shrink-0 text-[#0064E0] transition-transform ${expanded===question?"rotate-180":""}`}/></button>{expanded===question?<p className="px-5 pb-5 text-sm leading-6 text-slate-600">{answer}</p>:null}</div>)}</div></section>)}</div>
 {!matches.length?<p className="rounded-xl bg-white p-6 text-sm text-slate-600">No matching questions. Try a different word.</p>:null}
 <p className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={16}/> Financial and account features are subject to server-side verification before launch.</p>
 </main>;
}