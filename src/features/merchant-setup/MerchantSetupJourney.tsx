"use client";
import {useState,type ChangeEvent} from "react";
import Image from "next/image";
import Link from "next/link";
import {ArrowLeft,ArrowRight,BadgeCheck,Building2,CheckCircle2,CreditCard,FileText,Landmark,LockKeyhole,Paintbrush,ShieldCheck,Upload,WalletCards,Settings2} from "lucide-react";
import {toast} from "sonner";
import {useMerchantPreview,type MerchantPreviewSettings} from "@/src/features/merchant-preview/MerchantPreviewProvider";

type Step="business"|"appearance"|"payments"|"services";
const steps:{key:Step,title:string,short:string,help:string}[]=[
 {key:"business",title:"Your business",short:"Business",help:"Identity, contact details and branding"},
 {key:"appearance",title:"Your invoices",short:"Invoices",help:"Template, currency and presentation"},
 {key:"payments",title:"Receive payments",short:"Payments",help:"Company account and collection connections"},
 {key:"services",title:"Workspace tools",short:"Tools",help:"Choose where you want to begin"}
];
const industries=["Agriculture","Construction & property","Consulting & professional services","Education","Energy","Financial & business services","Healthcare","Hospitality & food","Manufacturing","Media & creative","Retail & ecommerce","Technology","Transport & logistics","Other"] as const;
const states=["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"] as const;
const input="mt-1.5 h-11 w-full min-w-0 rounded-xl border border-[#D7E2EF] bg-white px-3 text-sm text-[#173652] outline-none transition focus:border-[#0064E0] focus:ring-2 focus:ring-[#0064E0]/10";
const label="block min-w-0 text-xs font-semibold text-[#314761]";
const panel="min-w-0 rounded-2xl border border-[#E0EAF5] bg-white p-4 shadow-sm sm:p-6";

function Field({title,value,onChange,placeholder,type="text",required=false}:{
 title:string;value:string;onChange:(value:string)=>void;placeholder?:string;type?:string;required?:boolean
}){
 return <label className={label}>{title}{required?<span className="text-[#D74B55]"> *</span>:null}
 <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} className={input}/></label>;
}
const next=(step:Step):Step=>({business:"appearance",appearance:"payments",payments:"services",services:"services"} as const)[step];
function checkedImage(file:File|undefined,onLoaded:(src:string)=>void){
 if(!file)return;
 if(!["image/png","image/jpeg","image/webp"].includes(file.type)||file.size>2*1024*1024){
  toast.error("Choose a PNG, JPG or WEBP image under 2 MB.");return;
 }
 const reader=new FileReader();
 reader.onloadend=()=>{if(typeof reader.result==="string")onLoaded(reader.result);};
 reader.onerror=()=>toast.error("We could not open that image. Please try again.");
 reader.readAsDataURL(file);
}

export function MerchantSetupJourney({initialStep="business"}:{initialStep?:Step}){
 const {settings,setSettings,logoPreview,setLogoPreview,signaturePreview,setSignaturePreview,invoiceAppearance,invoicePreferences}=useMerchantPreview();
 const [step,setStep]=useState<Step>(initialStep);
 const [moreAddress,setMoreAddress]=useState(Boolean(settings.city||settings.postalCode));
 const patch=<K extends keyof MerchantPreviewSettings>(key:K,value:MerchantPreviewSettings[K])=>
  setSettings(prev=>{
   const invalidate=["bankName","bankCode","accountNumber","businessName","legalName"].includes(key);
   return {...prev,[key]:value,...(invalidate?{verifiedAccountName:"",bankVerification:undefined}:{})};
  });
 const setUpload=(event:ChangeEvent<HTMLInputElement>,kind:"logo"|"signature")=>
  checkedImage(event.target.files?.[0],kind==="logo"?setLogoPreview:setSignaturePreview);
 const active=steps.findIndex(x=>x.key===step);
 const select=(s:Step)=>{setStep(s);};
 const hasProfile=Boolean(settings.businessName.trim()&&settings.businessAddress.trim()&&settings.businessPhone.trim());
 const bankFormat=/^[0-9]{10}$/.test(settings.accountNumber);
 return <main className="mx-auto w-full max-w-[1180px] min-w-0 space-y-5 pb-12">
  <header className="space-y-2">
   <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={15}/> Back to Settings</Link>
   <div className="flex flex-wrap items-start justify-between gap-4">
    <div><p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#0064E0]">Getting started</p>
     <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#16344F] sm:text-3xl">Set up your business workspace</h1>
     <p className="mt-1 text-sm text-slate-500">Your business identity, invoice preferences and collection options in one place. You can return to edit any section.</p></div>
    <span className="rounded-full border border-blue-100 bg-[#F0F7FF] px-4 py-2 text-xs font-medium text-[#0064E0]">Step {active+1} of {steps.length}</span>
   </div>
  </header>
  <nav aria-label="Business setup steps" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
   {steps.map((s,i)=><button key={s.key} type="button" onClick={()=>select(s.key)} aria-current={step===s.key?"step":undefined}
    className={"flex min-w-0 items-center gap-2 rounded-xl border px-3 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-[#0064E0] "+(step===s.key?"border-[#0064E0] bg-[#EEF5FF]":"border-[#E4EBF5] bg-white hover:bg-[#F8FBFF]")}>
    <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold "+(step===s.key?"bg-[#0064E0] text-white":"bg-[#F1F5FA] text-[#53677D]")}>{i+1}</span>
    <span className="min-w-0"><span className="block text-xs font-semibold text-[#183652]">{s.short}</span><span className="block truncate text-[10px] text-slate-500">{s.help.split(",")[0]}</span></span>
   </button>)}
  </nav>
  <div className="grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(245px,.78fr)]">
   <div className="min-w-0 space-y-5">
    {step==="business"?<>
     <section className={panel}>
      <header className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><Building2 size={20}/></span>
       <div><h2 className="font-bold text-[#173652]">Business identity</h2><p className="text-xs text-slate-500">Tell customers who they are dealing with.</p></div></header>
      <div className="mt-5 flex flex-col items-start gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center">
       <label className="group relative grid h-24 w-24 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed border-blue-200 bg-[#F8FBFF] text-[#0064E0]">
        {logoPreview?<Image src={logoPreview} unoptimized alt="Uploaded business logo" width={96} height={96} className="h-full w-full object-contain"/>:<Upload size={23}/>}
        <input type="file" accept="image/png,image/jpeg,image/webp" aria-label="Upload business logo" onChange={e=>setUpload(e,"logo")} className="sr-only"/>
       </label>
       <div className="space-y-1"><p className="text-sm font-semibold text-[#173652]">Business logo</p><p className="text-xs leading-5 text-slate-500">PNG, JPG or WEBP, up to 2 MB. It follows your business identity across new document previews.</p>
        {logoPreview?<button onClick={()=>setLogoPreview(null)} className="text-xs font-semibold text-[#0064E0]">Remove logo</button>:null}</div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
       <div className="sm:col-span-2"><Field required title="Business or trading name" value={settings.businessName} onChange={v=>patch("businessName",v)} placeholder="Name customers know"/></div>
       <div className="sm:col-span-2"><Field title="Registered legal name (if different)" value={settings.legalName||""} onChange={v=>patch("legalName",v)} placeholder="As registered with CAC"/></div>
       <label className={label}>Industry
        <select aria-label="Industry" value={settings.industry||""} onChange={e=>patch("industry",e.target.value)} className={input}>
         <option value="">Choose industry</option>{industries.map(v=><option key={v} value={v}>{v}</option>)}
        </select>
       </label>
       <Field title="RC / business registration number" value={settings.rcNumber} onChange={v=>patch("rcNumber",v)} placeholder="If registered"/>
       <Field title="Tax ID (if applicable)" value={settings.taxId} onChange={v=>patch("taxId",v)} placeholder="Separate from RC number"/>
       <Field title="Business phone number" required type="tel" value={settings.businessPhone} onChange={v=>patch("businessPhone",v)} placeholder="+234 ..."/>
       <Field title="Business email" type="email" value={settings.email} onChange={v=>patch("email",v)} placeholder="accounts@company.com"/>
       <Field title="Business website (optional)" type="url" value={settings.website} onChange={v=>patch("website",v)} placeholder="https://company.com"/>
      </div>
     </section>
     <section className={panel}>
      <h2 className="font-bold text-[#173652]">Business location</h2><p className="mt-1 text-xs text-slate-500">Use your registered or operating address. The address can appear on invoices and receipts.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
       <label className={label}>Country
        <select aria-label="Business country" value={settings.country||"Nigeria"} onChange={e=>patch("country",e.target.value)} className={input}><option value="Nigeria">Nigeria</option><option value="Other">Other country (details to be completed)</option></select>
       </label>
       <label className={label}>State / FCT
        <select aria-label="Business state" value={settings.state||""} onChange={e=>patch("state",e.target.value)} className={input}>
         <option value="">Choose state</option>{states.map(v=><option key={v} value={v}>{v}</option>)}
        </select>
       </label>
       <div className="sm:col-span-2"><Field required title="Business address" value={settings.businessAddress} onChange={v=>patch("businessAddress",v)} placeholder="Street, building and area"/></div>
       <button type="button" className="text-left text-xs font-semibold text-[#0064E0] sm:col-span-2" aria-expanded={moreAddress} onClick={()=>setMoreAddress(v=>!v)}>{moreAddress?"− Hide extra address details":"+ Add city and postal code"}</button>
       {moreAddress?<><Field title="City" value={settings.city||""} onChange={v=>patch("city",v)}/><Field title="Postal code" value={settings.postalCode||""} onChange={v=>patch("postalCode",v)}/></>:null}
      </div>
     </section>
     <section className={panel}>
      <h2 className="font-bold text-[#173652]">Workspace preferences</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
       <label className={label}>Language<select className={input} value={settings.language||"en"} onChange={e=>patch("language",e.target.value as "en")}><option value="en">English</option></select></label>
       <label className={label}>Time zone<select className={input} value={settings.timeZone||"Africa/Lagos"} onChange={e=>patch("timeZone",e.target.value)}><option value="Africa/Lagos">West Africa Time (Africa/Lagos)</option></select></label>
       <label className={label+" sm:col-span-2"}>How do you currently manage invoicing?
        <select className={input} value={settings.invoicingMethod||""} onChange={e=>patch("invoicingMethod",e.target.value)}>
         <option value="">Select (optional)</option><option value="manual">Paper or manual documents</option><option value="spreadsheet">Spreadsheets</option><option value="other">Another invoicing tool</option><option value="new">Just getting started</option>
        </select></label>
       <label className={label+" sm:col-span-2"}>About your business (optional)
        <textarea rows={3} value={settings.businessDescription} onChange={e=>patch("businessDescription",e.target.value)} className={input+" h-auto resize-y py-3"} placeholder="What does your business offer?"/></label>
      </div>
      <div className="mt-5 border-t border-slate-100 pt-5">
       <p className="text-xs font-semibold text-[#314761]">Authorized signature (optional)</p>
       <label className="mt-2 flex min-h-24 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-blue-200 bg-[#F8FBFF] p-3">
        {signaturePreview?<Image src={signaturePreview} unoptimized width={112} height={64} alt="Uploaded signature" className="max-h-16 w-auto object-contain"/>:<Upload className="text-[#0064E0]" size={21}/>}
        <span className="text-xs text-slate-600">Upload signature image (PNG/JPG/WEBP, up to 2 MB). This will not be treated as a digital certificate or an NRS signature.</span>
        <input type="file" accept="image/png,image/jpeg,image/webp" aria-label="Upload authorized signature" onChange={e=>setUpload(e,"signature")} className="sr-only"/>
       </label>
       {signaturePreview?<button type="button" onClick={()=>setSignaturePreview(null)} className="mt-2 text-xs font-semibold text-[#0064E0]">Remove signature</button>:null}
      </div>
     </section>
    </>:null}
    {step==="appearance"?<section className={panel}>
     <div className="flex items-center gap-3"><Paintbrush className="text-[#0064E0]"/><h2 className="text-lg font-bold text-[#173652]">How do you want your invoices to look?</h2></div>
     <p className="mt-2 text-sm text-slate-600">Choose a template and tailor the colours, layout and logo using your business details. There is only one place to customize invoices.</p>
     <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-blue-100 bg-[#F3F8FF] p-4"><p className="font-semibold text-[#173652]">{invoiceAppearance.template==="modern"?"Octalve Modern":"Classic Ledger"}</p><p className="mt-1 text-xs text-slate-500">Current template choice</p></div>
      <div className="rounded-xl border border-slate-100 p-4"><p className="font-semibold text-[#173652]">{invoicePreferences.currency}</p><p className="mt-1 text-xs text-slate-500">Default invoice currency</p></div>
     </div>
     <Link href="/dashboard/settings/invoice" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0064E0] px-5 text-sm font-semibold text-white">Customize invoice templates <ArrowRight size={16}/></Link>
     <p className="mt-4 text-xs text-slate-500">Changes are shared with invoice creation. Draft invoices remain marked DRAFT — NOT ISSUED.</p>
    </section>:null}
    {step==="payments"?<>
     <section className={panel}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-[#173652]"><Landmark className="text-[#0064E0]"/> How do you want to receive payments?</h2>
      <p className="mt-2 text-sm text-slate-600">Add your company account for ordinary bank transfers, or connect an authorized online collection service when available.</p>
      <div className="mt-5 space-y-3">
       <div className="rounded-xl border-2 border-[#0064E0] bg-[#F3F8FF] p-4">
        <div className="flex items-center gap-3"><CreditCard size={19} className="text-[#0064E0]"/><p className="text-sm font-semibold text-[#173652]">Company bank transfer</p><span className="ml-auto rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-800">Manual review</span></div>
        <p className="mt-2 text-xs leading-5 text-slate-600">Customers pay your business account directly. You may later record an eligible bank-transfer payment with supporting evidence and appropriate approval.</p>
       </div>
       <div className="grid gap-3 sm:grid-cols-2">
        <Field title="Bank name" value={settings.bankName} onChange={v=>patch("bankName",v)} placeholder="Enter your bank name for now"/>
        <Field title="Account number" value={settings.accountNumber} onChange={v=>patch("accountNumber",v.replace(/[^0-9]/g,"").slice(0,10))} placeholder="10-digit NUBAN"/>
       </div>
       {settings.accountNumber&&!bankFormat?<p role="alert" className="text-xs text-amber-700">Enter exactly 10 digits to check your account details.</p>:null}
       <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3" role="status">
        <p className="text-xs font-semibold text-amber-900">Account not verified</p>
        <p className="mt-1 text-xs leading-5 text-amber-800">Bank-account name enquiry is not connected yet. The complete searchable Nigerian bank directory and verified account-holder name will appear here once secure verification is enabled. Account instructions will not appear on issued documents before verification.</p>
       </div>
       <p className="text-xs text-slate-500">Do not enter your ATM PIN, OTP or banking password. A bank and 10-digit number alone do not confirm account ownership.</p>
      </div>
     </section>
     <section className={panel}>
      <h2 className="flex items-center gap-2 text-lg font-bold text-[#173652]"><WalletCards className="text-[#0064E0]"/> Online payment connections</h2>
      <p className="mt-2 text-sm text-slate-600">Payment links and invoice-specific collection accounts will belong to the provider you choose. You will be able to reconcile confirmed collections with individual invoices.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
       {[
        ["Monnify","Payment links and virtual accounts"],
        ["Paystack","Online checkout and transfer collections"],
        ["Flutterwave","Online checkout and links"],
        ["Octalve Finance","Future integrated Octalve account"]
       ].map(([name,desc])=><div key={name} className="rounded-xl border border-[#E3ECF5] bg-[#FCFDFF] p-4">
        <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-[#173652]">{name}</p><LockKeyhole size={15} className="text-slate-400"/></div>
        <p className="mt-1 text-xs text-slate-500">{desc}</p><p className="mt-3 text-[11px] font-semibold text-slate-500">Not connected</p>
       </div>)}
      </div>
      <p className="mt-4 text-xs text-slate-500">Connections must be authorized for the specific business. Octalve Finance is a future option, not an active banking service.</p>
     </section>
    </>:null}
    {step==="services"?<section className={panel}>
     <div className="flex items-center gap-3"><Settings2 className="text-[#0064E0]"/><h2 className="text-lg font-bold text-[#173652]">Your business tools</h2></div>
     <p className="mt-2 text-sm text-slate-600">Your core workspace remains available. Open the tools you need now; you can return to change your business details and preferences later.</p>
     <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {([
       ["Invoices","/dashboard/invoice","Create and manage invoices",FileText],
       ["Quotations","/dashboard/quotation","Prepare estimates",FileText],
       ["Customers","/dashboard/customer","Keep billing contacts together",Building2],
       ["Expenses","/dashboard/expenses","Organize business spending",WalletCards],
       ["Recurring schedules","/dashboard/recurring-expense","Review repeating plans",CreditCard],
       ["Tax & NRS","/dashboard/tax-centre","Prepare fiscal information",ShieldCheck]
      ] as const).map(([name,href,desc,Icon])=><Link key={String(name)} href={String(href)} className="flex gap-3 rounded-xl border border-[#E3ECF5] p-4 hover:border-[#0064E0] hover:bg-[#F8FBFF]">
       <Icon size={20} className="shrink-0 text-[#0064E0]"/><span><span className="block text-sm font-semibold text-[#173652]">{String(name)}</span><span className="mt-1 block text-xs text-slate-500">{String(desc)}</span></span>
      </Link>)}
     </div>
    </section>:null}
    <div className="flex flex-wrap items-center justify-between gap-3">
     <button type="button" onClick={()=>select(steps[Math.max(active-1,0)].key)} disabled={active===0} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#C9D8EB] px-4 text-xs font-semibold text-[#193955] disabled:opacity-40"><ArrowLeft size={15}/> Previous</button>
     {step!=="services"?<button type="button" onClick={()=>select(next(step))} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0064E0] px-5 text-sm font-semibold text-white">Continue <ArrowRight size={16}/></button>:
      <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0064E0] px-5 text-sm font-semibold text-white">Go to overview <ArrowRight size={16}/></Link>}
    </div>
    <p className="text-xs text-slate-500">Your edits remain available while this preview session is open. Account saving and formal verification are introduced only when the secure service is enabled.</p>
   </div>
   <aside className="space-y-4 lg:sticky lg:top-24">
    <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-[#F5FAFF] to-white p-5">
     <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0064E0]">Your setup summary</p>
     <p className="mt-2 break-words text-lg font-bold text-[#183652]">{settings.businessName||"Your business"}</p>
     <div className="mt-4 space-y-3">
      <div className="flex gap-3 text-xs text-[#314761]">{hasProfile?<CheckCircle2 size={17} className="shrink-0 text-[#0F9A72]"/>:<BadgeCheck size={17} className="shrink-0 text-slate-400"/>}<span>Business details {hasProfile?"provided":"need completing"}</span></div>
      <div className="flex gap-3 text-xs text-[#314761]">{logoPreview?<CheckCircle2 size={17} className="shrink-0 text-[#0F9A72]"/>:<Upload size={17} className="shrink-0 text-slate-400"/>}<span>Business logo {logoPreview?"added":"optional"}</span></div>
      <div className="flex gap-3 text-xs text-[#314761]"><Paintbrush size={17} className="shrink-0 text-[#0064E0]"/><span>Invoice style: {invoiceAppearance.template==="modern"?"Octalve Modern":"Classic Ledger"}</span></div>
      <div className="flex gap-3 text-xs text-[#314761]"><LockKeyhole size={17} className="shrink-0 text-amber-600"/><span>Bank account: unverified</span></div>
      <div className="flex gap-3 text-xs text-[#314761]"><LockKeyhole size={17} className="shrink-0 text-slate-500"/><span>Online payments: not connected</span></div>
     </div>
    </section>
    <section className="rounded-2xl border border-[#E0EAF5] bg-white p-5">
     <h3 className="flex items-center gap-2 text-sm font-semibold text-[#183652]"><ShieldCheck size={17} className="text-[#0064E0]"/> Before your first invoice</h3>
     <p className="mt-2 text-xs leading-5 text-slate-600">Review the correct business identity and payment details. Invoice drafts are not issued documents, and bank accounts or payment providers must be verified before real payment instructions are used.</p>
     {step==="payments"?<p className="mt-3 text-xs leading-5 text-slate-600">A dynamic collection account is not automatically your company&apos;s permanent settlement account. Reconciliation links the provider&apos;s verified payment reference to the invoice.</p>:null}
    </section>
   </aside>
  </div>
 </main>;
}
