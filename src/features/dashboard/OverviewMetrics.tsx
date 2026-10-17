"use client";
import {ArrowDownRight,ArrowUpRight,Minus} from "lucide-react";
import {SetupInfoNote} from "@/src/features/merchant-setup/SetupInfoNote";

/** Example-only metrics. Actual business aggregates MUST be supplied by an authenticated
 * tenant-isolated payment/invoice ledger after Phase 1 approval. Never treat these as earnings.
 */
export const overviewExampleMetrics=[
 {id:"current",title:"Current invoices",amount:506000,prior:500000,favourableWhenUp:true},
 {id:"inflow",title:"Total inflow",amount:506000,prior:550000,favourableWhenUp:true},
 {id:"overdue",title:"Overdue invoices",amount:0,prior:20000,favourableWhenUp:false},
 {id:"outflow",title:"Total outflow",amount:240000,prior:200000,favourableWhenUp:false}
] as const;

export function overviewChange(current:number,previous:number){
 if(previous===0)return current===0?0:null;
 return Math.round(((current-previous)/Math.abs(previous))*10)/10;
}
const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:2,maximumFractionDigits:2}).format(n);

export function OverviewMetrics(){
 return <section aria-label="Business overview summary" className="space-y-3">
  <header className="flex items-center justify-between gap-3">
   <h2 className="text-sm font-semibold text-[#173652]">Financial overview</h2>
   <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">Example <SetupInfoNote title="Example figures" detail="These numbers and their month-on-month changes show how your overview will work. They are not verified transactions or business records. Real figures will replace them when your secure workspace is connected."/></span>
  </header>
  <div className="grid grid-cols-2 gap-2 md:gap-3 xl:grid-cols-4">
   {overviewExampleMetrics.map(row=>{
    const change=overviewChange(row.amount,row.prior);
    const up=change!==null&&change>0,down=change!==null&&change<0;
    const favourable=change===null?null:change===0?null:row.favourableWhenUp?up:down;
    return <article key={row.id} className="min-w-0 rounded-2xl border border-[#E8EEF7] bg-white p-3 shadow-[0_7px_22px_rgba(16,44,82,.055)] sm:p-4">
     <p className="text-[11px] font-medium text-[#66788E] sm:text-xs">{row.title}</p>
     <p className="mt-2 break-words text-[15px] font-bold tracking-tight text-[#183652] sm:text-xl">{money(row.amount)}</p>
     <div className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-0.5">
      <span className={"inline-flex items-center gap-0.5 text-[11px] font-semibold "+(favourable===true?"text-emerald-600":favourable===false?"text-rose-600":"text-slate-500")}>
       {up?<ArrowUpRight size={13}/>:down?<ArrowDownRight size={13}/>:<Minus size={13}/>}
       {change===null?"—":Math.abs(change).toLocaleString("en-NG",{maximumFractionDigits:1})+"%"}
      </span>
      <span className="text-[10px] text-slate-500">vs last month</span>
     </div>
    </article>;
   })}
  </div>
 </section>;
}
