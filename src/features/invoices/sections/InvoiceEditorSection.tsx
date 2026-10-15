"use client";
import type { InvoiceDraft, InvoiceLine } from "@/src/features/invoice/types";
type Props = {
  draft: InvoiceDraft;
  setDraft: React.Dispatch<React.SetStateAction<InvoiceDraft>>;
};
function Input({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (value: string) => void; type?: string;
}) {
  return <label className="block space-y-1.5 text-sm">
    <span className="font-medium text-[#22334B]">{label}</span>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)}
      className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#0064E0] focus:ring-2 focus:ring-blue-100" />
  </label>;
}
export function InvoiceEditorSection({draft,setDraft}:Props) {
  const update = <K extends keyof InvoiceDraft>(key:K,value:InvoiceDraft[K])=>
    setDraft(prev=>({...prev,[key]:value}));
  const patchItem=(id:string,patch:Partial<InvoiceLine>)=>
    setDraft(prev=>({...prev,rows:prev.rows.map(line=>line.id===id?{...line,...patch}:line)}));
  return <section aria-label="Invoice input" className="space-y-5 rounded-xl bg-white p-5 shadow-sm">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Input label="Customer name" value={draft.clientName} onChange={v=>update("clientName",v)}/>
      <Input label="Customer email" type="email" value={draft.clientEmail} onChange={v=>update("clientEmail",v)}/>
      <Input label="Invoice number (preview only)" value={draft.invoiceNo} onChange={v=>update("invoiceNo",v)}/>
      <label className="block space-y-1.5 text-sm"><span className="font-medium text-[#22334B]">Currency</span>
        <select value={draft.currency} onChange={e=>update("currency",e.target.value as InvoiceDraft["currency"])}
          className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3">
          <option value="NGN">NGN — Nigerian Naira</option>
          <option value="USD">USD — US Dollar</option>
          <option value="GBP">GBP — British Pound</option>
          <option value="EUR">EUR — Euro</option>
        </select></label>
    </div>
    <div className="border-t border-gray-100 pt-4">
      <h2 className="mb-3 font-semibold text-[#1D2838]">Products and services</h2>
      {draft.rows.map(line=><div key={line.id} className="mb-3 rounded-xl bg-gray-50 p-3 space-y-3">
        <Input label="Description" value={line.serviceName} onChange={v=>patchItem(line.id,{serviceName:v})}/>
        <div className="grid grid-cols-3 gap-2">
          <Input label="Quantity" value={line.quantity} onChange={v=>patchItem(line.id,{quantity:v})}/>
          <Input label="Rate" value={line.unitPrice} onChange={v=>patchItem(line.id,{unitPrice:v})}/>
          <Input label="Discount %" value={line.discount} onChange={v=>patchItem(line.id,{discount:v})}/>
        </div>
        <button type="button" disabled={draft.rows.length===1} className="text-xs text-red-600 disabled:opacity-30"
          onClick={()=>setDraft(prev=>({...prev,rows:prev.rows.filter(x=>x.id!==line.id)}))}>Remove item</button>
      </div>)}
      <button type="button" onClick={()=>setDraft(prev=>({...prev,rows:[...prev.rows,{
        id:`preview-${prev.rows.length+1}`,serviceName:"",description:"",quantity:"1",unitPrice:"0",discount:"0"
      }]}))} className="rounded-full border border-[#0064E0] px-4 py-2 text-xs font-semibold text-[#0064E0]">+ Add row</button>
    </div>
    <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
      <Input label="Overall discount %" value={draft.discount} onChange={v=>update("discount",v)}/>
      <Input label="Tax % (illustrative)" value={draft.tax} onChange={v=>update("tax",v)}/>
    </div>
    <label className="block space-y-2 text-sm"><span className="font-medium">Notes to customer</span>
      <textarea value={draft.notes} onChange={e=>update("notes",e.target.value)}
        className="min-h-24 w-full rounded-lg border border-gray-200 bg-gray-50 p-3 focus:border-[#0064E0]" />
    </label>
    <p className="text-xs text-gray-500">For the UI preview only. Save, send, unique numbering and tax validation are disabled until the secure merchant backend is ready.</p>
  </section>;
}
