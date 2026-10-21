"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {Search,ChevronRight,ArrowLeftRight} from "lucide-react";
import {adminNavigation,customerNavigation,type Experience} from "./PreviewShell";
export function ExperienceMore({experience}:{experience:Experience}){
 const [search,setSearch]=useState("");
 const navigation=experience==="customer"?customerNavigation:adminNavigation;
 const primary=experience==="customer"?["/customer","/customer/invoices","/customer/payments","/customer/receipts"]:
 ["/admin","/admin/merchants","/admin/support","/admin/subscriptions"];
 const others=useMemo(()=>navigation.filter(n=>!primary.includes(n.path)&&n.label.toLowerCase().includes(search.trim().toLowerCase())),[navigation,search]);
 return <section className="space-y-4">
  <header><p className="text-xs font-semibold text-[#0064E0]">{experience==="customer"?"Customer workspace":"Octalve operations"}</p>
   <h1 className="mt-1 text-2xl font-bold text-[#173652]">More</h1><p className="mt-1 text-xs text-slate-500">Everything else in your workspace</p></header>
  <div className="rounded-2xl border border-[#E0EAF5] bg-white p-4 sm:p-6">
   <label className="relative block max-w-xl"><Search size={18} className="absolute left-3 top-3 text-slate-400"/>
    <input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Find workspace page" placeholder="Find a page" className="h-11 w-full rounded-xl border border-[#DCE8F5] bg-[#F8FBFF] pl-10 pr-3 text-sm outline-none focus:border-[#0064E0]"/></label>
   <nav aria-label="Additional workspace pages" className="mt-4 grid gap-2 sm:grid-cols-2">{others.map(item=><Link key={item.path} href={item.path}
    className="flex min-h-14 items-center gap-3 rounded-xl border border-[#E9EFF7] px-4 py-3 text-sm font-semibold text-[#173652] hover:border-[#B5D6FF] hover:bg-[#F5FAFF]">
    <span className="min-w-0 flex-1">{item.label}</span><ChevronRight size={18} className="text-[#0064E0]"/></Link>)}
    {others.length===0?<p className="py-5 text-xs text-slate-500">No matching page.</p>:null}
   </nav>
  </div>
  <Link href="/workspaces" className="inline-flex items-center gap-2 text-xs font-semibold text-[#0064E0]"><ArrowLeftRight size={16}/> Switch workspace</Link>
 </section>;
}
