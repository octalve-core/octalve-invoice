"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {ArrowLeft,Package} from "lucide-react";
import {useMerchantPreview,type CatalogItem} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {newCatalogPreviewId} from "@/src/features/merchant-preview/catalog-contract";
import {taxTreatments,unclassifiedTax} from "@/src/features/tax/tax-domain";
export function ItemEditor({editId}:{editId?:string}){
 const router=useRouter(),{items,setItems}=useMerchantPreview();
 const existing=editId?items.find(x=>x.id===editId):undefined;
 const [form,setForm]=useState<CatalogItem>(()=>existing?{...existing}:{id:"",name:"",description:"",rate:"",taxPercent:"0",discountPercent:"0",category:"",type:"goods"});
 const [issue,setIssue]=useState("");
 const fields:({key:"name"|"rate"|"category"|"discountPercent";label:string;type?:string})[]=[
 {key:"name",label:"Item / service name"},{key:"rate",label:"Unit price / rate",type:"number"},
 {key:"category",label:"Category"},{key:"discountPercent",label:"Default discount (%)",type:"number"}
];
 function save(){
  const rate=Number(form.rate),disc=Number(form.discountPercent);
  if(!form.name.trim()||!Number.isFinite(rate)||rate<0||!Number.isFinite(disc)||disc<0||disc>100){setIssue("Enter a name, non-negative price and percentage values from 0 to 100.");return;}
  if(editId&&!existing){setIssue("This item is not in the current workspace.");return;}
  const row={...form,id:editId||newCatalogPreviewId()};
  setItems(p=>editId?p.map(x=>x.id===editId?row:x):[...p,row]);router.push("/dashboard/items");
 }
 return <main className="mx-auto max-w-3xl space-y-5">
  <header className="flex items-center gap-3"><Link href="/dashboard/items" className="rounded-full p-2 text-[#17344c]" aria-label="Back to items"><ArrowLeft size={21}/></Link><div><h1 className="text-xl font-semibold">{editId?"Edit":"Add"} Product / Service</h1><p className="text-xs text-gray-500">Set your reusable catalogue details and pricing</p></div></header>
  <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-7">
   <div className="mb-5 flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><Package size={22}/></span><div><h2 className="font-semibold">Item information</h2><p className="text-xs text-gray-500">Images will be available when managed storage is connected</p></div></div>
   <fieldset className="mb-5"><legend className="mb-2 text-xs font-semibold">Item type</legend><div className="flex gap-4">{(["goods","service"] as const).map(type=><label key={type} className="flex items-center gap-2 text-sm capitalize"><input type="radio" checked={form.type===type} onChange={()=>setForm(p=>({...p,type}))} className="accent-[#0064E0]"/>{type}</label>)}</div></fieldset>
   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.map(({key,label,type})=><label key={key} className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-[#1d344b]">{label}
    <input type={type||"text"} min={type==="number"?0:undefined} max={key==="discountPercent"?100:undefined} step={type==="number"?"any":undefined}
      value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#0064E0]"/></label>)}</div>
   <label className="mt-4 block space-y-1.5 text-xs font-medium text-[#1d344b]">Tax treatment — pending Tax Centre review
    <select aria-label="Item tax treatment" value={form.taxClassification?.treatment||"unclassified"} onChange={e=>setForm(p=>({...p,taxClassification:{...unclassifiedTax,treatment:e.target.value as typeof taxTreatments[number]}}))} className="block h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm">
     {taxTreatments.map(t=><option value={t} key={t}>{t.replaceAll("-"," ")}</option>)}
    </select></label>
   <label className="mt-4 block space-y-1.5 text-xs font-medium text-[#1d344b]">Description (optional)
    <textarea rows={3} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}
      placeholder="Product details shown on invoices only when entered" className="block w-full resize-y rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm outline-none focus:border-[#0064E0]"/></label>
   <p className="mt-3 text-xs text-gray-500">Default discounts are populated when an item is selected. Tax treatment is a proposal and requires review of business eligibility, jurisdiction and effective law before any fiscal use.</p>
   {issue?<p role="alert" className="mt-3 text-xs text-red-600">{issue}</p>:null}
   {editId&&!existing?<p className="mt-2 text-xs text-amber-600">Item not found in this session. Return to Items.</p>:null}
   <div className="mt-6 flex flex-wrap justify-end gap-2"><Link href="/dashboard/items" className="rounded-full border px-5 py-3 text-sm">Cancel</Link>
    <button type="button" onClick={save} className="rounded-full bg-[#0064E0] px-6 py-3 text-sm font-semibold text-white">{editId?"Update item":"Add item"}</button></div>
  </div>
 </main>;
}
