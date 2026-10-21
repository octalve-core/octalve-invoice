"use client";
import Link from "next/link";
import {Activity,ArrowRight,BadgeCheck,Bell,BookOpen,Building2,CheckCircle2,ChevronRight,ClipboardList,Clock3,CreditCard,FileClock,Headset,LockKeyhole,Megaphone,Search,ShieldCheck,Users,UserCog} from "lucide-react";
import {useMemo,useState} from "react";
export type AdminSection="overview"|"merchants"|"customers"|"subscriptions"|"verifications"|"support"|"notifications"|"updates"|"staff"|"security"|"audit";
export const adminSections:readonly AdminSection[]=["overview","merchants","customers","subscriptions","verifications","support","notifications","updates","staff","security","audit"];
const labels:Record<AdminSection,string>={overview:"Operations overview",merchants:"Merchants",customers:"Customers",subscriptions:"Subscriptions",verifications:"Verifications",support:"Support",notifications:"Notifications",updates:"Product updates",staff:"Octalve staff",security:"Security",audit:"Audit trail"};
const cards="rounded-2xl border border-[#E2EBF5] bg-white p-4 sm:p-5";
const sampleMerchants=[
 {id:"OM-001",name:"Bluehaven Ventures",plan:"Growth",status:"Review required",contact:"admin@bluehaven.example.invalid"},
 {id:"OM-002",name:"Atlas Supply Co.",plan:"Starter",status:"Awaiting documents",contact:"owner@atlas.example.invalid"},
 {id:"OM-003",name:"Cedar Works",plan:"Business",status:"Active (example)",contact:"team@cedar.example.invalid"}
];
const sampleCases=[
 {id:"SUP-001",title:"Update company information",merchant:"Bluehaven Ventures",priority:"Normal",state:"Open"},
 {id:"SUP-002",title:"Subscription question",merchant:"Atlas Supply Co.",priority:"Low",state:"Pending"},
 {id:"SUP-003",title:"Invoice presentation enquiry",merchant:"Cedar Works",priority:"Normal",state:"Open"}
];
const quickNav:{id:AdminSection;note:string;icon:typeof Activity}[]=[
 {id:"merchants",note:"Business accounts and ownership",icon:Building2},
 {id:"subscriptions",note:"Plans, invoices and entitlements",icon:CreditCard},
 {id:"verifications",note:"Review business documents",icon:BadgeCheck},
 {id:"support",note:"Merchant support requests",icon:Headset},
 {id:"staff",note:"Roles and team access",icon:UserCog},
 {id:"security",note:"Controls and access events",icon:ShieldCheck}
];
function UnavailableAction({label}:{label:string}){return <button type="button" disabled title="Requires an authorised staff session and server audit" className="rounded-full border border-[#CCDCF0] px-3 py-2 text-xs font-semibold text-[#0064E0] opacity-50">{label}</button>;}
function RecordRow({primary,secondary,tag}:{primary:string;secondary:string;tag:string}){
 return <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[#EDF2F8] bg-[#FCFDFE] px-4 py-3">
  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EBF3FF] text-[#0064E0]"><ClipboardList size={18}/></span>
  <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-[#173652]">{primary}</p><p className="mt-1 truncate text-[11px] text-[#7B90A5]">{secondary}</p></div>
  <span className="max-w-[110px] rounded-full bg-[#F1F6FD] px-2.5 py-1 text-center text-[10px] font-semibold text-[#446B93]">{tag}</span>
 </div>;
}
export function AdminWorkspace({section="overview"}:{section?:AdminSection}){
 const [search,setSearch]=useState("");
 const merchants=useMemo(()=>sampleMerchants.filter(m=>[m.name,m.plan,m.id].some(x=>x.toLowerCase().includes(search.trim().toLowerCase()))),[search]);
 return <>
  <div className="flex flex-wrap items-start justify-between gap-3">
   <div><p className="text-xs font-semibold text-[#0064E0]">Octalve operations</p>
    <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#173652] sm:text-3xl">{labels[section]}</h1>
    <p className="mt-1 text-xs text-[#71869D]">Platform services and merchant support</p>
   </div>
   <span className="inline-flex items-center gap-2 rounded-full border border-[#E1EAF5] bg-white px-3 py-2 text-[11px] font-semibold text-[#6D849C]"><LockKeyhole size={14}/> Interface sample · No staff access</span>
  </div>
  {section==="overview"?<>
   <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">{[
    {title:"Example merchants",value:"03",icon:Building2,tone:"text-[#0064E0] bg-blue-50"},
    {title:"Review examples",value:"02",icon:BadgeCheck,tone:"text-amber-700 bg-amber-50"},
    {title:"Support examples",value:"03",icon:Headset,tone:"text-violet-700 bg-violet-50"},
    {title:"Active integrations",value:"None",icon:ShieldCheck,tone:"text-slate-700 bg-slate-100"}
   ].map(({title,value,icon:Icon,tone})=><section key={title} className={cards}>
     <span className={"grid h-10 w-10 place-items-center rounded-xl "+tone}><Icon size={20}/></span>
     <p className="mt-4 text-[11px] text-[#70869D]">{title}</p><p className="mt-1 text-xl font-bold text-[#173652]">{value}</p>
    </section>)}</div>
   <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
    <section className={cards}>
     <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold">Support queue</h2><Link href="/admin/support" className="text-xs font-semibold text-[#0064E0]">View cases <ArrowRight size={13} className="inline"/></Link></div>
     <div className="space-y-2">{sampleCases.map(c=><RecordRow key={c.id} primary={c.title} secondary={c.merchant+" · "+c.id} tag={c.state}/>)}</div>
    </section>
    <section className={cards}><h2 className="text-sm font-bold">Operations readiness</h2>
     <div className="mt-4 space-y-3">{[["Staff access","Requires identity and MFA"],["Merchant verification","Requires approval workflow"],["Billing operations","Requires financial entitlement authority"],["Support access","Case-bound and audited"]].map(([name,note])=><div key={name} className="flex items-start gap-2 border-b border-[#EDF2F8] pb-3 last:border-0"><Clock3 size={16} className="mt-0.5 shrink-0 text-[#0064E0]"/><div><p className="text-xs font-semibold">{name}</p><p className="mt-1 text-[11px] leading-4 text-slate-500">{note}</p></div></div>)}</div>
    </section>
   </div>
   <section className={cards}><h2 className="mb-4 text-sm font-bold">Manage the platform</h2><div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
    {quickNav.map(q=><Link key={q.id} href={"/admin/"+q.id} className="flex items-center gap-3 rounded-xl border border-[#E8EFF7] p-3 transition hover:border-[#B3D3FB] hover:bg-[#F7FAFF]">
     <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF3FF] text-[#0064E0]"><q.icon size={19}/></span>
     <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-[#173652]">{labels[q.id]}</span><span className="mt-1 block text-[11px] text-slate-500">{q.note}</span></span><ChevronRight size={16} className="text-slate-400"/>
    </Link>)}</div></section>
  </>:null}
  {section==="merchants"?<section className={cards}><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-bold">Merchant directory</h2><UnavailableAction label="Add merchant"/></div>
   <label className="relative mb-4 block max-w-md"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input aria-label="Find example merchants" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search businesses" className="h-11 w-full rounded-xl border border-[#DBE6F3] bg-[#F8FBFF] pl-10 pr-3 text-sm outline-none focus:border-[#0064E0]"/></label>
   <div className="space-y-2">{merchants.map(m=><RecordRow key={m.id} primary={m.name} secondary={m.id+" · "+m.plan+" · "+m.contact} tag={m.status}/>)}
   {merchants.length===0?<p className="p-5 text-center text-xs text-slate-500">No matching businesses.</p>:null}</div></section>:null}
  {section==="customers"?<section className={cards}><h2 className="text-sm font-bold">Customer support</h2>
   <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-600">Customer records belong to the issuing merchant. Octalve support needs a verified case, authorised scope and audit trail before viewing protected documents.</p>
   <div className="mt-4 rounded-xl bg-[#F5F9FF] p-4 text-xs text-[#376183]"><ShieldCheck className="mr-2 inline" size={16}/> Customer search is not enabled without a verified support purpose.</div></section>:null}
  {section==="subscriptions"?<section className={cards}><div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">Subscriptions & plans</h2><UnavailableAction label="Manage plans"/></div>
   <div className="mt-4 grid gap-3 sm:grid-cols-3">{[["Starter","Entry-level business tools"],["Growth","Higher usage and expanded workflows"],["Business","Advanced team and reporting needs"]].map(([title,note])=><div key={title} className="rounded-xl border border-[#EAF0F8] p-4"><CreditCard size={20} className="text-[#0064E0]"/><h3 className="mt-3 text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{note}</p><span className="mt-4 inline-block text-[11px] font-semibold text-[#7B8FA5]">Pricing not activated</span></div>)}</div>
   <p className="mt-3 text-xs text-slate-500">No merchant is billed and no entitlement is changed by these cards.</p></section>:null}
  {section==="verifications"?<section className={cards}><h2 className="font-bold">Business verification</h2><p className="mt-1 text-xs text-slate-500">Illustrative review requests</p>
   <div className="mt-4 space-y-2"><RecordRow primary="Business identity review" secondary="Bluehaven Ventures · Submitted documents pending" tag="Awaiting review"/>
    <RecordRow primary="Bank ownership review" secondary="Atlas Supply Co. · Independent verification needed" tag="Not verified"/></div>
   <p className="mt-4 text-xs leading-5 text-slate-500">Verification needs trusted evidence, authorised reviewer permissions and immutable audit events.</p></section>:null}
  {section==="support"?<section className={cards}><h2 className="mb-4 font-bold">Merchant support cases</h2><div className="space-y-2">{sampleCases.map(c=><RecordRow key={c.id} primary={c.title} secondary={c.merchant+" · "+c.id+" · "+c.priority} tag={c.state}/>)}</div>
   <p className="mt-4 text-xs text-slate-500">Opening or resolving cases requires verified staff access.</p></section>:null}
  {section==="notifications"?<section className={cards}><div className="flex items-center gap-2"><Bell size={20} className="text-[#0064E0]"/><h2 className="font-bold">Platform notifications</h2></div>
   <p className="mt-2 text-xs text-slate-600">Merchant alerts, service notices and delivery reporting.</p><div className="mt-5"><UnavailableAction label="Compose notification"/></div></section>:null}
  {section==="updates"?<section className={cards}><div className="flex items-center gap-2"><Megaphone size={20} className="text-[#0064E0]"/><h2 className="font-bold">Product updates</h2></div>
   <p className="mt-2 text-xs text-slate-600">Draft, approve and publish Octalve release announcements.</p><div className="mt-4 rounded-xl border border-[#EAF0F8] p-4"><BookOpen size={18} className="text-[#0064E0]"/><p className="mt-2 text-xs font-bold">Release approval</p><p className="mt-1 text-xs text-slate-500">Publishing stays disabled until staff approvals and delivery controls are ready.</p></div></section>:null}
  {section==="staff"?<section className={cards}><div className="flex flex-wrap justify-between gap-2"><h2 className="font-bold">Octalve staff</h2><UnavailableAction label="Invite staff"/></div>
   <div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Platform owner","Governance and release approvals"],["Support specialist","Case-scoped merchant assistance"],["Billing operations","Plan and subscription reviews"],["Compliance reviewer","Evidence and verification decisions"]].map(([role,note])=><div key={role} className="rounded-xl border border-[#EAF0F8] p-4"><UserCog size={20} className="text-[#0064E0]"/><h3 className="mt-3 text-sm font-bold">{role}</h3><p className="mt-1 text-xs text-slate-500">{note}</p></div>)}</div>
   <p className="mt-4 text-xs text-slate-500">Roles describe future permissions; no staff accounts are created here.</p></section>:null}
  {section==="security"?<section className={cards}><h2 className="font-bold">Security controls</h2>
   <div className="mt-4 grid gap-3 sm:grid-cols-2">{[["Strong sign-in","MFA required for authorised staff"],["No implicit access","Merchant and customer data deny-by-default"],["Case-bound support","Purpose, consent or other lawful basis, time limit and audit"],["Sensitive changes","Independent approval and tamper-evident history"]].map(([title,note])=><div className="rounded-xl bg-[#F7FAFE] p-4" key={title}><ShieldCheck size={18} className="text-[#0064E0]"/><p className="mt-2 text-sm font-bold">{title}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>)}</div></section>:null}
  {section==="audit"?<section className={cards}><div className="flex items-center gap-2"><FileClock size={20} className="text-[#0064E0]"/><h2 className="font-bold">Audit activity</h2></div>
   <p className="mt-3 text-xs leading-6 text-slate-600">Authenticated actor, purpose, merchant scope, approved action, outcome and timestamp must be stored by the server. UI demonstration actions do not constitute an audit trail.</p>
   <div className="mt-4 rounded-xl bg-[#F5F9FF] p-4 text-xs text-slate-500">No audited platform events are connected.</div></section>:null}
  <p className="text-[11px] leading-5 text-[#8395AA]">Operations interface sample. No staff identity, merchant records, billing changes or verification decisions are active.</p>
 </>;
}
