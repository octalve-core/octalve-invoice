"use client";
import {useState} from "react";
import {ChevronDown,Package,Plus,Search,X} from "lucide-react";
import {useMerchantPreview,type CatalogItem} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import type {InvoiceDraft,InvoiceLine} from "@/src/features/invoice/types";
import {snapshotItem,isCatalogArchived} from "@/src/features/merchant-preview/catalog-contract";
import {QuickItemEditor,createQuickItem,emptyQuickItem} from "@/src/features/catalog/QuickItemEditor";
import {unclassifiedTax} from "@/src/features/tax/tax-domain";
type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>};
function Small({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label className="min-w-0 space-y-1 text-xs"><span className="block truncate text-gray-600">{label}</span>
 <input value={value} onChange={e=>onChange(e.target.value)} aria-label={label} className="h-10 w-full min-w-0 rounded-xl bg-gray-50 px-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"/></label>;}

export function InvoiceItemsSection({draft,setDraft}:Props){
 const {items,setItems,archivedRecords}=useMerchantPreview();
 const [selection,setSelection]=useState<string|null>(null),[search,setSearch]=useState(""),[adding,setAdding]=useState(false),[form,setForm]=useState<CatalogItem>(emptyQuickItem);
 const [expanded,setExpanded]=useState<string[]>(()=>[draft.rows[0]?.id||""]);
 const [editingItemId,setEditingItemId]=useState<string|null>(null),[formError,setFormError]=useState("");
 const allExpanded=draft.rows.length>0&&draft.rows.every(r=>expanded.includes(r.id));
 const toggle=(id:string)=>setExpanded(current=>current.includes(id)?current.filter(x=>x!==id):[id]);
 const patch=(id:string,partial:Partial<InvoiceLine>)=>setDraft(p=>({...p,rows:p.rows.map(x=>x.id===id?{...x,...partial}:x)}));
 function pick(row:CatalogItem){
  if(!selection)return;
  patch(selection,snapshotItem(row));
  setExpanded([selection]);
  close();
 }
 function close(){setSelection(null);setAdding(false);setSearch("");setEditingItemId(null);setFormError("");setForm(emptyQuickItem());}
 function save(){
  try {
   const previous=items.find(x=>x.id===editingItemId);
   if(editingItemId&&!previous){setFormError("Selected catalogue item is no longer available.");return;}
   const item=previous?{...previous,...form,id:previous.id,taxClassification:{...form.taxClassification??unclassifiedTax,review:"needs-review" as const,ruleVersion:"unverified"}}:createQuickItem(form);
   // The only catalogue owner is MerchantPreviewProvider; explicitly selecting copies this version.
   setItems(p=>previous?p.map(x=>x.id===previous.id?item:x):[...p,item]);
   pick(item);
  } catch(error){setFormError(error instanceof Error?error.message:"Check the item fields.");}
 }
 function editItem(row:CatalogItem){
  setForm({...row,taxClassification:row.taxClassification?{...row.taxClassification}:unclassifiedTax});
  setEditingItemId(row.id);setFormError("");setAdding(true);
 }
 return <section aria-label="Invoice products and services" className="space-y-3">
  <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold text-[#1D2838]">Invoice items</h3><button type="button" onClick={()=>setExpanded(allExpanded?[]:draft.rows.map(r=>r.id))} className="text-xs font-semibold text-[#0064E0]">{allExpanded?"Collapse items":"Expand items"}</button></div>
  {draft.rows.map((line,i)=><div key={line.id} className="rounded-xl border border-gray-100 bg-white p-3">
    <button type="button" aria-expanded={expanded.includes(line.id)} aria-controls={"invoice-line-"+line.id} aria-label={"Edit item "+(i+1)} onClick={()=>toggle(line.id)} className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-1 text-left text-xs hover:bg-[#F7FAFF]"><span className="min-w-0 flex-1"><strong className="block truncate text-[#173652]">{line.serviceName||"Item "+(i+1)+" · choose a product or service"}</strong><span className="mt-1 block text-[11px] text-slate-500">Qty {line.quantity||"0"} · Rate {line.unitPrice||"0"}</span></span><ChevronDown size={17} className={"shrink-0 text-[#0064E0] transition-transform "+(expanded.includes(line.id)?"rotate-180":"")}/></button>
    {expanded.includes(line.id)?<div id={"invoice-line-"+line.id} className="mt-3 space-y-2 border-t border-slate-100 pt-3">
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
   </div>:null}
   </div>)}
  <button type="button" className="rounded-full border border-[#0064E0] px-4 py-2 text-xs text-[#0064E0]"
    onClick={()=>{const id="preview-item-"+crypto.randomUUID();setDraft(p=>({...p,rows:[...p.rows,{id,serviceName:"",description:"",quantity:"1",unitPrice:"0",discount:"0"}]}));setExpanded([id]);}}>+ Add row</button>
  {selection?<div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 md:items-center md:p-4" onClick={close}>
   <section role="dialog" aria-modal="true" aria-label="Select product or service" onClick={e=>e.stopPropagation()}
     className="max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4 pb-8 shadow-2xl md:rounded-2xl md:p-5">
    <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 md:hidden"/>
    <div className="mb-3 flex justify-between"><h3 className="font-semibold">Select product or service</h3><button onClick={close} aria-label="Close item picker"><X size={20}/></button></div>
    {adding?<div className="space-y-3"><QuickItemEditor value={form} onChange={setForm}/>
      {formError?<p role="alert" className="text-xs text-red-700">{formError}</p>:null}
      <div className="flex gap-2"><button onClick={()=>setAdding(false)} className="flex-1 rounded-full border border-gray-200 p-3 text-sm">Back</button><button disabled={!form.name.trim()} onClick={save} className="flex-1 rounded-full bg-[#0064E0] p-3 text-sm text-white disabled:opacity-40">{editingItemId?"Update and select":"Add and select"}</button></div>
     </div>:<>
     <label className="relative block"><Search className="absolute left-3 top-3 text-gray-400" size={17}/><input value={search} onChange={e=>setSearch(e.target.value)}
       placeholder="Search products / services" className="h-11 w-full rounded-xl border pl-10 text-sm"/></label>
     <button onClick={()=>{setAdding(true);setEditingItemId(null);setForm(emptyQuickItem());setFormError("");}} className="my-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] px-3 py-3 text-sm font-semibold text-white"><Plus size={16}/>Add new product or service</button>
     <div className="max-h-72 space-y-2 overflow-auto">{items.filter(x=>!isCatalogArchived("item",x.id,archivedRecords)&&[x.name,x.category].some(y=>y.toLowerCase().includes(search.toLowerCase()))).map(x=>
      <div key={x.id} className="flex min-w-0 items-center gap-2 rounded-xl bg-[#f8f8f8] p-2">
       <button type="button" onClick={()=>pick(x)} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 text-left hover:bg-blue-50">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-[#0064E0]"><Package size={20}/></span>
        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{x.name}</span><span className="block truncate text-xs text-gray-500">{x.category} · {new Intl.NumberFormat("en-NG",{style:"currency",currency:draft.currency}).format(Number(x.rate))} · {x.discountPercent}% discount</span></span>
       </button>
       <button type="button" aria-label={"Edit catalogue item "+x.name} onClick={()=>editItem(x)} className="shrink-0 rounded-full border border-blue-200 px-3 py-2 text-xs text-[#0064E0]">Edit</button>
      </div>)}</div>
    </>}
   </section></div>:null}
 </section>;
}