"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Bell} from "lucide-react";
import {UserAvatar} from "@/src/features/merchant-preview/UserAvatar";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
export default function MobileHeader(){
 const pathname=usePathname();
 const showDashboardHeader=pathname==="/dashboard"||pathname.startsWith("/dashboard/getting-started");
 const gettingStarted=pathname.startsWith("/dashboard/getting-started");
 const {user}=useMerchantPreview();
 if(!showDashboardHeader)return null;
 return <header className="sticky top-0 z-40 bg-[#0052B8] text-white lg:hidden">
  <div className="flex items-center justify-between gap-3 px-4 pb-3 pt-4">
   <Link href="/dashboard/settings/profile" className="flex min-w-0 items-center gap-3" aria-label="Open profile settings">
     <UserAvatar size="md"/>
     <span className="min-w-0"><span className="block text-xs text-white/80">Welcome,</span>
       <span className="block truncate text-lg font-semibold leading-tight">{user.fullName||"Preview User"}</span></span>
   </Link>
   <Link href="/dashboard/notifications" aria-label="Notifications" title="Notifications" className="relative rounded-full p-2 hover:bg-white/15"><Bell size={23}/><span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-400"/></Link>
  </div>
  <nav aria-label="Dashboard sections" className="px-4 pb-4"><div className="grid grid-cols-2 gap-1 rounded-full border border-white/85 bg-white p-1">
    <Link href="/dashboard" aria-current={!gettingStarted?"page":undefined} className={`rounded-full px-2 py-2 text-center text-xs font-semibold sm:text-sm ${!gettingStarted?"bg-[#0064E0] text-white":"text-[#18253b]"}`}>Dashboard</Link>
    <Link href="/dashboard/getting-started" aria-current={gettingStarted?"page":undefined} className={`rounded-full px-2 py-2 text-center text-xs font-semibold sm:text-sm ${gettingStarted?"bg-[#0064E0] text-white":"text-[#18253b]"}`}>Getting Started</Link>
  </div></nav>
 </header>;
}
