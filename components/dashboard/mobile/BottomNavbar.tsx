"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {House,FileText,ReceiptText,UsersRound,UserRound} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const navigation=[
 {label:"Home",href:"/dashboard",icon:House},
 {label:"Invoices",href:"/dashboard/invoice",icon:FileText},
 {label:"Receipts",href:"/dashboard/receipt",icon:ReceiptText},
 {label:"Clients",href:"/dashboard/customer",icon:UsersRound},
 {label:"Me",href:"/dashboard/settings",icon:UserRound}
];
export default function BottomNavbar(){
 const pathname=usePathname(),{userImage}=useMerchantPreview();
 return <nav aria-label="Primary mobile navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E9EDF4] bg-white/95 shadow-[0_-8px_30px_rgba(14,46,84,0.055)] backdrop-blur-xl lg:hidden">
  <div className="grid grid-cols-5 gap-0.5 px-2 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2">
   {navigation.map(({label,href,icon:Icon})=>{
    const active=href==="/dashboard"?pathname==="/dashboard":href==="/dashboard/settings"?pathname.startsWith("/dashboard/settings"):pathname===href||pathname.startsWith(href+"/");
    return <Link key={href} href={href} aria-current={active?"page":undefined}
      className={`flex min-h-[55px] flex-col items-center justify-center gap-1 rounded-xl px-0.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-[#0064E0] ${active?"text-[#0064E0]":"text-[#677489] hover:text-[#234B7A]"}`}>
      <span className={`grid h-8 w-10 place-items-center rounded-xl ${active?"bg-[#EAF3FF]":""}`}>
       {label==="Me"&&userImage?<img src={userImage} alt="" className="h-7 w-7 rounded-full border-2 border-[#0064E0] object-cover"/>:<Icon className="h-[21px] w-[21px]" strokeWidth={active?2.6:1.9}/>}
      </span><span className={`text-[10px] tracking-tight ${active?"font-bold":"font-medium"}`}>{label}</span>
     </Link>;
   })}
  </div>
 </nav>;
}