"use client";
import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft,Search,Download,SlidersHorizontal,Plus,MoreVertical,X,Trash2} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {definitions,getPreviewRecords,type PreviewRecord,type RecordField,type RecordKind,type RecordStatus} from "../preview-records";
import {RecordStatusBadge,RecordTypeIcon,RecordMobileCard,statusLabels} from "./RecordVisual";
import {RecordActionDialog,type RecordAction} from "./RecordActionDialog";
import {RecordFilterDialog,type FilterCriteria} from "./RecordFilterDialog";
import {RecordDetailDialog} from "./RecordDetailDialog";
import {formatDocumentNumber} from "@/src/features/invoices/lib/document-number";

function tableValue(record:PreviewRecord,field:RecordField):string{
 switch(field){case "title":return record.title;case "date":return record.date;case "status":return statusLabels[record.status];
 case "reference":return record.reference;default:return record[field]||"—";}
}
function dateISO(day:string){const [d,m,y]=day.split("/");return [y,m?.padStart(2,"0"),d?.padStart(2,"0")].join("-");}
export function RecordDirectory({kind,onCreate,onView,onEdit,showDesktopHeader=true}:{kind:RecordKind;onCreate?:()=>void;onView?:(record:PreviewRecord)=>void;onEdit?:(record:PreviewRecord)=>void;showDesktopHeader?:boolean}){
 const def=definitions[kind],router=useRouter();
 const {settings,customers,staff,items,archivedRecords,setArchivedRecords}=useMerchantPreview(),merchant=settings.businessName||"Octalve Limited";
 const records=useMemo(()=>{
  if(kind==="customer")return customers.map((c,i):PreviewRecord=>({id:c.id,kind,reference:formatDocumentNumber(merchant,i+1,"customer"),title:c.name,email:c.email,category:c.company,date:"12/6/2024",status:"active"}));
  if(kind==="staff")return staff.map((c,i):PreviewRecord=>({id:c.id,kind,reference:formatDocumentNumber(merchant,i+1,"staff"),title:c.name,email:c.email,category:c.role,date:"12/6/2024",status:"active"}));
  if(kind==="item")return items.map((c,i):PreviewRecord=>({id:c.id,kind,reference:formatDocumentNumber(merchant,i+1,"item"),title:c.name,amount:"₦"+Number(c.rate||0).toLocaleString("en-NG",{minimumFractionDigits:2}),category:c.category,date:"12/6/2024",status:"available"}));
  return getPreviewRecords(kind,merchant);
 },[kind,merchant,customers,staff,items]);
 const [search,setSearch]=useState("");
 const [status,setStatus]=useState<RecordStatus|"all">("all");
 const [filters,setFilters]=useState<FilterCriteria>({status:"all",from:"",to:""});
 const [filtersOpen,setFiltersOpen]=useState(false);
 const [selected,setSelected]=useState<PreviewRecord|null>(null);
 const [viewing,setViewing]=useState<PreviewRecord|null>(null);
 const [deleteTarget,setDeleteTarget]=useState<PreviewRecord|null>(null);
 const [deleteReason,setDeleteReason]=useState("");
 const [page,setPage]=useState(1),[notice,setNotice]=useState("");
 const filtered=useMemo(()=>records.filter(r=>{
  if(archivedRecords.some(a=>a.kind===r.kind&&a.id===r.id))return false;
  if(status!=="all"&&r.status!==status)return false;
  if(filters.status!=="all"&&r.status!==filters.status)return false;
  const date=dateISO(r.date);
  if(filters.from&&date<filters.from)return false;
  if(filters.to&&date>filters.to)return false;
  const q=search.trim().toLowerCase();
  return !q||[r.reference,r.title,r.email||"",r.paymentMethod||"",r.category||""].some(x=>x.toLowerCase().includes(q));
 }),[records,status,filters,search,archivedRecords]);
 const total=Math.max(1,Math.ceil(filtered.length/10)),visible=filtered.slice((page-1)*10,page*10);
 function openView(record:PreviewRecord){
  if(kind==="invoice"){router.push("/dashboard/invoice/"+record.id);return;}
  if(kind==="receipt"){router.push("/dashboard/receipt/"+record.id);return;}
  if(onView){onView(record);return;}
  setViewing(record);
 }
 function action(key:RecordAction,record:PreviewRecord){
  if(key==="view"){openView(record);return;}
  if(key==="delete"){setDeleteReason("");setDeleteTarget(record);return;}
  if(key==="edit"&&kind==="invoice"){router.push("/dashboard/invoice/"+record.id+"/edit");return;}
  if(key==="edit"&&kind==="item"){router.push("/dashboard/items/"+record.id+"/edit");return;}
  if(key==="edit"&&kind==="staff"){router.push("/dashboard/staff/"+record.id+"/edit");return;}
  if(key==="edit"&&onEdit){onEdit(record);return;}
  const message:Record<Exclude<RecordAction,"view">,string>={
   edit:"Editing is not live for this module yet.",
   send:"No message has been sent.",
   duplicate:"No record has been duplicated.",
   delete:"No record was permanently deleted.",
   refund:"No refund was made or confirmed; verified payment reversal is required.",
   deactivate:"No person was deactivated; staff or customer permissions are not live."
  };
  setNotice(record.reference+": "+message[key]);
 }
 function beginCreate(){
  if(onCreate){onCreate();return;}
  if(kind==="invoice"){router.push("/dashboard/invoice/create");return;}
  if(kind==="customer"){router.push("/dashboard/customer/add");return;}
  if(kind==="item"){router.push("/dashboard/items/add");return;}
  if(kind==="staff"){router.push("/dashboard/staff/create");return;}
  setNotice("Creating "+def.title.toLowerCase()+" records is not live yet. This screen displays preview-only examples.");
 }
 function tab(next:RecordStatus|"all"){setStatus(next);setPage(1);}
 function query(next:string){setSearch(next);setPage(1);}
 return <section aria-label={def.title+" history"} className="min-w-0 space-y-3">
  {showDesktopHeader?<div className="hidden lg:block"><h1 className="text-2xl font-bold text-[#1d2838]">{def.title}</h1><p className="mt-1 text-sm text-gray-500">{def.description}</p></div>:null}
  <div className="lg:hidden">
   <div className="relative mb-4 flex items-center justify-center border-b border-gray-200 py-3">
     <button aria-label="Back" onClick={()=>router.push("/dashboard")} className="absolute left-0 rounded-md p-1 text-gray-700"><ArrowLeft size={21}/></button>
     <h1 className="font-semibold text-[#1b2b41]">{def.title}</h1>
   </div>
   <div className="flex min-w-0 items-center gap-2">
     <label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-3 top-2.5 text-gray-400"/><input aria-label={"Search "+def.plural} placeholder="Search" value={search} onChange={e=>query(e.target.value)} className="h-10 w-full min-w-0 rounded-full border border-gray-100 bg-white pl-10 pr-2 text-sm"/></label>
     <button aria-label="Filter records" onClick={()=>setFiltersOpen(true)} className="rounded-full bg-white p-2.5 text-gray-500"><SlidersHorizontal size={18}/></button>
     <button aria-label="Export (preview unavailable)" onClick={()=>setNotice("Export is unavailable until real merchant records are available.")} className="flex items-center gap-1 text-xs font-medium text-[#0064E0]"><Download size={16}/>Export</button>
   </div>
   <button onClick={beginCreate} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#0064E0] px-3 py-3 text-sm font-semibold text-white"><Plus size={17}/>Create {def.title}</button>
  </div>
  <div className="min-w-0 overflow-hidden rounded-xl bg-white lg:border lg:border-gray-100 lg:shadow-sm">
   <div className="flex flex-wrap gap-1.5 px-2 py-3 lg:gap-2 lg:border-b lg:px-5 lg:py-5" aria-label={def.title+" status filters"}>
    {(["all",...def.statuses] as const).map(value=><button type="button" key={value} aria-pressed={status===value} onClick={()=>tab(value)}
      className={"rounded-full px-3 py-2 text-[11px] font-medium lg:px-4 lg:text-xs "+(status===value?"bg-blue-50 text-[#0064E0]":"bg-[#f2f2f2] text-gray-500 hover:bg-gray-100")}>
      {value==="all"?"All":statusLabels[value]}</button>)}
   </div>
   <div className="hidden items-center gap-4 border-b border-gray-100 px-5 py-4 lg:flex">
    <span className="shrink-0 text-sm font-semibold text-gray-600">{filtered.length} {def.plural}</span>
    <label className="relative min-w-0 max-w-xs flex-1"><Search size={16} className="absolute left-3 top-3 text-gray-400"/>
     <input aria-label={"Search "+def.plural} value={search} onChange={e=>query(e.target.value)} placeholder="Search" className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#0064E0]"/></label>
    <div className="ml-auto flex items-center gap-2">
     <button onClick={()=>setNotice("Export is unavailable until real merchant records are available.")} className="inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs"><Download size={16}/>Export</button>
     <button onClick={()=>setFiltersOpen(true)} className="inline-flex h-9 items-center gap-1 rounded-lg border px-3 text-xs"><SlidersHorizontal size={16}/>Filters</button>
     <button onClick={beginCreate} className="inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-full bg-[#0064E0] px-4 text-xs font-medium text-white"><Plus size={16}/>Create {def.title}</button>
    </div>
   </div>
   {notice?<div role="status" className="mx-3 mt-3 flex justify-between gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
    <span>{notice}</span><button onClick={()=>setNotice("")} aria-label="Dismiss notice"><X size={17}/></button></div>:null}
   <div className="space-y-2 p-2 lg:hidden">
    {visible.map(r=><RecordMobileCard key={r.id} record={r} onSelect={setSelected}/>)}
   </div>
   <div className="hidden min-w-0 overflow-hidden px-3 pb-2 lg:block">
    <table className="w-full table-fixed border-separate border-spacing-y-2 text-left text-[11px] xl:text-xs">
      <thead><tr className="bg-[#f3f4f7] text-gray-500">
       <th className="w-10 rounded-l-lg px-2 py-3 font-normal">Icon</th>
       {def.columns.map(({field,title})=><th key={field} className={"px-2 py-3 font-normal "+(field==="email"?"hidden xl:table-cell":"")}>{title}</th>)}
       <th className="w-8 rounded-r-lg px-1 py-3"><span className="sr-only">Options</span></th>
      </tr></thead>
      <tbody>{visible.map(r=><tr key={r.id} role="link" tabIndex={0} aria-label={"View "+r.reference}
       onClick={e=>{if(!(e.target as HTMLElement).closest("button,a"))openView(r);}}
       onKeyDown={e=>{if(e.key==="Enter"&&e.target===e.currentTarget)openView(r);}}
       className="cursor-pointer text-[#15354e] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
        <td className="rounded-l-lg bg-[#f8f8f8] px-2 py-2"><RecordTypeIcon kind={r.kind} status={r.status} size="sm"/></td>
        {def.columns.map(({field})=><td key={field} className={"truncate bg-[#f8f8f8] px-2 py-3 "+(field==="reference"?"font-medium text-[#0064E0]":field==="amount"?"font-bold":field==="date"||field==="dueDate"||field==="email"?"text-gray-500":"")+(field==="email"?" hidden xl:table-cell":"")}>
           {field==="status"?<RecordStatusBadge status={r.status}/>:tableValue(r,field)}
        </td>)}
        <td className="rounded-r-lg bg-[#f8f8f8] px-1"><button type="button" aria-label={"Actions for "+r.reference} onClick={e=>{e.stopPropagation();setSelected(r);}} className="rounded p-1 text-gray-400 hover:bg-gray-200"><MoreVertical size={17}/></button></td>
       </tr>)}</tbody>
    </table>
   </div>
   {visible.length===0?<div className="p-8 text-center text-sm text-gray-500">No {def.plural} match your filters.</div>:null}
   <div className="flex items-center justify-between border-t px-3 py-3 text-xs lg:px-5">
    <button type="button" disabled={page===1} onClick={()=>setPage(p=>p-1)} className="rounded-lg border px-3 py-2 disabled:opacity-30">← Previous</button>
    <span className="text-gray-500">Page {page} of {total}</span>
    <button type="button" disabled={page>=total} onClick={()=>setPage(p=>p+1)} className="rounded-lg border px-3 py-2 disabled:opacity-30">Next →</button>
   </div>
  </div>

  {filtersOpen?<RecordFilterDialog statuses={def.statuses} initial={filters} onClose={()=>setFiltersOpen(false)} onApply={v=>{setFilters(v);setPage(1);}}/>:null}
  {selected?<RecordActionDialog record={selected} onClose={()=>setSelected(null)} onAction={action}/>:null}
  {deleteTarget?<div role="presentation" className="fixed inset-0 z-[120] flex items-end justify-center bg-[#06192A]/60 lg:items-center lg:p-4" onClick={()=>setDeleteTarget(null)}>
   <section role="alertdialog" aria-modal="true" aria-label={"Delete "+(deleteTarget.kind==="customer"?"Customer":deleteTarget.kind==="expense"?"Expense":definitions[deleteTarget.kind].title)} onClick={e=>e.stopPropagation()} className="w-full max-w-md space-y-4 rounded-t-[28px] bg-white p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-2xl lg:rounded-2xl">
    <div className="mx-auto h-1 w-12 rounded-full bg-slate-100 lg:hidden"/>
    <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600"><Trash2 size={23}/></span>
    <div className="text-center"><h2 className="text-lg font-bold text-[#16334F]">Move to Deleted Records?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Remove <strong>{deleteTarget.reference}</strong> ({deleteTarget.title}) from the active list? It can be restored within 14 days in the proposed retention workflow.</p></div>
    <label className="block text-xs font-semibold text-[#193A57]">Reason for removal <span className="text-red-500">*</span><textarea value={deleteReason} onChange={e=>setDeleteReason(e.target.value)} placeholder="Explain why this record is being removed" rows={2} maxLength={500} className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm font-normal outline-none focus:border-[#0064E0]"/></label>
    <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">Issued documents, payment evidence and audit trails must remain preserved and reviewable. The 14-day rule never authorizes erasing financial history. This Preview keeps only temporary session state.</p>
    <button type="button" disabled={deleteReason.trim().length<5} onClick={()=>{
      const current=deleteTarget;
      setArchivedRecords(old=>old.some(x=>x.kind===current.kind&&x.id===current.id)?old:[...old,{kind:current.kind,id:current.id,reference:current.reference,title:current.title,status:current.status,archivedAt:new Date().toISOString(),reason:deleteReason.trim(),originalAmount:current.amount}]);
      setDeleteTarget(null);setPage(1);setNotice(current.reference+" moved to Deleted Records for this preview session.");
     }} className="w-full rounded-full bg-red-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">Move to Deleted Records</button>
    <button type="button" className="w-full rounded-full border border-[#0064E0] px-4 py-3 text-sm font-semibold text-[#0064E0]" onClick={()=>setDeleteTarget(null)}>Cancel</button>
   </section>
  </div>:null}
  {viewing?<RecordDetailDialog record={viewing} onClose={()=>setViewing(null)}/>:null}
 </section>;
}
