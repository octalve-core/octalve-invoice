"use client";
import {useId,useState} from "react";
import {createPortal} from "react-dom";
import {Info,X} from "lucide-react";

/** Shared compact note: desktop tooltip on hover/focus; touch-friendly bottom sheet.
 * Mobile sheet is portalled to the document root, avoiding clipping inside narrow cards.
 */
export function SetupInfoNote({title,detail}:{title:string;detail:string}){
 const id=useId();
 const [hover,setHover]=useState(false);
 const [portal,setPortal]=useState<HTMLElement|null>(null);
 const openMobile=()=>{setHover(false);setPortal(document.body);};
 const close=()=>setPortal(null);
 return <span className="relative inline-flex shrink-0 align-middle">
  <button type="button" aria-label={"About "+title} aria-expanded={Boolean(hover||portal)}
   aria-describedby={hover&&!portal?id:undefined}
   onMouseEnter={()=>{if(!window.matchMedia("(max-width: 639px)").matches)setHover(true);}}
   onMouseLeave={()=>setHover(false)}
   onFocus={()=>{if(!window.matchMedia("(max-width: 639px)").matches)setHover(true);}}
   onBlur={()=>setHover(false)}
   onClick={()=>{if(window.matchMedia("(max-width: 639px)").matches)openMobile();else setHover(v=>!v);}}
   onKeyDown={e=>{if(e.key==="Escape"){setHover(false);close();}}}
   className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#D8E5F5] bg-white text-[#527AAB] transition hover:border-[#0064E0] hover:text-[#0064E0] focus-visible:outline-2 focus-visible:outline-[#0064E0] sm:h-7 sm:w-7">
   <Info size={15}/></button>
  {hover&&!portal?<span id={id} role="tooltip" className="absolute bottom-[calc(100%+8px)] right-0 z-50 hidden w-[min(280px,75vw)] rounded-xl border border-[#D7E5F6] bg-[#123552] px-3 py-2.5 text-left text-xs font-normal leading-5 text-white shadow-[0_16px_40px_rgba(17,44,76,.27)] sm:block">
   <strong className="mb-1 block font-semibold">{title}</strong>{detail}
  </span>:null}
  {portal?createPortal(<div className="fixed inset-0 z-[200] flex items-end justify-center bg-[#001020]/60 sm:items-center sm:p-4" onMouseDown={e=>{if(e.target===e.currentTarget)close();}}>
   <section role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-sm rounded-t-3xl bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 shadow-2xl sm:rounded-2xl">
    <div className="flex items-center justify-between gap-3"><h2 className="text-base font-semibold text-[#173652]">{title}</h2><button type="button" onClick={close} aria-label={"Close "+title} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100"><X size={18}/></button></div>
    <p className="mt-3 text-sm leading-6 text-[#38516D]">{detail}</p>
    <button type="button" onClick={close} className="mt-5 min-h-11 w-full rounded-full bg-[#0064E0] px-4 text-sm font-semibold text-white">Got it</button>
   </section>
  </div>,portal):null}
 </span>;
}
