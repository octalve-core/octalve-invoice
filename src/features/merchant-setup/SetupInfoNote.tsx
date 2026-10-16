"use client";
import {useId,useState} from "react";
import {Info} from "lucide-react";

export function SetupInfoNote({title,detail}:{title:string;detail:string}){
 const [open,setOpen]=useState(false);
 const id=useId();
 return <span className="relative inline-flex shrink-0 align-middle">
  <button type="button" aria-label={"About "+title} aria-describedby={open?id:undefined} aria-expanded={open}
   onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)}
   onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)}
   onClick={()=>setOpen(v=>!v)}
   className="grid h-7 w-7 place-items-center rounded-full border border-[#D8E5F5] bg-white text-[#527AAB] transition hover:border-[#0064E0] hover:text-[#0064E0] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
   <Info size={15}/></button>
  {open?<span id={id} role="tooltip" className="absolute bottom-[calc(100%+8px)] right-0 z-50 w-[min(280px,75vw)] rounded-xl border border-[#D7E5F6] bg-[#123552] px-3 py-2.5 text-left text-xs font-normal leading-5 text-white shadow-[0_16px_40px_rgba(17,44,76,.27)]">
   <strong className="mb-1 block font-semibold">{title}</strong>{detail}
  </span>:null}
 </span>;
}
