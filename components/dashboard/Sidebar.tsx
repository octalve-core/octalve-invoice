"use client";

import {useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {BrandWordmark} from "@/src/shared/ui/BrandWordmark";
import {PreviewLogoutButton} from "@/src/features/merchant-preview/PreviewLogoutButton";
import {
 LayoutDashboard,FileText,Receipt,FileSpreadsheet,Wallet,Users,Package,
 RefreshCcw,CreditCard,FileMinus,MoreHorizontal,Settings,
 ChevronRight,ChevronDown,Sparkles,ArrowUpRight
} from "lucide-react";
import type {ElementType} from "react";

interface NavItem {label:string;href:string;icon:ElementType;}
const navItems:NavItem[]=[
 {label:"Overview",href:"/dashboard",icon:LayoutDashboard},
 {label:"Invoice",href:"/dashboard/invoice",icon:FileText},
 {label:"Receipt",href:"/dashboard/receipt",icon:Receipt},
 {label:"Quotation",href:"/dashboard/quotation",icon:FileSpreadsheet},
 {label:"Expenses",href:"/dashboard/expenses",icon:Wallet},
 {label:"Customer",href:"/dashboard/customer",icon:Users},
 {label:"Items",href:"/dashboard/items",icon:Package},
 {label:"Recurring Expense",href:"/dashboard/recurring-expense",icon:RefreshCcw},
 {label:"Payment Received",href:"/dashboard/payment-received",icon:CreditCard},
 {label:"Credit note",href:"/dashboard/credit-note",icon:FileMinus},
 {label:"Other Services",href:"/dashboard/other-services",icon:MoreHorizontal},
 {label:"Settings",href:"/dashboard/settings",icon:Settings}
];
function activeRoute(pathname:string,href:string){
 if(href==="/dashboard")return pathname==="/dashboard";
 if(href==="/dashboard/other-services")return pathname.startsWith(href)||
  pathname.startsWith("/dashboard/finance/")||
  (pathname==="/dashboard/recurring"||pathname.startsWith("/dashboard/recurring/"))||
  pathname.startsWith("/dashboard/tax-centre")||
  pathname.startsWith("/dashboard/insights-support")||
  pathname.startsWith("/dashboard/staff")||
  pathname.startsWith("/dashboard/report");
 if(href==="/dashboard/settings")return pathname.startsWith(href)&&!pathname.startsWith(href+"/subscription");
 return pathname===href||pathname.startsWith(href+"/");
}

export default function Sidebar(){
 const pathname=usePathname();
 const [isGettingStartedOpen,setIsGettingStartedOpen]=useState(true);
 return (
  <aside aria-label="Desktop workspace sidebar"
   className="hidden w-64 shrink-0 flex-col bg-[#000A16] text-white lg:flex lg:h-dvh lg:min-h-0 lg:overflow-hidden">
   {/* Keep the original approved Octalve PNG intact and legible. */}
   <div className="flex h-16 shrink-0 items-center border-b border-slate-100 bg-white px-5">
    <Link href="/dashboard" aria-label="Octalve dashboard" className="inline-flex items-center rounded-lg focus-visible:outline-2 focus-visible:outline-[#0064E0]">
     <BrandWordmark width={164}/>
    </Link>
   </div>

   <div className="shrink-0 px-3 pb-3 pt-4">
    <button type="button" aria-expanded={isGettingStartedOpen} aria-controls="desktop-getting-started"
      onClick={()=>setIsGettingStartedOpen(v=>!v)}
      className="flex w-full items-center justify-between rounded-xl border border-white/[.08] bg-white/[.06] px-3 py-2.5 text-left text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[.1] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
      <span>Getting started</span>
      {isGettingStartedOpen?<ChevronDown size={16}/>:<ChevronRight size={16}/>}
    </button>
    {isGettingStartedOpen?
     <div id="desktop-getting-started" className="pt-2">
      <Link href="/dashboard/getting-started" aria-current={pathname.startsWith("/dashboard/getting-started")?"page":undefined}
       className={`block rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-white/[.12] focus-visible:outline-2 focus-visible:outline-[#0064E0] ${pathname.startsWith("/dashboard/getting-started")?"bg-[#0064E0] text-white":"bg-white/[.06] text-slate-300"}`}>
       Open setup checklist <span aria-hidden="true">→</span>
      </Link>
     </div>:null}
   </div>

   <nav aria-label="Desktop main navigation" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[.17em] text-slate-500">Main menu</p>
    <ul className="space-y-1">
     {navItems.map(item=>{
      const isActive=activeRoute(pathname,item.href);
      const Icon=item.icon;
      return <li key={item.href}>
       <Link href={item.href} aria-current={isActive?"page":undefined}
        className={`flex min-h-10 items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#66A9FF] ${isActive?"bg-[#0064E0] text-white shadow-[0_6px_16px_rgba(0,100,224,.22)]":"text-[#B9C7D7] hover:bg-white/[.09] hover:text-white"}`}>
        <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={isActive?2.2:1.8}/>
        <span className="min-w-0 flex-1">{item.label}</span>
       </Link>
      </li>;
     })}
    </ul>
   </nav>

   <footer aria-label="Sidebar account and billing" className="shrink-0 space-y-2 border-t border-white/[.09] bg-[#000A16] px-3 pb-4 pt-3">
    <Link href="/dashboard/settings/subscription" aria-current={pathname.startsWith("/dashboard/settings/subscription")?"page":undefined}
      className={`flex min-h-[62px] items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-[#66A9FF] ${pathname.startsWith("/dashboard/settings/subscription")?"border-[#0064E0] bg-[#0064E0]":"border-[#224063] bg-[#0C1B2C] hover:border-[#356694] hover:bg-[#132A43]"}`}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0064E0]/20 text-[#8EBFFF]"><Sparkles size={18}/></span>
      <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-white">Subscription</span><span className="mt-0.5 block text-[11px] text-[#B3C5D9]">Review plans</span></span>
      <ArrowUpRight size={16} className="shrink-0 text-[#B3C5D9]"/>
    </Link>
    <PreviewLogoutButton className="flex min-h-10 w-full justify-start rounded-xl border border-transparent px-3 py-2 text-[13px] font-medium text-[#E0E7EF] transition-colors hover:border-white/[.08] hover:bg-white/[.08] focus-visible:outline-2 focus-visible:outline-[#66A9FF]"/>
   </footer>
  </aside>
 );
}
