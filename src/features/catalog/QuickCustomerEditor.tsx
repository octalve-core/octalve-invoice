"use client";
import type {CatalogCustomer} from "../merchant-preview/MerchantPreviewProvider";
import {newCatalogPreviewId} from "../merchant-preview/catalog-contract";

/** One reusable frontend editor contract for quick Add from invoice and quotation. */
export type QuickCustomerInput={
 name:string;email:string;phone:string;company:string;address:string;
 customerType:"business"|"individual";taxId:string;city:string;state:string;country:string;
};
export const emptyQuickCustomer=():QuickCustomerInput=>({
 name:"",email:"",phone:"",company:"",address:"",customerType:"individual",taxId:"",
 city:"",state:"",country:""
});
export function createQuickCustomer(value:QuickCustomerInput):CatalogCustomer{
 const name=value.name.trim();
 if(!name)throw new Error("Customer name required");
 return {...value,id:newCatalogPreviewId(),name,billingName:value.customerType==="business"?(value.company.trim()||name):name};
}
export function QuickCustomerEditor({value,onChange}:{value:QuickCustomerInput;onChange:(next:QuickCustomerInput)=>void}){
 const field=(key:Exclude<keyof QuickCustomerInput,"customerType">)=>(
  <label key={key} className="block min-w-0 text-xs capitalize text-[#193955]">{key==="taxId"?"Tax ID (if applicable)":key}
   <input aria-label={"Customer "+key} type={key==="email"?"email":"text"} value={value[key]}
    onChange={e=>onChange({...value,[key]:e.target.value})}
    className="mt-1 h-10 w-full min-w-0 rounded-xl border border-[#DDE6F1] bg-white px-3 text-sm focus:border-[#0064E0]"/>
  </label>
 );
 return <div aria-label="Customer catalogue fields" className="space-y-3">
  {field("name")}
  <label className="block text-xs text-[#193955]">Customer type
   <select aria-label="New customer type" value={value.customerType} onChange={e=>onChange({...value,customerType:e.target.value as QuickCustomerInput["customerType"]})}
    className="mt-1 h-10 w-full rounded-xl border border-[#DDE6F1] bg-white px-3 text-sm"><option value="individual">Individual</option><option value="business">Business</option></select>
  </label>
  <div className="grid min-w-0 gap-3 sm:grid-cols-2">{(["email","phone","company","address","taxId","city","state","country"] as const).map(field)}</div>
 </div>;
}
