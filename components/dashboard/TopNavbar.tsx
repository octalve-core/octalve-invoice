"use client";
import {useState} from "react";
import Link from "next/link";
import {Search,Bell,MessageSquare,ChevronDown,UserRound,Settings} from "lucide-react";
import {UserAvatar} from "@/src/features/merchant-preview/UserAvatar";
import {PreviewLogoutButton} from "@/src/features/merchant-preview/PreviewLogoutButton";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
export default function TopNavbar(){
 const {user}=useMerchantPreview(),[open,setOpen]=useState(false);
 return <header className="sticky top-0 z-40 hidden h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 lg:flex lg:px-6">
  <label className="relative block w-full max-w-md"><Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
   <input type="search" aria-label="Search workspace preview" placeholder="Search here..." className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm" /></label>
  <div className="flex items-center gap-2">
   <button type="button" aria-label="Messages (coming later)" title="Messages (coming later)" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><MessageSquare size={20}/></button>
   <button type="button" aria-label="Notifications (coming later)" title="Notifications (coming later)" className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"><Bell size={20}/></button>
   <div className="relative ml-2 border-l pl-3">
    <button type="button" onClick={()=>setOpen(v=>!v)} aria-haspopup="menu" aria-expanded={open} aria-label="Account menu"
      className="flex items-center gap-2 rounded-lg p-1 text-left hover:bg-gray-50">
      <UserAvatar size="sm"/><span className="max-w-[150px] truncate text-sm font-semibold text-gray-900">{user.fullName||"Preview User"}</span><ChevronDown size={14}/></button>
    {open?<div role="menu" className="absolute right-0 top-12 z-50 w-56 rounded-xl border bg-white p-2 shadow-xl">
      <p className="px-3 py-2 text-xs text-gray-500">Preview workspace · no live session</p>
      <Link role="menuitem" href="/dashboard/settings/profile" onClick={()=>setOpen(false)} className="flex gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"><UserRound size={17}/>Profile Settings</Link>
      <Link role="menuitem" href="/dashboard/settings" onClick={()=>setOpen(false)} className="flex gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"><Settings size={17}/>Settings</Link>
      <PreviewLogoutButton className="w-full rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"/>
     </div>:null}
   </div>
  </div>
 </header>;
}
