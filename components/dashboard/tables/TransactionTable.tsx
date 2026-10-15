"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {X} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {getPreviewRecords,type PreviewRecord,type RecordKind} from "@/src/features/records/preview-records";
import {RecordMobileCard} from "@/src/features/records/components/RecordVisual";
import {RecordActionDialog,type RecordAction} from "@/src/features/records/components/RecordActionDialog";
import {RecordDetailDialog} from "@/src/features/records/components/RecordDetailDialog";
const categories=[
 {label:"All",kind:null,href:"/dashboard/invoice"},
 {label:"Invoices",kind:"invoice",href:"/dashboard/invoice"},
 {label:"Expenses",kind:"expense",href:"/dashboard/expenses"},
 {label:"Quotation",kind:"quotation",href:"/dashboard/quotation"}
] as const;
type Tab=(typeof categories)[number]["label"];
export default function TransactionTable(){
 const router=useRouter();
 const {settings}=useMerchantPreview();
 const [filter,setFilter]=useState<Tab>("All"),[selected,setSelected]=useState<PreviewRecord|null>(null);
 const [viewing,setViewing]=useState<PreviewRecord|null>(null),[notice,setNotice]=useState("");
 const rows=useMemo(()=>{
  const merchant=settings.businessName||"Octalve Limited";
  const invoices=getPreviewRecords("invoice",merchant);
  const expenses=getPreviewRecords("expense",merchant);
  const quotations=getPreviewRecords("quotation",merchant);
  const receipts=getPreviewRecords("receipt",merchant);
  const credits=getPreviewRecords("creditNote",merchant);
  return [invoices[0],expenses[2],quotations[0],receipts[0],credits[0],...invoices.slice(1),...expenses.slice(0,2),...receipts.slice(1),...quotations.slice(1),...credits.slice(1)];
 },[settings.businessName]);
 const kind=categories.find(c=>c.label===filter)?.kind;
 const visible=filter==="All"?rows.slice(0,5):rows.filter(r=>r.kind===kind);
 const viewAll=categories.find(c=>c.label===filter)?.href||"/dashboard/invoice";
 function view(r:PreviewRecord){if(r.kind==="invoice")router.push("/dashboard/invoice/"+r.id);else setViewing(r);}
 function action(key:RecordAction,r:PreviewRecord){
  if(key==="view"){view(r);return;}
  if(key==="edit"&&r.kind==="invoice"){router.push("/dashboard/invoice/"+r.id+"/edit");return;}
  const messages:Record<Exclude<RecordAction,"view">,string>={
   edit:"Editing requires the merchant backend.",send:"Nothing was sent.",duplicate:"Nothing was duplicated.",
   delete:"Nothing was deleted.",refund:"No refund was made or confirmed.",deactivate:"No account was deactivated."
  };
  setNotice(r.reference+": "+messages[key]+" Preview data is unchanged.");
 }
 return <section aria-label="Recent transactions" className="min-w-0 overflow-hidden rounded-2xl bg-white p-3 shadow-sm sm:p-5">
  <header className="flex items-center justify-between gap-2"><h2 className="text-lg font-medium text-[#344357] sm:text-2xl">Recent transactions</h2>
   <Link href={viewAll} className="shrink-0 text-sm font-medium text-[#0064E0] sm:text-lg">View All</Link>
  </header>
  <div aria-label="Recent transaction filters" className="my-4 flex flex-wrap gap-2">
   {categories.map(c=><button type="button" key={c.label} onClick={()=>setFilter(c.label)} aria-pressed={filter===c.label}
    className={"rounded-full px-3 py-2 text-xs sm:px-4 sm:text-sm "+(filter===c.label?"bg-green-50 font-semibold text-green-600":"bg-gray-100 text-gray-400")}>{c.label}</button>)}
  </div>
  {notice?<div role="status" className="mb-3 flex justify-between gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-900"><span>{notice}</span><button aria-label="Dismiss notice" onClick={()=>setNotice("")}><X size={16}/></button></div>:null}
  <div className="space-y-2">{visible.map(row=><RecordMobileCard key={row.kind+"-"+row.id} record={row} onSelect={setSelected}/>)}</div>
  {visible.length===0?<p className="p-5 text-center text-sm text-gray-500">No sample records in this category.</p>:null}
  <p className="mt-3 text-xs text-gray-400">UI Preview — values are examples, not financial records. Receipts are only generated when explicitly requested.</p>
  {selected?<RecordActionDialog record={selected} onClose={()=>setSelected(null)} onAction={action}/>:null}
  {viewing?<RecordDetailDialog record={viewing} onClose={()=>setViewing(null)}/>:null}
 </section>;
}