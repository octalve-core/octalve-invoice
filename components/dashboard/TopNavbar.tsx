"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Search,Bell,MessageSquare,ChevronDown,UserRound,Settings} from "lucide-react";
import {UserAvatar} from "@/src/features/merchant-preview/UserAvatar";
import {PreviewLogoutButton} from "@/src/features/merchant-preview/PreviewLogoutButton";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
export default function TopNavbar(){
 const router=useRouter();
 const {user,readNotificationIds}=useMerchantPreview();
 const [open,setOpen]=useState(false),[query,setQuery]=useState("");
 const destinations=[
  {label:"Overview",href:"/dashboard"},{label:"Invoice",href:"/dashboard/invoice"},
  {label:"Receipt",href:"/dashboard/receipt"},{label:"Quotation",href:"/dashboard/quotation"},
  {label:"Expenses",href:"/dashboard/expenses"},{label:"Customers",href:"/dashboard/customer"},
  {label:"Payment Received",href:"/dashboard/payment-received"},
  {label:"Credit notes",href:"/dashboard/credit-note"},{label:"Other Services",href:"/dashboard/other-services"},
  {label:"Settings",href:"/dashboard/settings"}
 ];
 const matches=query.trim()?destinations.filter(item=>item.label.toLowerCase().includes(query.toLowerCase().trim())).slice(0,6):[];
 return <header className="sticky top-0 z-40 hidden h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 lg:flex lg:px-6">
  <div className="relative min-w-0 w-full max-w-md">
   <label className="relative block"><Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
    <input type="search" aria-label="Find a workspace page" value={query} onChange={e=>setQuery(e.target.value)}
     onKeyDown={e=>{if(e.key==="Escape")setQuery("");if(e.key==="Enter"&&matches[0]){router.push(matches[0].href);setQuery("");}}}
     placeholder="Find a page" className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-[#0064E0]"/>
   </label>
   {matches.length>0?<div role="navigation" aria-label="Workspace search results" className="absolute inset-x-0 top-11 z-50 rounded-xl border border-[#E0EAF4] bg-white p-2 shadow-lg">
    {matches.map(item=><Link key={item.href} href={item.href} onClick={()=>setQuery("")} className="block rounded-lg px-3 py-2 text-xs font-semibold text-[#1B3D5A] hover:bg-[#EAF3FF]">{item.label}</Link>)}
   </div>:null}
  </div>
  <div className="flex shrink-0 items-center gap-2">
   <Link href="/dashboard/insights-support" aria-label="Business Insights and Octalve Support" title="Insights and Support" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><MessageSquare size={20}/></Link>
   <Link href="/dashboard/notifications" aria-label="Notifications" title="Notifications" className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"><Bell size={20}/>{readNotificationIds.length<4?<span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#0064E0]"/>:null}</Link>
   <div className="relative ml-2 border-l pl-3">
    <button type="button" onClick={()=>setOpen(v=>!v)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
      className="flex items-center gap-2 rounded-lg p-1 text-left hover:bg-gray-50">
      <UserAvatar size="sm"/><span className="max-w-[150px] truncate text-sm font-semibold text-gray-900">{user.fullName||"Preview User"}</span><ChevronDown size={14}/></button>
    {open?<div role="menu" className="absolute right-0 top-12 z-50 w-56 rounded-xl border bg-white p-2 shadow-xl">
      <p className="px-3 py-2 text-xs text-gray-500">Preview workspace · no live session</p>
      <Link role="menuitem" href="/dashboard/settings/profile" onClick={()=>setOpen(false)} className="flex gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"><UserRound size={17}/>Profile Settings</Link>
      <Link role="menuitem" href="/workspaces" onClick={()=>setOpen(false)} className="flex gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"><Settings size={17}/> Switch workspace</Link>
      <Link role="menuitem" href="/dashboard/settings" onClick={()=>setOpen(false)} className="flex gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"><Settings size={17}/>Settings</Link>
      <PreviewLogoutButton className="w-full rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"/>
     </div>:null}
   </div>
  </div>
 </header>;
}
