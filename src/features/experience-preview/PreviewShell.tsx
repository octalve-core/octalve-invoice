"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {
 LayoutDashboard,FileText,ReceiptText,WalletCards,Store,MessageSquare,Bell,
 Settings,ShieldCheck,UsersRound,BadgeCheck,LifeBuoy,Megaphone,
 UserCog,Activity,ClipboardList,ArrowLeftRight,ChevronRight,MoreHorizontal
} from "lucide-react";
import type {ReactNode} from "react";
import {BrandWordmark} from "@/src/shared/ui/BrandWordmark";

export type Experience="customer"|"admin";
type IconName="overview"|"invoices"|"receipts"|"payments"|"merchants"|"messages"|"notifications"|"settings"|"security"|"customers"|"verification"|"support"|"updates"|"staff"|"audit"|"subscriptions"|"operations";
export type PreviewNavigation={label:string;path:string;icon:IconName};
const icons={
 overview:LayoutDashboard,invoices:FileText,receipts:ReceiptText,payments:WalletCards,
 merchants:Store,messages:MessageSquare,notifications:Bell,settings:Settings,
 security:ShieldCheck,customers:UsersRound,verification:BadgeCheck,
 support:LifeBuoy,updates:Megaphone,staff:UserCog,audit:ClipboardList,
 subscriptions:ArrowLeftRight,operations:Activity
} satisfies Record<IconName,typeof LayoutDashboard>;
export const customerNavigation:PreviewNavigation[]=[
 {label:"Overview",path:"/customer",icon:"overview"},
 {label:"Invoices",path:"/customer/invoices",icon:"invoices"},
 {label:"Payments",path:"/customer/payments",icon:"payments"},
 {label:"Receipts",path:"/customer/receipts",icon:"receipts"},
 {label:"Merchants",path:"/customer/merchants",icon:"merchants"},
 {label:"Messages",path:"/customer/messages",icon:"messages"},
 {label:"Notifications",path:"/customer/notifications",icon:"notifications"},
 {label:"Settings",path:"/customer/settings",icon:"settings"},
];
export const adminNavigation:PreviewNavigation[]=[
 {label:"Overview",path:"/admin",icon:"overview"},
 {label:"Merchants",path:"/admin/merchants",icon:"merchants"},
 {label:"Customers",path:"/admin/customers",icon:"customers"},
 {label:"Subscriptions",path:"/admin/subscriptions",icon:"subscriptions"},
 {label:"Verifications",path:"/admin/verifications",icon:"verification"},
 {label:"Support",path:"/admin/support",icon:"support"},
 {label:"Notifications",path:"/admin/notifications",icon:"notifications"},
 {label:"Updates",path:"/admin/updates",icon:"updates"},
 {label:"Staff",path:"/admin/staff",icon:"staff"},
 {label:"Security",path:"/admin/security",icon:"security"},
 {label:"Audit",path:"/admin/audit",icon:"audit"},
];
export function PreviewShell({experience,children}:{experience:Experience;children:ReactNode}){
 const path=usePathname();
 const navigation=experience==="customer"?customerNavigation:adminNavigation;
 const label=experience==="customer"?"Customer workspace":"Octalve operations";
 const highlighted=(x:PreviewNavigation)=>path===x.path||(x.path!=="/"+experience&&path.startsWith(x.path+"/"));
 const mobile=experience==="customer"
  ?[customerNavigation[0],customerNavigation[1],customerNavigation[2],customerNavigation[3]]
  :[adminNavigation[0],adminNavigation[1],adminNavigation[5],adminNavigation[3]];
 const morePath="/"+experience+"/more";
 const isMore=path===morePath||navigation.some(item=>!mobile.some(m=>m.path===item.path)&&highlighted(item));
 return <div className="flex min-h-dvh min-w-0 bg-[#F7F9FC] text-[#18364F] lg:h-dvh lg:overflow-hidden">
  <aside aria-label={label+" navigation"} className="sticky top-0 hidden h-dvh w-[244px] shrink-0 flex-col bg-[#000A16] text-white lg:flex">
   <div className="shrink-0 border-b border-white/10">
    <Link href="/workspaces" className="flex h-16 items-center bg-white px-4" aria-label="Octalve Finance workspaces"><BrandWordmark width={132}/></Link>
    <p className="px-4 pb-3 pt-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7890A9]">{label}</p>
   </div>
   <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    {navigation.map(item=>{const Icon=icons[item.icon];return <Link key={item.path} href={item.path} aria-current={highlighted(item)?"page":undefined}
     className={"flex min-h-11 items-center gap-3 rounded-xl px-3 text-xs font-semibold transition-colors "+
       (highlighted(item)?"bg-[#0064E0] text-white":"text-[#BECDDE] hover:bg-white/10 hover:text-white")}>
     <Icon size={18}/><span>{item.label}</span>{highlighted(item)?<ChevronRight className="ml-auto" size={15}/>:null}
    </Link>})}
   </nav>
   <div className="border-t border-white/10 px-4 py-4">
    <Link href="/workspaces" className="flex items-center gap-2 rounded-xl border border-[#2C4764] px-3 py-3 text-xs text-[#C9DCEF] hover:bg-white/10">
     <ArrowLeftRight size={16}/> Other workspaces
    </Link>
   </div>
  </aside>
  <div className="flex min-h-dvh min-w-0 flex-1 flex-col lg:h-full lg:min-h-0 lg:overflow-y-auto">
   <header className="sticky top-0 z-20 flex min-h-[64px] items-center justify-between gap-3 border-b border-[#E5EDF6] bg-white px-4 sm:px-6">
    <Link href={"/"+experience} className="inline-flex min-w-0 items-center gap-2 lg:hidden"><BrandWordmark width={102}/><span className="border-l border-slate-200 pl-2 text-[10px] text-[#6A8098]">{experience==="customer"?"Customer":"Admin"}</span></Link>
    <span className="hidden text-xs font-semibold text-[#4B6680] lg:block">{label}</span>
    <div className="flex items-center gap-2">
     <span className="rounded-full border border-[#E2EAF4] bg-[#F6F9FE] px-3 py-1.5 text-[11px] font-semibold text-[#526B83]">Sample workspace</span>
     <Link href="/workspaces" className="rounded-xl border border-[#DDE8F6] p-2 text-[#0064E0] lg:hidden" aria-label="Change workspace"><ArrowLeftRight size={18}/></Link>
    </div>
   </header>
   <main className="mx-auto w-full max-w-[1480px] flex-1 min-w-0 space-y-5 px-4 pb-28 pt-5 sm:px-6 lg:pb-10 lg:pt-7">
    {children}
   </main>
   <nav aria-label={label+" mobile navigation"} className="fixed inset-x-0 bottom-0 z-30 grid h-[calc(68px+env(safe-area-inset-bottom))] grid-cols-5 border-t border-[#E0EAF5] bg-white px-1 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_18px_rgba(13,43,75,0.06)] lg:hidden">
    {mobile.map(item=>{const Icon=icons[item.icon];return <Link href={item.path} key={item.path} aria-current={highlighted(item)?"page":undefined}
     className={"flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold "+
      (highlighted(item)?"text-[#0064E0]":"text-[#6B8299]")}><Icon size={20}/><span className="max-w-full truncate">{item.label}</span></Link>})}
    <Link href={morePath} aria-current={isMore?"page":undefined} className={"flex min-w-0 flex-col items-center justify-center gap-1 px-1 text-[10px] font-semibold "+(isMore?"text-[#0064E0]":"text-[#6B8299]")}><MoreHorizontal size={21}/><span>More</span></Link>
   </nav>
  </div>
 </div>;
}
