"use client";
import {useMemo,useState} from "react";
import {CalendarDays,ChevronDown,Plus,Search,X,Users,UserRound,Wallet} from "lucide-react";
import Link from "next/link";
import type {InvoiceDraft} from "@/src/features/invoice/types";
import {useMerchantPreview,type CatalogCustomer,type CatalogStaff,type PaymentMode} from "@/src/features/merchant-preview/MerchantPreviewProvider";
type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>};
type Picker="customer"|"staff"|"payment"|null;
const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
function Field({label,value,onChange,placeholder="",disabled=false}:{label:string;value:string;placeholder?:string;disabled?:boolean;onChange:(x:string)=>void}){
 return <label className="flex min-w-0 flex-col gap-1.5 text-xs text-[#22334B]"><span className="font-medium">{label}</span>
  <input value={value} disabled={disabled} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
    className="h-10 w-full min-w-0 rounded-xl border border-gray-100 bg-gray-50 px-3 text-sm text-[#172f4d] outline-none focus:border-[#0064E0] disabled:cursor-not-allowed disabled:opacity-70"/></label>;
}
function iso(day:string,month:string,year:string){const n=months.indexOf(month.toUpperCase());return /^\d{4}$/.test(year)&&n>=0&&Number(day)>=1?`${year}-${String(n+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`:"";}
function NativeDate({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){
 return <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-[#22334B]"><span>{label}</span>
  <span className="relative flex items-center rounded-xl border border-gray-100 bg-gray-50 px-3 focus-within:border-[#0064E0]">
   <input aria-label={label} required type="date" value={value} onChange={e=>onChange(e.target.value)}
    className="h-10 min-w-0 w-full bg-transparent text-sm text-[#172f4d] outline-none [color-scheme:light]"/>
   <CalendarDays size={16} className="pointer-events-none hidden shrink-0 text-[#0064E0] sm:block"/>
  </span></label>;
}
export function InvoiceMetadataSection({draft,setDraft}:Props){
 const {customers,setCustomers,staff,setStaff,paymentMode,setPaymentMode}=useMerchantPreview();
 const [picker,setPicker]=useState<Picker>(null),[query,setQuery]=useState(""),[adding,setAdding]=useState(false);
 const [customer,setCustomer]=useState({name:"",email:"",phone:"",address:"",company:"",customerType:"individual" as "individual"|"business",taxId:"",country:"",city:"",state:""});
 const [person,setPerson]=useState({name:"",email:"",phone:"",role:"Salesperson"});
 const [selectedStaff,setSelectedStaff]=useState("");
 const update=<K extends keyof InvoiceDraft>(key:K,value:InvoiceDraft[K])=>setDraft(prev=>({...prev,[key]:value}));
 const issued=iso(draft.day,draft.month,draft.year),due=iso(draft.dueDay,draft.dueMonth,draft.dueYear);
 function changeDate(value:string,prefix:"issue"|"due"){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return;
  const [y,m,d]=value.split("-");
  if(prefix==="issue")setDraft(p=>({...p,day:String(Number(d)),month:months[Number(m)-1]||"JAN",year:y}));
  else setDraft(p=>({...p,dueDay:String(Number(d)),dueMonth:months[Number(m)-1]||"JAN",dueYear:y}));
 }
 function chooseCustomer(row:CatalogCustomer){
  setDraft(p=>({...p,
   clientCustomerId:row.id,
   clientName:row.billingName?.trim()||row.name,
   clientEmail:row.email,clientPhone:row.phone,
   clientAddress:row.address||row.addressLine1||"",
   clientType:row.customerType||"individual",clientTaxId:row.taxId||"",
   clientCompanyRegistration:row.companyRegistration||"",
   clientCity:row.city||"",clientState:row.state||"",
   clientPostalCode:row.postalCode||"",clientCountry:row.country||""
  }));
  close();
 }
 function chooseStaff(row:CatalogStaff){setSelectedStaff(row.name);close();}
 function close(){setPicker(null);setQuery("");setAdding(false);}
 function addCustomer(){
  if(!customer.name.trim())return;
  const next:CatalogCustomer={...customer,id:crypto.randomUUID(),
    billingName:customer.customerType==="business"?(customer.company.trim()||customer.name):customer.name};
  setCustomers(p=>[...p,next]);chooseCustomer(next);setCustomer({name:"",email:"",phone:"",address:"",company:"",customerType:"individual",taxId:"",country:"",city:"",state:""});
 }
 function addStaff(){
  if(!person.name.trim())return;
  const next:CatalogStaff={...person,id:String(staff.length+1)};
  setStaff(p=>[...p,next]);chooseStaff(next);setPerson({name:"",email:"",phone:"",role:"Salesperson"});
 }
 const filtered=useMemo(()=>picker==="customer"?customers.filter(c=>[c.name,c.company,c.email].some(v=>v.toLowerCase().includes(query.toLowerCase()))):staff.filter(s=>[s.name,s.role,s.email].some(v=>v.toLowerCase().includes(query.toLowerCase()))),[picker,customers,staff,query]);
 const input="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#0064E0]";
 const payments:{value:PaymentMode;label:string;note:string}[]=[
  {value:"manual",label:"Bank transfer to company account",note:"Merchant records transfer after checking bank evidence"},
  {value:"paystack",label:"Paystack gateway",note:"Provider verification required; manual Paid action disabled"},
  {value:"flutterwave",label:"Flutterwave gateway",note:"Provider verification required; manual Paid action disabled"},
  {value:"monnify",label:"Dynamic virtual account",note:"Provider verification required; manual Paid action disabled"}
 ];
 return <section aria-label="Invoice details" className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
  <Field label="Invoice number" value={draft.invoiceNo} onChange={()=>{}} disabled/>
  <label className="flex flex-col gap-1.5 text-xs"><span className="font-medium">Invoice status</span><select disabled className="h-10 rounded-xl bg-gray-50 px-3 text-sm text-gray-500"><option>Draft</option></select></label>
  <div className="min-w-0 space-y-1.5 sm:col-span-2"><span className="text-xs font-medium">Customer</span>
   <div className="flex min-w-0 items-center gap-2">
    <button type="button" onClick={()=>setPicker("customer")} className="flex h-10 min-w-0 flex-1 items-center justify-between rounded-xl bg-gray-50 px-3 text-left text-sm text-[#29415b]">
     <span className="truncate">{draft.clientName||"Select Customer"}</span><ChevronDown size={17}/></button>
    <button onClick={()=>{setPicker("customer");setAdding(true);}} className="flex h-10 shrink-0 items-center gap-1 rounded-full bg-[#0064E0] px-3 text-xs font-semibold text-white"><Plus size={15}/>Add New</button>
   </div>
  </div>
  <Field label="Customer email" value={draft.clientEmail} onChange={v=>update("clientEmail",v)}/>
  <Field label="Customer phone" value={draft.clientPhone} onChange={v=>update("clientPhone",v)}/>
  <label className="flex min-w-0 flex-col gap-1.5 text-xs"><span className="font-medium">Currency</span><select value={draft.currency} onChange={e=>update("currency",e.target.value as InvoiceDraft["currency"])} className="h-10 rounded-xl bg-gray-50 px-3 text-sm">{["NGN","USD","GBP","EUR"].map(c=><option key={c}>{c}</option>)}</select></label>
  <NativeDate label="Date issued" value={issued} onChange={v=>changeDate(v,"issue")}/>
  <NativeDate label="Due date" value={due} onChange={v=>changeDate(v,"due")}/>
  <Field label="Invoice subject" value={draft.senderRole} onChange={v=>update("senderRole",v)} placeholder="What is this invoice for?"/>
  <label className="flex min-w-0 flex-col gap-1.5 text-xs"><span className="font-medium">Recurring duration</span><select disabled className="h-10 rounded-xl bg-gray-50 px-3 text-sm text-gray-400"><option>Not configured</option></select></label>
  <div className="flex min-w-0 flex-col gap-1.5 text-xs"><span className="font-medium">Sales Person</span><div className="flex gap-2">
   <button onClick={()=>setPicker("staff")} className="flex h-10 min-w-0 flex-1 items-center justify-between rounded-xl bg-gray-50 px-3 text-left text-sm"><span className="truncate">{selectedStaff||"Select salesperson"}</span><ChevronDown size={16}/></button>
   <button onClick={()=>{setPicker("staff");setAdding(true);}} aria-label="Add salesperson" className="rounded-full bg-blue-50 px-3 text-[#0064E0]"><Plus size={18}/></button></div>
  </div>
  <div className="flex min-w-0 flex-col gap-1.5 text-xs"><span className="font-medium">Payment details</span>
   <button onClick={()=>setPicker("payment")} className="flex h-10 w-full items-center justify-between rounded-xl bg-gray-50 px-3 text-left text-sm"><span className="truncate">{payments.find(x=>x.value===paymentMode)?.label}</span><ChevronDown size={16}/></button>
  </div>
  <Field label="Customer address" value={draft.clientAddress} onChange={v=>update("clientAddress",v)}/>
  <div className="sm:col-span-2 rounded-xl border border-[#E2EAF4] bg-[#F8FBFF] p-3">
   <div className="flex flex-wrap items-center justify-between gap-2">
    <h3 className="text-xs font-semibold text-[#19364F]">Customer billing details</h3>
    <span className="text-[11px] text-slate-500">{draft.clientCustomerId?"From customer record · editable on this draft":"Choose a customer to fill available details"}</span>
   </div>
   <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
    <label className="flex flex-col gap-1 text-xs">Customer type
     <select aria-label="Customer type" value={draft.clientType||"individual"} onChange={e=>update("clientType",e.target.value as "business"|"individual")} className={input}>
      <option value="individual">Individual</option><option value="business">Business</option>
     </select></label>
    <label className="flex flex-col gap-1 text-xs">Customer Tax ID (if applicable)
     <input aria-label="Customer Tax ID" value={draft.clientTaxId||""} onChange={e=>update("clientTaxId",e.target.value)} className={input}/></label>
    <label className="flex flex-col gap-1 text-xs">City
     <input aria-label="Customer city" value={draft.clientCity||""} onChange={e=>update("clientCity",e.target.value)} className={input}/></label>
    <label className="flex flex-col gap-1 text-xs">State
     <input aria-label="Customer state" value={draft.clientState||""} onChange={e=>update("clientState",e.target.value)} className={input}/></label>
    <label className="flex flex-col gap-1 text-xs">Postal code
     <input aria-label="Customer postal code" value={draft.clientPostalCode||""} onChange={e=>update("clientPostalCode",e.target.value)} className={input}/></label>
    <label className="flex flex-col gap-1 text-xs">Country
     <input aria-label="Customer country" value={draft.clientCountry||""} onChange={e=>update("clientCountry",e.target.value)} className={input}/></label>
   </div>
   <p className="mt-2 text-[11px] text-slate-500">Edits here affect this draft only. They do not overwrite the customer master. Tax identification is required only where applicable.</p>
  </div>
  <Field label="Invoice sender" value={draft.senderName} onChange={v=>update("senderName",v)}/>
  {picker?<div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45 md:items-center md:p-4" onClick={close}>
    <section role="dialog" aria-modal="true" aria-label={"Select "+picker} onClick={e=>e.stopPropagation()} className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 pb-8 shadow-2xl md:rounded-2xl md:p-6">
     <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 md:hidden"/>
     <header className="mb-4 flex items-center justify-between"><h2 className="font-semibold text-[#18334b]">{picker==="customer"?"Select Customer":picker==="staff"?"Select Salesperson":"Payment Method"}</h2><button onClick={close} aria-label="Close picker"><X size={20}/></button></header>
     {picker==="payment"?<div className="space-y-2">{payments.map(p=><button key={p.value} type="button" disabled={p.value!=="manual"} onClick={()=>{setPaymentMode(p.value);close();}} className={"flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left "+(paymentMode===p.value?"border-[#0064E0] bg-blue-50":"border-gray-100")+(p.value!=="manual"?" cursor-not-allowed opacity-55":"")}>
      <Wallet className="shrink-0 text-[#0064E0]" size={20}/><span><span className="block text-sm font-medium">{p.label}{p.value!=="manual"?" · Not connected":""}</span><span className="text-xs text-gray-500">{p.note}</span></span></button>)}
      <Link href="/dashboard/getting-started?step=payments" className="block rounded-xl border border-blue-200 px-4 py-3 text-center text-xs font-semibold text-[#0064E0]">View payment connections</Link>
     </div>:
     <div className="space-y-3">
      {!adding?<><label className="relative block"><Search size={17} className="absolute left-3 top-3 text-gray-400"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder={"Search "+(picker==="customer"?"customers":"salespeople")} className={input+" pl-10"}/></label>
       <button onClick={()=>setAdding(true)} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] px-3 py-3 text-sm font-semibold text-white"><Plus size={16}/>Add new {picker}</button>
       <div className="max-h-72 space-y-2 overflow-auto">{filtered.map(entry=><button key={entry.id} onClick={()=>picker==="customer"?chooseCustomer(entry as CatalogCustomer):chooseStaff(entry as CatalogStaff)}
         className="flex w-full items-center gap-3 rounded-xl bg-[#f8f8f8] p-3 text-left hover:bg-blue-50">
         <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-600">{picker==="customer"?<Users size={19}/>:<UserRound size={19}/>}</span>
         <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#19364f]">{entry.name}</span><span className="block truncate text-xs text-gray-500">{picker==="customer"?(entry as CatalogCustomer).company:(entry as CatalogStaff).role} · {entry.email}</span></span>
        </button>)}</div></>:picker==="customer"?<>
        <label className="block text-xs">Customer name *<input value={customer.name} onChange={e=>setCustomer(p=>({...p,name:e.target.value}))} className={input}/></label>
        <label className="block text-xs">Customer type
          <select aria-label="New customer type" value={customer.customerType} onChange={e=>setCustomer(p=>({...p,customerType:e.target.value as "individual"|"business"}))} className={input}><option value="individual">Individual</option><option value="business">Business</option></select>
        </label>
        {(["email","phone","company","address","taxId","city","state","country"] as const).map(key=><label key={key} className="block text-xs capitalize">{key}<input value={customer[key]} onChange={e=>setCustomer(p=>({...p,[key]:e.target.value}))} className={input}/></label>)}
        <button disabled={!customer.name.trim()} onClick={addCustomer} className="w-full rounded-full bg-[#0064E0] py-3 text-sm text-white disabled:opacity-40">Add and select customer</button>
       </>:<>
        {(["name","email","phone","role"] as const).map(key=><label key={key} className="block text-xs capitalize">{key}<input value={person[key]} onChange={e=>setPerson(p=>({...p,[key]:e.target.value}))} className={input}/></label>)}
        <button disabled={!person.name.trim()} onClick={addStaff} className="w-full rounded-full bg-[#0064E0] py-3 text-sm text-white disabled:opacity-40">Add and select salesperson</button>
       </>}
     </div>}
    </section></div>:null}
 </section>;
}
