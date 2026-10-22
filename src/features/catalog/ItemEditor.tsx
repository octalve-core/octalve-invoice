"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {ArrowLeft,Package} from "lucide-react";
import {useMerchantPreview,type CatalogItem} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {isCatalogArchived} from "@/src/features/merchant-preview/catalog-contract";
import {QuickItemEditor,createQuickItem,emptyQuickItem} from "@/src/features/catalog/QuickItemEditor";

/** The catalogue page and invoice/quotation sheets share ONE editor and merchant store. */
export function ItemEditor({editId}:{editId?:string}){
 const router=useRouter();
 const {items,setItems,archivedRecords,taxPolicy}=useMerchantPreview();
 const existing=editId?items.find(item=>item.id===editId):undefined;
 const archived=Boolean(existing&&isCatalogArchived("item",existing.id,archivedRecords));
 const [form,setForm]=useState<CatalogItem>(()=>existing?{...existing}:emptyQuickItem());
 const [issue,setIssue]=useState("");
 function save(){
  if(editId&&(!existing||archived)){setIssue("This item is unavailable for editing. Return to Items.");return;}
  try{
   const prepared=createQuickItem(form,taxPolicy.jurisdiction);
   const next=existing?{...existing,...prepared,id:existing.id}:prepared;
   setItems(current=>existing?current.map(item=>item.id===existing.id?next:item):[...current,next]);
   router.push("/dashboard/items");
  }catch(error){setIssue(error instanceof Error?error.message:"Review the catalogue fields.");}
 }
 return <main className="mx-auto max-w-3xl space-y-5">
  <header className="flex items-center gap-3">
   <Link href="/dashboard/items" className="rounded-full p-2 text-[#17344c]" aria-label="Back to items"><ArrowLeft size={21}/></Link>
   <div><h1 className="text-xl font-semibold">{editId?"Edit":"Add"} Product / Service</h1><p className="text-xs text-gray-500">One reusable merchant catalogue</p></div>
  </header>
  <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-7">
   <div className="mb-5 flex items-center gap-3">
    <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><Package size={22}/></span>
    <div><h2 className="font-semibold">Item information</h2><p className="text-xs text-gray-500">Select this item in invoices and quotations; their copied values remain independent</p></div>
   </div>
   <QuickItemEditor value={form} onChange={setForm}/>
   <p className="mt-4 text-xs leading-5 text-slate-500">Tax Centre: {taxPolicy.jurisdiction} · {taxPolicy.version}. Tax treatment remains a proposal pending review; changing the catalogue does not rewrite existing document snapshots.</p>
   {issue?<p role="alert" className="mt-3 text-xs text-red-700">{issue}</p>:null}
   {editId&&!existing?<p role="alert" className="mt-2 text-xs text-amber-700">Item not found in this session.</p>:null}
   {archived?<p role="alert" className="mt-2 text-xs text-amber-700">Archived item cannot be edited until restored.</p>:null}
   <div className="mt-6 flex flex-wrap justify-end gap-2">
    <Link href="/dashboard/items" className="rounded-full border px-5 py-3 text-sm">Cancel</Link>
    <button type="button" disabled={archived||Boolean(editId&&!existing)} onClick={save} className="rounded-full bg-[#0064E0] px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">{editId?"Update item":"Add item"}</button>
   </div>
  </div>
 </main>;
}
