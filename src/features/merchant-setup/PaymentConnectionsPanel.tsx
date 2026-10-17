"use client";
import {useState} from "react";
import {Check,ChevronDown,ChevronUp,Landmark,LockKeyhole,ShieldCheck,WalletCards} from "lucide-react";
import {useMerchantPreview,type PreviewCollectionSetup} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {SetupInfoNote} from "./SetupInfoNote";
import {dynamicAccountCapabilities,gatewayCapabilities,partnerBankAvailability} from "./payment-capabilities";

const shell="min-w-0 rounded-[22px] border border-[#E1EAF5] bg-white p-4 shadow-[0_14px_38px_rgba(23,54,89,.09)] sm:p-6";
const option="flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border border-[#DFEAF6] bg-[#FCFDFF] p-3.5 transition hover:border-[#94BDF5] has-[:checked]:border-[#0064E0] has-[:checked]:bg-[#F2F7FF] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#0064E0]";

/** A visual capability chooser only; not a connected-provider configuration form. */
export function PaymentConnectionsPanel(){
 const {collectionSetup,setCollectionSetup}=useMerchantPreview();
 const [requirements,setRequirements]=useState(false);
 const choose=<K extends keyof PreviewCollectionSetup>(key:K,value:PreviewCollectionSetup[K])=>
  setCollectionSetup(current=>({...current,[key]:value}));
 const dynamic=dynamicAccountCapabilities.find(p=>p.id===collectionSetup.dynamicProvider)!;
 const gateway=gatewayCapabilities.find(p=>p.id===collectionSetup.gatewayProvider)!;
 return <div className="min-w-0 space-y-5">
  <section className={shell} aria-labelledby="dynamic-collection-title">
   <header className="flex flex-wrap items-center gap-2">
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><Landmark size={20}/></span>
    <div className="min-w-0 flex-1"><h2 id="dynamic-collection-title" className="text-lg font-bold text-[#173652]">Dynamic Account</h2><p className="text-xs text-slate-500">Invoice-specific bank transfer, tracked by a connected provider.</p></div>
    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-800">Not connected</span>
    <SetupInfoNote title="Dynamic Account" detail="Formerly shown as Flex Account in the design reference. The provider must generate real account, bank, beneficiary and expiry details for each eligible invoice or milestone. No accounts can be created in this Preview."/>
   </header>
   <fieldset className="mt-4">
    <legend className="mb-2 text-xs font-semibold text-[#314761]">Explore a provider</legend>
    <div className="grid min-w-0 gap-2">
     {dynamicAccountCapabilities.map(p=><label key={p.id} className={option}>
      <input type="radio" name="dynamic-account-provider" aria-label={p.name} checked={collectionSetup.dynamicProvider===p.id}
       onChange={()=>{choose("dynamicProvider",p.id);choose("channel","dynamic-account");}}
       className="mt-1 h-4 w-4 shrink-0 accent-[#0064E0]"/>
      <span className="min-w-0 flex-1">
       <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1"><span className="text-sm font-semibold text-[#173652]">{p.name}</span><span className="text-[11px] font-semibold text-[#0064E0]">{p.duration}</span></span>
       <span className="mt-1 block text-[11px] leading-5 text-slate-500">{p.detail}</span>
      </span>
     </label>)}
    </div>
   </fieldset>
   <div role="status" aria-live="polite" className="mt-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-[#F4F8FF] px-3 py-2.5 text-xs leading-5 text-[#315477]">
    <LockKeyhole size={16} className="mt-0.5 shrink-0 text-[#0064E0]"/><span><strong>{dynamic.name} — reference only.</strong> Provider eligibility and exact maximum expiry are unverified. Invoice or instalment due time must not be later than the provider-confirmed account expiry. The operative date selector belongs to Batch Q.</span>
   </div>
   <p className="mt-3 text-[11px] leading-5 text-slate-500">Paystack Pay with Transfer: 15 minutes–8 hours. It is not offered as a long-duration dynamic PDF account; Paystack checkout remains an option below.</p>
   <button type="button" aria-expanded={requirements} aria-controls="connection-requirements"
    onClick={()=>setRequirements(v=>!v)}
    className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#C9DCF5] px-3 text-xs font-semibold text-[#0064E0] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
    {requirements?<ChevronUp size={15}/>:<ChevronDown size={15}/>} {requirements?"Hide connection requirements":"View connection requirements"}
   </button>
   {requirements?<div id="connection-requirements" role="region" aria-label="Future connection requirements" className="mt-3 rounded-xl border border-[#E2EAF5] bg-[#FAFCFF] p-4">
     <p className="text-xs font-semibold text-[#173652]">Secure connection — not available in Preview</p>
     <p className="mt-1 text-xs leading-5 text-slate-500">A verified business account, required provider permissions, merchant identifier, and server-protected API credentials will be required. Do not paste keys, passwords or OTPs here.</p>
     <fieldset disabled className="mt-3 grid gap-3 sm:grid-cols-2" aria-label="Unavailable credential entry preview">
      <label className="text-xs font-semibold text-[#314761]">Merchant identifier
       <input type="text" placeholder="Requires secure connection" className="mt-1.5 h-10 w-full min-w-0 rounded-xl bg-[#EDF3F9] px-3 text-xs" autoComplete="off"/></label>
      <label className="text-xs font-semibold text-[#314761]">Provider secret key
       <input type="password" placeholder="Server-only credential" className="mt-1.5 h-10 w-full min-w-0 rounded-xl bg-[#EDF3F9] px-3 text-xs" autoComplete="off"/></label>
     </fieldset>
     <p className="mt-3 flex items-start gap-2 text-xs text-amber-800"><ShieldCheck size={16} className="shrink-0"/> Never store provider secrets in this browser demonstration.</p>
   </div>:null}
  </section>
  <section className={shell} aria-labelledby="gateway-collection-title">
   <header className="flex items-center gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><WalletCards size={20}/></span>
    <div className="min-w-0 flex-1"><h2 id="gateway-collection-title" className="text-lg font-bold text-[#173652]">Online payment connections</h2><p className="text-xs text-slate-500">Gateway checkout and secure payment links.</p></div>
    <SetupInfoNote title="Gateway collections" detail="Checkout links are different from invoice-specific dynamic bank accounts. No merchant provider is connected and no webhook payments are verified in this preview."/>
   </header>
   <fieldset className="mt-4">
    <legend className="mb-2 text-xs font-semibold text-[#314761]">Explore an online payment gateway</legend>
    <div className="grid gap-2 sm:grid-cols-2">
     {gatewayCapabilities.map(p=><label key={p.id} className={option}>
      <input type="radio" name="online-gateway-provider" aria-label={p.name+" gateway"} checked={collectionSetup.gatewayProvider===p.id}
       onChange={()=>{choose("gatewayProvider",p.id);choose("channel","gateway");}}
       className="mt-1 h-4 w-4 shrink-0 accent-[#0064E0]"/>
      <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2 text-sm font-semibold text-[#173652]">{p.name}<LockKeyhole size={14} className="shrink-0 text-slate-400"/></span>
       <span className="mt-1 block text-[11px] leading-5 text-slate-500">{p.detail}</span>
       <span className="mt-2 block text-[11px] font-semibold text-amber-800">Not connected</span></span>
     </label>)}
    </div>
   </fieldset>
   <p className="mt-3 text-xs text-slate-500" role="status">Selected for exploration: {gateway.name}. This choice is saved only in the current preview session; it does not enable a payment method.</p>
  </section>
  <section className={shell} aria-labelledby="partner-bank-title">
   <div className="flex items-start gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><Landmark size={20}/></span>
    <div className="min-w-0 flex-1"><h2 id="partner-bank-title" className="text-sm font-bold text-[#173652]">Partner Bank Collection <span className="ml-1 rounded-full bg-slate-100 px-2 py-1 text-[10px] text-slate-600">Coming soon</span></h2>
     <p className="mt-1 text-xs leading-5 text-slate-500">{partnerBankAvailability}</p>
     <p className="mt-2 text-[11px] text-slate-500">A future bank-backed virtual collection account is not necessarily a separate corporate settlement account.</p>
    </div>
   </div>
  </section>
  <div role="status" aria-live="polite" className="flex items-center gap-2 text-[11px] text-slate-500"><Check size={15} className="text-[#0064E0]"/> Preview choice: {collectionSetup.channel==="dynamic-account"?"Dynamic Account":collectionSetup.channel==="gateway"?"Online Payment Gateway":"Company Bank Transfer"}. No financial connection or money movement is active.</div>
 </div>;
}
