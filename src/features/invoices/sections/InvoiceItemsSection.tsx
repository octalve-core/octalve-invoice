"use client";
import type {InvoiceDraft,InvoiceLine} from "@/src/features/invoice/types";
type Props={draft:InvoiceDraft;setDraft:React.Dispatch<React.SetStateAction<InvoiceDraft>>};
function Small({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label className="min-w-0 space-y-1 text-xs"><span className="block truncate text-gray-600">{label}</span>
 <input value={value} onChange={e=>onChange(e.target.value)} aria-label={label}
 className="h-10 w-full min-w-0 rounded-xl bg-gray-50 px-2 text-xs outline-none focus:ring-2 focus:ring-blue-100"/></label>;}
export function InvoiceItemsSection({draft,setDraft}:Props){
 const patch=(id:string,patch:Partial<InvoiceLine>)=>setDraft(p=>({...p,rows:p.rows.map(x=>x.id===id?{...x,...patch}:x)}));
 return <section aria-label="Invoice products and services" className="space-y-3">
  <h2 className="text-sm font-semibold text-[#1D2838]">Add product or service</h2>
  {draft.rows.map((line,i)=><div key={line.id} className="space-y-2 rounded-xl border border-gray-100 bg-white p-3">
    <Small label={`Product or service ${i+1}`} value={line.serviceName} onChange={v=>patch(line.id,{serviceName:v})}/>
    <div className="grid grid-cols-3 gap-2">
     <Small label={`Rate for item ${i+1}`} value={line.unitPrice} onChange={v=>patch(line.id,{unitPrice:v})}/>
     <Small label={`Quantity for item ${i+1}`} value={line.quantity} onChange={v=>patch(line.id,{quantity:v})}/>
     <Small label={`Discount for item ${i+1}`} value={line.discount} onChange={v=>patch(line.id,{discount:v})}/>
    </div>
    <button type="button" disabled={draft.rows.length===1}
      onClick={()=>setDraft(p=>({...p,rows:p.rows.filter(x=>x.id!==line.id)}))}
      className="text-xs text-red-600 disabled:opacity-30">Remove row</button>
   </div>)}
  <button type="button" className="rounded-full border border-[#0064E0] px-4 py-2 text-xs text-[#0064E0]"
    onClick={()=>setDraft(p=>({...p,rows:[...p.rows,{id:`preview-item-${p.rows.length+1}`,serviceName:"",description:"",quantity:"1",unitPrice:"0",discount:"0"}]}))}>
    + Add row
  </button>
 </section>;
}