"use client";
import {useMerchantPreview,type CatalogItem} from "../merchant-preview/MerchantPreviewProvider";
import {newCatalogPreviewId} from "../merchant-preview/catalog-contract";
import {taxTreatments,unclassifiedTax} from "../tax/tax-domain";

/** Shared frontend item editor for draft invoice and quotation pickers. */
export const emptyQuickItem=():CatalogItem=>({id:"",name:"",description:"",rate:"0",category:"",discountPercent:"0",taxPercent:"0",type:"goods",taxClassification:unclassifiedTax});
export function createQuickItem(value:CatalogItem,jurisdiction="NG"):CatalogItem{
 if(!value.name.trim()||!/^\d+(?:\.\d{1,2})?$/.test(value.rate)||!Number.isFinite(Number(value.rate))||Number(value.rate)<0||!/^\d{1,3}(?:\.\d{1,2})?$/.test(value.discountPercent)||Number(value.discountPercent)>100)throw new Error("Item requires a name, nonnegative price and discount between 0 and 100%.");
 return {...value,id:newCatalogPreviewId(),name:value.name.trim(),
  taxClassification:{...(value.taxClassification||unclassifiedTax),jurisdiction,review:"needs-review",ruleVersion:"unverified"}};
}
export function QuickItemEditor({value,onChange}:{value:CatalogItem;onChange:(next:CatalogItem)=>void}){
 const {taxPolicy}=useMerchantPreview();
 const field=(key:"name"|"rate"|"category"|"description"|"discountPercent")=><label key={key} className="block min-w-0 text-xs capitalize text-[#193955]">{key==="rate"?"Unit price":key==="discountPercent"?"Preset discount %":key}
  <input aria-label={"Item "+key} type="text" inputMode={key==="rate"||key==="discountPercent"?"decimal":"text"} value={value[key]}
   onChange={e=>onChange({...value,[key]:e.target.value})}
   className="mt-1 h-10 w-full min-w-0 rounded-xl border border-[#DDE6F1] bg-white px-3 text-sm focus:border-[#0064E0]"/>
 </label>;
 return <div aria-label="Item catalogue fields" className="space-y-3">
  {field("name")}
  <div className="grid grid-cols-2 gap-3">{(["rate","discountPercent"] as const).map(field)}</div>
  {field("category")}{field("description")}
  <label className="block text-xs text-[#193955]">Type
   <select aria-label="New item type" value={value.type} onChange={e=>onChange({...value,type:e.target.value as CatalogItem["type"]})}
    className="mt-1 h-10 w-full rounded-xl border border-[#DDE6F1] bg-white px-3 text-sm"><option value="goods">Goods</option><option value="service">Service</option></select>
  </label>
  <label className="block text-xs text-[#193955]">Tax treatment — unverified
   <select aria-label="Item tax classification" value={value.taxClassification?.treatment||"unclassified"}
    onChange={e=>onChange({...value,taxClassification:{...unclassifiedTax,jurisdiction:taxPolicy.jurisdiction,treatment:e.target.value as typeof taxTreatments[number]}})}
    className="mt-1 h-10 w-full rounded-xl border border-[#DDE6F1] bg-white px-3 text-sm">{taxTreatments.map(t=><option key={t} value={t}>{t.replaceAll("-"," ")}</option>)}</select>
  </label>
 </div>;
}
