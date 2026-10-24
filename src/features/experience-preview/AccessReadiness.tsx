import Link from "next/link";
import {ArrowLeft,CheckCircle2,LockKeyhole,ShieldAlert,ShieldCheck,UserRoundCheck} from "lucide-react";
import {z04ReadinessChecklist} from "./z04-proposed-authorization";

export type AccessExperience="merchant"|"customer"|"platform";
const journeys={
 merchant:{
  back:"/dashboard/staff",backLabel:"Staff directory",heading:"Staff access readiness",
  summary:"A team member belongs to one merchant organization at a time and receives only explicitly approved scopes.",
  cards:[
   ["Identity","Verify the staff member's own account and email before any invitation is accepted."],
   ["Membership","Business owners grant organization-specific staff permissions; copying a role from another business never grants access."],
   ["Financial boundary","Invoices and receipts remain source-authorised. A staff role alone cannot mark provider payments paid, refund or fiscalize."]
  ],
  checks:["Separate merchant organization membership","Revocable invitations and role scope","Independent financial maker/checker controls"]
 },
 customer:{
  back:"/customer/settings",backLabel:"My account",heading:"Customer access readiness",
  summary:"A customer sees only documents explicitly shared through accepted, merchant-scoped grants — even with one Octalve identity.",
  cards:[
   ["Verified account","The email address must be verified independently. Matching a customer's billing email cannot grant access."],
   ["Document permission","Merchant, customer-party and invoice must all match a current accepted access grant."],
   ["Safe sharing","Invitation expiry, revocation and signed links are checked server-side; no real invitation or link exists here."]
  ],
  checks:["Customer grant distinct from merchant role","Invitation proof and expiry","Document and merchant scope rechecked every read"]
 },
 platform:{
  back:"/admin/security",backLabel:"Security",heading:"Octalve staff access readiness",
  summary:"Octalve employees need an approved platform appointment and MFA; support cases never imply unrestricted merchant access.",
  cards:[
   ["Staff approval","An Octalve staff identity and approved role are separate from any merchant or customer account."],
   ["Case-scoped access","Support access needs an assigned case, lawful purpose, minimum necessary record scope, approval and expiry."],
   ["Audit & oversight","Denied and allowed attempts, sensitive actions, justification, review and revocations must be server-audited."]
  ],
  checks:["No automatic admin role from email domain","Fresh MFA and case-bound grants","Independent billing, compliance and support scopes"]
 }
} as const;
const card="rounded-2xl border border-[#E3ECF6] bg-white p-4 sm:p-5";
export function AccessReadiness({experience}:{experience:AccessExperience}){
 const current=journeys[experience];
 return <main className="mx-auto min-w-0 max-w-[1080px] space-y-5 pb-8">
  <header>
   <Link href={current.back} className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-[#0064E0]"><ArrowLeft size={16}/>{current.backLabel}</Link>
   <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
    <div><p className="text-xs font-medium text-[#0064E0]">Access & security · Phase Z04</p>
     <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#173652]">{current.heading}</h1></div>
    <span className="rounded-full border border-[#D7E6F9] bg-[#F1F7FF] px-3 py-1.5 text-[11px] font-medium text-[#0064E0]">Specification preview</span>
   </div>
   <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-600">{current.summary}</p>
  </header>
  <p role="status" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950">
   <ShieldAlert size={18} className="mt-0.5 shrink-0"/>
   No live authentication, customer grants, staff permissions, restricted data or support delegation is active in this UI demonstration. These pages do not enforce authorization.
  </p>
  <section aria-label="Required access boundaries" className="grid min-w-0 gap-3 md:grid-cols-3">
   {current.cards.map(([title,note],i)=><article key={title} className={card}>
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF3FF] text-[#0064E0]">{i===0?<UserRoundCheck size={20}/>:i===1?<LockKeyhole size={20}/>:<ShieldCheck size={20}/>}</span>
    <h2 className="mt-3 text-sm font-semibold text-[#173652]">{title}</h2>
    <p className="mt-2 text-xs leading-6 text-slate-600">{note}</p>
   </article>)}
  </section>
  <div className="grid min-w-0 items-start gap-3 lg:grid-cols-2">
   <section aria-label="Authorization gates" className={card}>
    <h2 className="text-sm font-semibold text-[#173652]">Before this experience becomes operational</h2>
    <ul className="mt-3 space-y-3">{current.checks.map(text=><li key={text} className="flex items-start gap-2 text-xs leading-5 text-slate-600">
     <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[#0064E0]"/>{text}</li>)}</ul>
    <div className="mt-5 rounded-xl bg-[#F4F8FF] p-3 text-xs leading-5 text-slate-600">Operational readiness: <strong className="text-[#173652]">Not activated</strong>. No access grants or changes can be submitted from this view.</div>
   </section>
   <section aria-label="Server implementation checklist" className={card}>
    <h2 className="text-sm font-semibold text-[#173652]">Shared server security gates</h2>
    <ul className="mt-3 space-y-2">{z04ReadinessChecklist.map(text=><li key={text} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0064E0]"/>{text}</li>)}</ul>
   </section>
  </div>
 </main>;
}
