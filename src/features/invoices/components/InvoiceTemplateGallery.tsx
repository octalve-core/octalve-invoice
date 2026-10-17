"use client";
import {CheckCircle2,LockKeyhole} from "lucide-react";

type ActiveStyle="modern"|"ledger";
type GalleryChoice={id:string;name:string;description:string;available:boolean};
const catalog:readonly GalleryChoice[]=[
 {id:"modern",name:"Octalve Modern",description:"Current modern invoice renderer",available:true},
 {id:"ledger",name:"Classic Ledger",description:"Current ledger invoice renderer",available:true},
 {id:"standard",name:"Standard",description:"Original layout planned",available:false},
 {id:"spreadsheet",name:"Spreadsheet",description:"Original detailed table planned",available:false},
 {id:"continental",name:"Continental",description:"Original formal layout planned",available:false},
 {id:"compact",name:"Compact",description:"Original condensed layout planned",available:false},
 {id:"legal",name:"Legal",description:"Awaiting supplied design",available:false}
];
export function InvoiceTemplateGallery({selected,onSelect}:{selected:ActiveStyle;onSelect:(id:ActiveStyle)=>void}){
 return <div role="group" aria-label="Invoice template gallery" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
  {catalog.map(style=>{
   const chosen=selected===style.id;
   return <button key={style.id} type="button" disabled={!style.available}
    aria-pressed={style.available?chosen:undefined}
    onClick={()=>{if(style.available)onSelect(style.id as ActiveStyle);}}
    className={"min-w-0 rounded-xl border p-2 text-left transition focus-visible:outline-2 focus-visible:outline-[#0064E0] "+(chosen?"border-[#0064E0] bg-[#F0F6FF]":"border-[#E3EBF4] bg-white")+(style.available?" hover:border-[#0064E0]":" cursor-not-allowed opacity-65")}>
    <div aria-hidden="true" className="relative flex h-24 flex-col gap-2 overflow-hidden rounded-lg border border-slate-100 bg-[#FAFBFE] px-3 py-3">
      <div className={"h-2 w-1/2 rounded-full "+(style.id==="ledger"?"bg-slate-700":"bg-[#0064E0]/30")}/>
      <div className="h-1.5 w-4/5 rounded-full bg-slate-200"/>
      <div className={"mt-1 h-5 rounded "+(style.id==="ledger"?"bg-slate-700":"bg-[#DCEAFF]")}/>
      <div className="h-1.5 w-full rounded-full bg-slate-200"/>
      {chosen?<CheckCircle2 size={17} className="absolute right-2 top-2 text-[#0064E0]"/>:!style.available?<LockKeyhole size={15} className="absolute right-2 top-2 text-slate-500"/>:null}
    </div>
    <span className="mt-2 block truncate text-[11px] font-semibold text-[#173652]">{style.name}</span>
    <span className="mt-1 block text-[10px] leading-4 text-slate-500">{style.available?style.description:style.id==="legal"?"Your artwork is required":"Coming later"}</span>
   </button>;
  })}
 </div>;
}
