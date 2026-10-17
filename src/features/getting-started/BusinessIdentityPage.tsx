"use client";
import {useState,type ChangeEvent} from "react";
import Link from "next/link";
import Image from "next/image";
import {ArrowLeft,Building2,Upload,ShieldCheck} from "lucide-react";
import {toast} from "sonner";
import {useMerchantPreview,type MerchantPreviewSettings} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const industries=["Agriculture","Construction & property","Consulting & professional services","Education","Energy","Financial & business services","Healthcare","Hospitality & food","Manufacturing","Media & creative","Retail & ecommerce","Technology","Transport & logistics","Other"] as const;
const states=["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"] as const;

const input="mt-1.5 h-11 w-full min-w-0 rounded-xl border border-[#D7E2EF] bg-white px-3 text-sm text-[#173652] outline-none focus:border-[#0064E0] focus:ring-2 focus:ring-[#0064E0]/10";
const label="block min-w-0 text-xs font-semibold text-[#314761]";
const panel="min-w-0 rounded-[22px] border border-[#E1EAF5] bg-white p-4 shadow-[0_14px_38px_rgba(23,54,89,.09)] sm:p-6";
function Field({title,value,onChange,placeholder,type="text",required=false}:{
 title:string;value:string;onChange:(value:string)=>void;placeholder?:string;type?:string;required?:boolean
}){
 return <label className={label}>{title}{required?<span className="text-[#D74B55]"> *</span>:null}
 <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} className={input}/></label>;
}
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


export function BusinessIdentityPage(){
 const {settings,setSettings,logoPreview,setLogoPreview,signaturePreview,setSignaturePreview}=useMerchantPreview();
 const [moreAddress,setMoreAddress]=useState(Boolean(settings.city||settings.postalCode));
 const patch=<K extends keyof MerchantPreviewSettings>(key:K,value:MerchantPreviewSettings[K])=>
  setSettings(prev=>({...prev,[key]:value,...(["bankName","bankCode","accountNumber","businessName","legalName"].includes(key)?{verifiedAccountName:"",bankVerification:undefined}:{})}));
 const setUpload=(event:ChangeEvent<HTMLInputElement>,kind:"logo"|"signature")=>
  checkedImage(event.target.files?.[0],kind==="logo"?setLogoPreview:setSignaturePreview);
 return <main className="mx-auto w-full max-w-[820px] min-w-0 space-y-4 pb-10">
  <header className="space-y-2">
   <Link href="/dashboard/getting-started" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeft size={16}/> Back to Getting Started</Link>
   <h1 className="text-xl font-bold text-[#173652] sm:text-2xl">Business Identity</h1>
   <p className="text-xs text-slate-500">One business profile across your financial documents.</p>
  </header>
  <section className={panel}>
      <header className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><Building2 size={20}/></span>
       <div><h2 className="font-bold text-[#173652]">Business identity</h2><p className="text-xs text-slate-500">Your business identity.</p></div></header>
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
      <h2 className="font-bold text-[#173652]">Business location</h2><p className="mt-1 text-xs text-slate-500">Location shown on documents.</p>
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
  <div className="flex flex-wrap items-center justify-between gap-3">
   <p className="flex items-center gap-2 text-[11px] text-slate-500"><ShieldCheck size={15}/> Changes stay in your current session.</p>
   <Link href="/dashboard/getting-started" className="inline-flex min-h-11 items-center rounded-full bg-[#0064E0] px-5 text-sm font-semibold text-white">Back to checklist</Link>
  </div>
 </main>;
}
