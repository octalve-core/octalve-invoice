"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft,ChevronRight,Eye,EyeOff,LockKeyhole,ShieldAlert} from "lucide-react";
import {NigerianBankPicker} from "@/src/features/merchant-setup/NigerianBankPicker";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {CONNECTION_FIELDS,PAYMENT_METHODS,PAYMENT_ROUTE,PAYMENT_FAQ,type PaymentMethodId} from "./payment-catalog";
const input="mt-1.5 h-11 w-full min-w-0 rounded-xl border border-[#DCE7F2] bg-[#F8FAFC] px-3 text-sm text-[#183652]";
function Notice(){return <div role="status" className="rounded-xl border border-amber-200 bg-[#FFFAEE] px-4 py-3 text-xs text-amber-900"><div className="flex items-center gap-2 font-semibold"><ShieldAlert size={16}/> Not connected</div><p className="mt-1">Secure backend verification is not enabled in Preview. Do not enter real keys, OTPs or banking passwords.</p></div>;}
function BankDetails(){
 const {settings,setSettings}=useMerchantPreview();
 const changeBank=(v:string)=>setSettings(s=>({...s,bankName:v,bankCode:"",bankVerification:undefined,verifiedAccountName:""}));
 const changeNumber=(v:string)=>setSettings(s=>({...s,accountNumber:v.replace(/\D/g,"").slice(0,10),bankVerification:undefined,verifiedAccountName:""}));
 return <div className="space-y-4 rounded-2xl bg-white p-4 sm:p-6">
  <h2 className="text-sm font-bold text-[#173652]">Account Details</h2>
  <p className="text-xs text-slate-500">To be displayed on eligible unpaid invoices after verification.</p>
  <NigerianBankPicker value={settings.bankName} onChange={changeBank}/>
  <label className="block text-xs font-semibold text-[#314761]">Bank Account Number
   <input aria-label="Bank account number" inputMode="numeric" autoComplete="off" value={settings.accountNumber}
    maxLength={10} onChange={e=>changeNumber(e.target.value)} placeholder="10-digit NUBAN" className={input}/></label>
  {settings.accountNumber&&settings.accountNumber.length!==10?<p role="alert" className="text-xs text-amber-800">Enter a valid 10-digit account number.</p>:null}
  <Notice/>
  <button type="button" disabled className="min-h-11 w-full rounded-full bg-[#E0EAF6] text-sm font-semibold text-[#657D98]">Verify account — secure service required</button>
  <button type="button" disabled className="min-h-11 w-full rounded-full bg-[#DFEAF7] text-sm font-semibold text-[#657D98]">Add Account</button>
  <p className="text-[11px] text-slate-500">After authenticated bank-name enquiry and ownership approval, Add Account will become available. Entering a number is not verification.</p>
 </div>;
}
function Example({label,example,secret,optional}:{label:string;example:string;secret:boolean;optional?:boolean}){
 const [visible,setVisible]=useState(false);
 return <div>
  <div className="flex items-center justify-between gap-2"><label className="text-xs font-semibold text-[#536B82]">{label}{optional?" (optional)":""}</label>
   {secret?<button type="button" className="flex min-h-9 items-center gap-1 text-[11px] font-semibold text-[#0064E0]" onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={15}/>:<Eye size={15}/>} {visible?"Hide example":"Show example"}</button>:null}
  </div>
  <input disabled readOnly aria-label={label} type={secret&&!visible?"password":"text"}
   value={secret&&!visible?"••••••••":example} autoComplete="off" spellCheck={false} className={input+" cursor-not-allowed opacity-80"}/>
 </div>;
}
function ProviderDetails({id}:{id:Exclude<PaymentMethodId,"bank-transfer"|"dynamic-account">}){
 const [env,setEnv]=useState<"test"|"live">("test");
 const item=PAYMENT_METHODS.find(m=>m.id===id)!;
 return <div className="space-y-4 rounded-2xl bg-white p-4 sm:p-6">
  <div className="rounded-xl bg-[#E8F6E9] p-4"><h2 className="text-lg font-bold text-[#173652]">{item.title}</h2><p className="mt-1 text-xs text-[#425D72]">{item.brief}</p></div>
  <fieldset><legend className="mb-2 text-xs font-semibold text-[#314761]">Environment</legend>
   <div className="inline-flex gap-1 rounded-xl bg-[#F0F4FA] p-1">{(["test","live"] as const).map(v=><button type="button" key={v} aria-pressed={env===v} onClick={()=>setEnv(v)}
    className={"min-h-9 rounded-lg px-4 text-xs font-semibold "+(env===v?"bg-white text-[#0064E0] shadow-sm":"text-slate-600")}>{v==="test"?"Test mode":"Live"}</button>)}</div>
  </fieldset>
  <div className="space-y-4" role="group" aria-label="Example credential fields">{CONNECTION_FIELDS[id].map(f=><Example key={f.label} {...f}/>)}</div>
  <Notice/>
  <div className="space-y-2 border-t border-[#E3EBF5] pt-4"><h3 className="text-xs font-bold text-[#173652]">Webhook / Callback URL</h3>
   <p className="text-xs text-slate-500">Octalve will generate the provider-specific HTTPS endpoint after a secure authenticated connection. No callback URL is active yet.</p>
   <div className="rounded-xl bg-[#F5F7FA] px-3 py-3 text-xs text-slate-500">Awaiting secure webhook assignment</div>
   <p className="text-[11px] text-slate-500">Add the issued callback URL to your provider dashboard. Octalve must validate signatures, reference, amount, currency and merchant ownership before recognising payment.</p>
  </div>
  <button type="button" disabled className="min-h-11 w-full rounded-full bg-[#DCE8F8] text-sm font-semibold text-[#627994]">Save & Verify Connection</button>
  <p className="text-center text-[11px] text-slate-500">Connection status will be determined by server validation, never by selecting a card.</p>
 </div>;
}
function DynamicDetails(){return <div className="space-y-3 rounded-2xl bg-white p-4 sm:p-6">
 <div className="rounded-xl bg-[#E8F6E9] p-4"><h2 className="text-sm font-bold text-[#173652]">Invoice-specific Virtual Account</h2><p className="mt-1 text-xs text-slate-500">Activate it through an eligible connected provider.</p></div>
 <p className="text-xs leading-5 text-slate-600">Dynamic Account is a collection capability, not a separate secret-key account. A provider must approve and supply the invoice-specific account and actual expiry.</p>
 {([{id:"monnify",name:"Monnify Dynamic Invoice",note:"Unique invoice account; requested expiry subject to provider."},{id:"flutterwave",name:"Flutterwave virtual account",note:"v3/v4 capabilities and expiry depend on merchant eligibility."}] as const).map(m=><Link key={m.id} href={PAYMENT_ROUTE+"/"+m.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#E2EAF3] p-3 hover:border-[#0064E0]">
  <span className="min-w-0"><strong className="block text-sm text-[#173652]">{m.name}</strong><span className="text-[11px] text-slate-500">{m.note}</span></span><ChevronRight size={17} className="shrink-0 text-[#0064E0]"/></Link>)}
 <Notice/>
 </div>;}
export function PaymentSetupDetail({method}:{method:PaymentMethodId}){
 const item=PAYMENT_METHODS.find(m=>m.id===method)!;
 return <main className="mx-auto w-full max-w-[650px] min-w-0 space-y-4 pb-8">
  <header className="flex items-center gap-3"><Link href={PAYMENT_ROUTE} aria-label="Back to payment methods" className="grid h-10 w-10 place-items-center rounded-full border border-[#D6E2EF] bg-white"><ArrowLeft size={18}/></Link>
   <div className="min-w-0 flex-1"><p className="text-[11px] font-semibold text-[#0064E0]">PAYMENT SETUP</p><h1 className="text-lg font-bold text-[#173652]">{item.title}</h1></div>
   <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] text-amber-800">Not connected</span></header>
  {method==="bank-transfer"?<BankDetails/>:method==="dynamic-account"?<DynamicDetails/>:<ProviderDetails key={method} id={method}/>}
  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#0064E0]">
   <Link href={PAYMENT_ROUTE}>← All payment methods</Link><Link href={PAYMENT_FAQ}>Learn setup</Link>
  </div>
  <p className="flex items-center gap-1.5 text-[11px] text-slate-500"><LockKeyhole size={14}/> No provider secret keys are stored in browser state.</p>
 </main>;
}
