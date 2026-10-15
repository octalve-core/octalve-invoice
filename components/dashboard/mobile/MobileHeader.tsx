"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Bell} from "lucide-react";
import {BrandIcon} from "@/src/shared/ui/BrandIcon";
export default function MobileHeader({userName="Abdulsamad"}:{userName?:string;onMenuClick?:()=>void}){
 const pathname=usePathname();
 const gettingStarted=pathname.startsWith("/dashboard/getting-started");
 return <header className="sticky top-0 z-40 bg-[#0052B8] text-white lg:hidden">
  <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
   <div className="flex min-w-0 items-center gap-3">
    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-white/10">
      <BrandIcon size={38}/>
    </span>
    <span className="min-w-0"><span className="block text-xs font-normal text-white/80">Good afternoon,</span>
      <span className="block truncate text-lg font-semibold leading-tight">{userName}</span></span>
   </div>
   <button type="button" aria-label="Notifications" title="Notifications (coming later)"
    className="rounded-full p-2 hover:bg-white/15"><Bell size={23}/></button>
  </div>
  <nav aria-label="Dashboard sections" className="px-4 pb-4">
   <div className="grid grid-cols-2 gap-1 rounded-full border border-white/85 bg-white p-1">
    <Link href="/dashboard" aria-current={!gettingStarted?"page":undefined}
      className={`min-w-0 rounded-full px-2 py-2 text-center text-xs font-semibold sm:text-sm ${!gettingStarted?"bg-[#0064E0] text-white":"text-[#18253b]"}`}>Dashboard</Link>
    <Link href="/dashboard/getting-started" aria-current={gettingStarted?"page":undefined}
      className={`min-w-0 rounded-full px-2 py-2 text-center text-xs font-semibold sm:text-sm ${gettingStarted?"bg-[#0064E0] text-white":"text-[#18253b]"}`}>Getting Started</Link>
   </div>
  </nav>
 </header>;
}
