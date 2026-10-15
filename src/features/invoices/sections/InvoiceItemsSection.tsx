"use client";
import {useState} from "react";
import {ChevronDown,Package,Plus,Search,X} from "lucide-react";
import {useMerchantPreview,type CatalogItem} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import type {InvoiceDraft,InvoiceLine} from "@/src/features/invoice/types";
type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>};
function Small({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label className="min-w-0 space-y-1 text-xs"><span className="block truncate text-gray-600">{label}</span>
 <input value={value} onChange={e=>onChange(e.target.value)} aria-label={label} className="h-10 w-full min-w-0 rounded-xl bg-gray-50 px-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"/></label>;}
const empty:CatalogItem={id:"",name:"",description:"",rate:"0",taxPercent:"0",discountPercent:"0",category:"",type:"goods"};
export function InvoiceItemsSection({draft,setDraft}:Props){
 const {items,setItems}=useMerchantPreview();
 const [selection,setSelection]=useState<string|null>(null),[search,setSearch]=useState(""),[adding,setAdding]=useState(false),[form,setForm]=useState<CatalogItem>(empty);
 const patch=(id:string,partial:Partial<InvoiceLine>)=>setDraft(p=>({...p,rows:p.rows.map(x=>x.id===id?{...x,...partial}:x)}));
 function pick(row:CatalogItem){
  if(!selection)return;
  patch(selection,{serviceName:row.name,description:row.description,unitPrice:row.rate,discount:row.discountPercent});
  close();
 }
 function close(){setSelection(null);setAdding(false);setSearch("");setForm(empty);}
 function save(){
  if(!form.name.trim()||!(Number(form.rate)>=0))return;
  const item={...form,id:String(items.length+1)};setItems(p=>[...p,item]);pick(item);
 }
 return <section aria-label="Invoice products and services" className="space-y-3">
  <h2 className="text-sm font-semibold text-[#1D2838]">Add product or service</h2>
  {draft.rows.map((line,i)=><div key={line.id} className="space-y-2 rounded-xl border border-gray-100 bg-white p-3">
    <button type="button" onClick={()=>setSelection(line.id)} className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-3 py-3 text-left text-xs text-[#273b57]"><span className="truncate">{line.serviceName||"Select an item or service"}</span><ChevronDown size={17}/></button>
    <Small label={"Product or service "+(i+1)} value={line.serviceName} onChange={v=>patch(line.id,{serviceName:v})}/>
    <label className="block text-xs text-gray-600">Description (optional)
      <textarea value={line.description} onChange={e=>patch(line.id,{description:e.target.value})} placeholder="Additional item information, shown only when supplied" rows={2}
        className="mt-1 block w-full resize-y rounded-xl bg-gray-50 p-3 text-xs text-[#273b57] outline-none focus:ring-2 focus:ring-blue-100"/>
    </label>
    <div className="grid grid-cols-3 gap-2">
     <Small label={"Rate for item "+(i+1)} value={line.unitPrice} onChange={v=>patch(line.id,{unitPrice:v})}/>
     <Small label={"Quantity for item "+(i+1)} value={line.quantity} onChange={v=>patch(line.id,{quantity:v})}/>
     <Small label={"Discount % for item "+(i+1)} value={line.discount} onChange={v=>patch(line.id,{discount:v})}/>
    </div>
    <button type="button" disabled={draft.rows.length===1} onClick={()=>setDraft(p=>({...p,rows:p.rows.filter(x=>x.id!==line.id)}))}
      className="text-xs text-red-600 disabled:opacity-30">Remove row</button>
   </div>)}
  <button type="button" className="rounded-full border border-[#0064E0] px-4 py-2 text-xs text-[#0064E0]"
    onClick={()=>setDraft(p=>({...p,rows:[...p.rows,{id:"preview-item-"+crypto.randomUUID(),serviceName:"",description:"",quantity:"1",unitPrice:"0",discount:"0"}]}))}>+ Add row</button>
  {selection?<div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 md:items-center md:p-4" onClick={close}>
   <section role="dialog" aria-modal="true" aria-label="Select product or service" onClick={e=>e.stopPropagation()}
     className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 pb-8 shadow-2xl md:rounded-2xl md:p-5">
    <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 md:hidden"/>
    <div className="mb-3 flex justify-between"><h3 className="font-semibold">Select product or service</h3><button onClick={close} aria-label="Close item picker"><X size={20}/></button></div>
    {adding?<div className="space-y-3">{(["name","description","rate","category","taxPercent","discountPercent"] as const).map(key=>
      <label key={key} className="block text-xs capitalize">{key==="taxPercent"?"Preset tax %":key==="discountPercent"?"Preset discount %":key}
       <input value={form[key]} onChange={e=>setForm(p=>({...p,[key]:e.target.value}))} className="mt-1 h-10 w-full rounded-xl border bg-gray-50 px-3 text-sm"/></label>)}
      <div className="flex gap-2"><button onClick={()=>setAdding(false)} className="flex-1 rounded-full border border-gray-200 p-3 text-sm">Back</button><button disabled={!form.name.trim()} onClick={save} className="flex-1 rounded-full bg-[#0064E0] p-3 text-sm text-white disabled:opacity-40">Add and select</button></div>
     </div>:<>
     <label className="relative block"><Search className="absolute left-3 top-3 text-gray-400" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)}
       placeholder="Search products / services" className="h-11 w-full rounded-xl border pl-10 text-sm"/></label>
     <button onClick={()=>setAdding(true)} className="my-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] px-3 py-3 text-sm font-semibold text-white"><Plus size={16}/>Add new product or service</button>
     <div className="max-h-72 space-y-2 overflow-auto">{items.filter(x=>[x.name,x.category].some(y=>y.toLowerCase().includes(search.toLowerCase()))).map(x=>
      <button key={x.id} onClick={()=>pick(x)} className="flex w-full items-center gap-3 rounded-xl bg-[#f8f8f8] p-3 text-left hover:bg-blue-50">
       <span className="grid h-10 w-10 rounded-full bg-blue-100 text-[#0064E0] place-items-center"><Package size={20}/></span>
       <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{x.name}</span><span className="block truncate text-xs text-gray-500">{x.category} · ₦{Number(x.rate).toLocaleString("en-NG")} · {x.discountPercent}% discount</span></span></button>)}</div>
    </>}
   </section></div>:null}
 </section>;
}