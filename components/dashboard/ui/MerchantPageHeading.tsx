import type {ReactNode} from "react";

/** One merchant content-header contract. The global navigation and its page-finder
 * live exclusively in (dashboard)/layout.tsx -> TopNavbar; local record searches
 * stay within their feature workspaces and never share the page-finder state.
 */
export function MerchantPageHeading({
 title,description,eyebrow,actions,hideOnMobile=false,tone="default",
}:{
 title:string;description:string;eyebrow?:string;actions?:ReactNode;
 hideOnMobile?:boolean;tone?:"default"|"inverse";
}){
 const inverse=tone==="inverse";
 return <header data-merchant-page-heading className={
  "w-full min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-3 "+
  (hideOnMobile?"hidden lg:flex":"flex")
 }>
  <div className="min-w-0 flex-1">
   {eyebrow?<p className={"mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] "+(inverse?"text-blue-100":"text-[#0064E0]")}>{eyebrow}</p>:null}
   <h1 className={"text-xl font-bold tracking-tight leading-7 sm:text-2xl "+(inverse?"text-white":"text-[#173652]")}>{title}</h1>
   <p className={"mt-1 text-[13px] leading-5 "+(inverse?"text-blue-100":"text-[#72859A]")}>{description}</p>
  </div>
  {actions?<div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2">{actions}</div>:null}
 </header>;
}
