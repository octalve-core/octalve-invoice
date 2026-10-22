"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {Search,SlidersHorizontal,MoreVertical,Eye,X,ClipboardList,UserRoundCheck,Copy,ChevronRight} from "lucide-react";
import {adminPreviewRecords,type AdminRecordKind,type AdminPreviewRecord} from "./admin-preview-data";
const titles:Record<AdminRecordKind,string>={merchants:"Merchant directory",customers:"Customer support",subscriptions:"Subscriptions",verifications:"Verification queue",support:"Support cases",staff:"Staff roles"};
const statusOptions=["All","Open","Pending","Review required","Sample active","Role example","Sample"] as const;
export function AdminDirectory({kind}:{kind:AdminRecordKind}){
 const [search,setSearch]=useState(""),[status,setStatus]=useState("All"),[filters,setFilters]=useState(false);
 const [selected,setSelected]=useState<AdminPreviewRecord|null>(null),[notice,setNotice]=useState("");
 const records=useMemo(()=>adminPreviewRecords.filter(r=>r.kind===kind&&(status==="All"||r.status===status)&&[r.id,r.name,r.detail,r.category].join(" ").toLowerCase().includes(search.toLowerCase().trim())),[kind,search,status]);
 const toDetail=(r:AdminPreviewRecord)=>"/admin/"+kind+"/"+r.id;
 const view=(r:AdminPreviewRecord)=>toDetail(r);
 return <section className="min-w-0 overflow-hidden rounded-2xl border border-[#E2EBF5] bg-white p-4 sm:p-5" aria-label={titles[kind]}>
  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
   <div><h2 className="text-sm font-bold text-[#173652]">{titles[kind]}</h2><p className="mt-1 text-xs text-slate-500">Illustrative records · No live account access</p></div>
   <span className="rounded-full bg-[#F1F6FD] px-3 py-1.5 text-xs font-semibold text-[#426C99]">{records.length} records</span>
  </div>
  <div className="mb-4 flex min-w-0 items-center gap-2">
   <label className="relative min-w-0 flex-1"><Search size={17} className="absolute left-3 top-3 text-slate-400"/>
    <input aria-label={"Search "+kind} type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or reference" className="h-11 w-full rounded-xl border border-[#DBE7F4] bg-[#FBFCFF] pl-10 pr-2 text-sm outline-none focus:border-[#0064E0]"/></label>
   <button type="button" aria-expanded={filters} onClick={()=>setFilters(x=>!x)} className="flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#D8E6F5] px-3 text-xs font-semibold text-[#0064E0]"><SlidersHorizontal size={17}/> Filters</button>
  </div>
  {filters?<div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by status">{statusOptions.filter(v=>v==="All"||adminPreviewRecords.some(r=>r.kind===kind&&r.status===v)).map(v=><button key={v} type="button" onClick={()=>setStatus(v)} aria-pressed={status===v} className={"rounded-full px-3 py-2 text-xs font-semibold "+(status===v?"bg-[#0064E0] text-white":"bg-[#F0F4F9] text-slate-600")}>{v}</button>)}</div>:null}
  {notice?<p role="status" className="mb-3 rounded-lg bg-blue-50 p-3 text-xs text-[#205684]">{notice}</p>:null}
  <div className="space-y-2">{records.map(record=><div key={record.id} className="flex min-w-0 items-center gap-2 rounded-xl border border-[#EAF0F7] bg-[#FCFDFE] p-3 hover:border-[#C7DFFB]">
   <Link href={view(record)} className="flex min-w-0 flex-1 items-center gap-3" aria-label={"View "+record.id}>
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ECF4FF] text-[#0064E0]"><ClipboardList size={18}/></span>
    <span className="min-w-0 flex-1"><span className="block break-words text-xs font-bold text-[#173652]">{record.name}</span><span className="mt-1 block break-words text-[11px] text-slate-500">{record.id} · {record.detail}</span></span>
    <span className="hidden shrink-0 rounded-full bg-[#F1F6FD] px-2 py-1 text-[10px] font-semibold text-[#426B95] sm:inline">{record.status}</span>
    <ChevronRight size={15} className="shrink-0 text-slate-400"/>
   </Link>
   <button type="button" onClick={()=>setSelected(record)} aria-label={"Actions for "+record.id} className="grid h-10 w-9 shrink-0 place-items-center rounded-lg text-[#6B8097] hover:bg-[#EDF4FD]"><MoreVertical size={18}/></button>
  </div>)}
  {records.length===0?<p className="p-8 text-center text-xs text-slate-500">No matching records.</p>:null}</div>
  {selected?<div role="presentation" className="fixed inset-0 z-[120] flex items-end justify-center bg-[#00111F]/50 p-0 lg:items-center lg:p-4" onClick={()=>setSelected(null)}>
   <section role="dialog" aria-modal="true" aria-label={"Actions for "+selected.id} onClick={e=>e.stopPropagation()} className="w-full max-w-md rounded-t-[28px] bg-white p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl lg:rounded-2xl lg:pb-5">
    <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 lg:hidden"/>
    <div className="mb-4 flex items-center justify-between"><div><h2 className="text-sm font-bold">{selected.name}</h2><p className="text-xs text-slate-500">{selected.id} · {selected.status}</p></div><button type="button" onClick={()=>setSelected(null)} aria-label="Close actions" className="rounded-lg p-2 hover:bg-slate-100"><X size={18}/></button></div>
    <Link href={view(selected)} className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#173652] hover:bg-[#EDF5FF]"><Eye size={18} className="text-[#0064E0]"/> View details</Link>
    <button type="button" onClick={()=>{void navigator.clipboard?.writeText(selected.id);setNotice("Reference copied");setSelected(null);}} className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm hover:bg-[#EDF5FF]"><Copy size={18} className="text-[#0064E0]"/> Copy reference</button>
    <button type="button" disabled className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-slate-400"><UserRoundCheck size={18}/> {kind==="staff"?"Change role":"Assign or update"} · available after secure setup</button>
   </section>
  </div>:null}
 </section>;
}
