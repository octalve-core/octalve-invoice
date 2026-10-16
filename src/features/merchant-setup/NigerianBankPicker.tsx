"use client";
import {useEffect,useId,useMemo,useRef,useState} from "react";
import {Check,ChevronDown,Search} from "lucide-react";

/** Curated discovery list, not a complete bank directory and not a source of verification codes.
 * The exhaustive provider-supported directory and account resolution belong on the authorized server.
 * Avoid storing guessed financial network bank codes.
 */
export const previewBankSuggestions = [
 "Access Bank","Alternative Bank","Ecobank Nigeria",
 "Fidelity Bank","First Bank of Nigeria","First City Monument Bank (FCMB)",
 "Globus Bank","Guaranty Trust Bank (GTBank)","Keystone Bank","Lotus Bank",
 "Nova Bank","Optimus Bank","Parallex Bank","Polaris Bank","PremiumTrust Bank",
 "Providus Bank","Signature Bank","Stanbic IBTC Bank","Standard Chartered Bank",
 "Sterling Bank","SunTrust Bank","TajBank","Titan Trust Bank","Union Bank",
 "United Bank for Africa (UBA)","Unity Bank","Wema Bank","Zenith Bank",
 "Kuda Microfinance Bank","Moniepoint Microfinance Bank","OPay","PalmPay",
 "Rubies Microfinance Bank","VFD Microfinance Bank","FairMoney Microfinance Bank",
 "Sparkle Microfinance Bank","Carbon Microfinance Bank","Mintyn Microfinance Bank",
 "Paga","Hope Payment Service Bank",
 "9 Payment Service Bank","MoMo Payment Service Bank","SmartCash Payment Service Bank"
] as const;

export function NigerianBankPicker({value,onChange}:{value:string;onChange:(bank:string)=>void}){
 const [query,setQuery]=useState(value);
 const [open,setOpen]=useState(false);
 const [active,setActive]=useState(0);
 const [touched,setTouched]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const id=useId();
 const filtered=useMemo(()=>previewBankSuggestions.filter(b=>b.toLowerCase().includes(query.trim().toLowerCase())).slice(0,35),[query]);
 useEffect(()=>{if(!open)setQuery(value);},[value,open]);
 useEffect(()=>{
  if(!open)return;
  const onPointerDown=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node)){setOpen(false);setQuery(value);}};
  document.addEventListener("pointerdown",onPointerDown);
  return ()=>document.removeEventListener("pointerdown",onPointerDown);
 },[open,value]);
 const choose=(bank:string)=>{onChange(bank);setQuery(bank);setOpen(false);setTouched(true);};
 return <div ref={root} className="relative min-w-0">
  <label htmlFor={id} className="block text-xs font-semibold text-[#314761]">Bank name</label>
  <div className="relative mt-1.5">
   <Search aria-hidden="true" size={17} className="pointer-events-none absolute left-3 top-3.5 text-slate-400"/>
   <input id={id} role="combobox" autoComplete="off" aria-autocomplete="list" aria-controls={id+"-options"} aria-expanded={open}
    aria-activedescendant={open&&filtered[active]?id+"-option-"+active:undefined}
    value={query} placeholder="Search banks or fintechs" onFocus={()=>{setOpen(true);setActive(0);}}
    onChange={e=>{setQuery(e.target.value);setActive(0);setOpen(true);setTouched(false);if(value)onChange("");}}
    onKeyDown={e=>{
     if(e.key==="ArrowDown"){e.preventDefault();setOpen(true);setActive(a=>Math.max(0,Math.min(a+1,filtered.length-1)));}
     if(e.key==="ArrowUp"){e.preventDefault();setActive(a=>Math.max(a-1,0));}
     if(e.key==="Escape"){setOpen(false);setQuery(value);}
     if(e.key==="Enter"&&open){e.preventDefault();if(filtered[active])choose(filtered[active]);}
    }}
    className="h-11 w-full min-w-0 rounded-xl border border-[#D7E2EF] bg-white py-2 pl-10 pr-10 text-sm text-[#173652] outline-none focus:border-[#0064E0] focus:ring-2 focus:ring-[#0064E0]/10"/>
   <button type="button" aria-label="Show bank options" onClick={()=>setOpen(x=>!x)} className="absolute right-1 top-1 h-9 w-9 rounded-lg text-[#6B7F97] hover:bg-slate-50"><ChevronDown size={18} className="mx-auto"/></button>
  </div>
  {open?<div id={id+"-options"} role="listbox" aria-label="Suggested Nigerian institutions" className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-[#DBE6F3] bg-white p-1.5 shadow-[0_20px_50px_rgba(20,48,89,.17)]">
   {filtered.length?filtered.map((bank,i)=><button key={bank} id={id+"-option-"+i} role="option" aria-selected={value===bank} type="button"
    onMouseEnter={()=>setActive(i)} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(bank)}
    className={"flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-xs "+(i===active?"bg-[#EEF5FF] text-[#0052B8]":"text-[#29445D] hover:bg-slate-50")}>
     {bank}{value===bank?<Check size={15}/>:null}</button>):
     <div className="p-3 text-xs text-slate-600">No match in the current suggestions. More institutions will be available with live bank lookup.</div>}
  </div>:null}
  <p className="mt-1 text-[11px] text-slate-500">{touched&&value?"Bank selected — account not verified":"Suggestions only; full live bank list follows secure connection."}</p>
 </div>;
}
