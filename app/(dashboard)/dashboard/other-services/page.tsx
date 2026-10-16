"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {ArrowLeft,FileText,Users,Wallet,FileSpreadsheet,BarChart3,Scale,ScrollText,Package,RefreshCw,ReceiptText,Calculator,ContactRound,TrendingUp,WalletCards,IdCard,BookOpen,ShieldCheck,Clock3,Files,MessagesSquare,Landmark,ShieldAlert,Coins,type LucideIcon} from "lucide-react";
import {otherServiceItems} from "@/src/features/other-services/feature-links";
const icons:Record<(typeof otherServiceItems)[number]["icon"],LucideIcon>={
 "chart-no-axes-column":BarChart3,
 "scale":Scale,
 "file-text":ScrollText,
 "package":Package,
 "users":Users,
 "refresh-cw":RefreshCw,
 "receipt-text":ReceiptText,
 "calculator":Calculator,
 "contact":ContactRound,
 "trending-up":TrendingUp,
 "wallet":WalletCards,
 "id-card":IdCard,
 "book-open":BookOpen,
 "shield-check":ShieldCheck,
 "clock-3":Clock3,
 "files":Files,
 "messages-square":MessagesSquare,
 "landmark":Landmark,
 "shield-alert":ShieldAlert,
 "coins":Coins
};
const tones=["bg-blue-50 text-[#0064E0]","bg-emerald-50 text-emerald-600","bg-violet-50 text-violet-600","bg-amber-50 text-amber-600","bg-green-50 text-green-600","bg-cyan-50 text-cyan-600","bg-red-50 text-red-600","bg-slate-100 text-slate-700","bg-orange-50 text-orange-600","bg-indigo-50 text-indigo-600","bg-sky-50 text-sky-600","bg-purple-50 text-purple-600"];

const quick=[
 {label:"New Invoice",href:"/dashboard/invoice/create",icon:FileText,tone:"bg-blue-100 text-[#0064E0]"},
 {label:"New Customer",href:"/dashboard/customer/add",icon:Users,tone:"bg-green-100 text-green-600"},
 {label:"New Expenses",href:"/dashboard/expenses",icon:Wallet,tone:"bg-red-100 text-red-600"},
 {label:"New Quotation",href:"/dashboard/quotation",icon:FileSpreadsheet,tone:"bg-orange-100 text-orange-600"}
] as const;
export default function OtherServicesPage(){
 const router=useRouter();
 return <div className="mx-auto min-w-0 max-w-7xl space-y-3 pb-8">
  <header className="flex items-center gap-4 border-b border-gray-200 pb-4">
    <button onClick={()=>router.back()} aria-label="Go back" className="rounded-full p-2 text-slate-800 hover:bg-gray-100"><ArrowLeft size={23}/></button>
    <div><h1 className="text-xl font-semibold text-slate-800">More</h1><p className="text-xs text-slate-500">Explore tools and services</p></div>
  </header>
  <section aria-label="Quick Create" className="rounded-2xl bg-white p-3 shadow-sm sm:p-6">
   <h2 className="mb-5 text-lg font-medium text-slate-700">⚡ Quick Create</h2>
   <div className="grid grid-cols-4 gap-2 sm:gap-5">{quick.map(item=><Link key={item.label} href={item.href} className="flex min-w-0 flex-col items-center gap-2 text-center hover:opacity-80">
     <span className={`grid h-12 w-12 place-items-center rounded-full sm:h-16 sm:w-16 ${item.tone}`}><item.icon size={26}/></span>
     <span className="text-[11px] leading-4 text-slate-700 sm:text-sm">{item.label}</span>
   </Link>)}</div>
  </section>
  <section aria-label="Other services" className="rounded-2xl bg-white px-3 py-4 shadow-sm sm:px-6 sm:py-6">
   <h2 className="mb-2 text-lg font-semibold text-[#173652]">Workspace tools</h2><p className="mb-6 text-xs text-slate-500">Open an Octalve tool. Finance controls show preview data until the secured backend is approved.</p>
   <div className="grid grid-cols-3 gap-x-2 gap-y-5 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-8">{otherServiceItems.map((item,i)=>{
     const Icon=icons[item.icon];
     return <Link key={item.slug} href={item.href} className="flex min-w-0 flex-col items-center gap-3 text-center hover:opacity-80">
      <span className={`grid h-11 w-11 place-items-center rounded-full sm:h-16 sm:w-16 ${tones[i%tones.length]}`}>
        <Icon size={22} strokeWidth={1.8}/>
      </span>
      <span className="text-xs leading-5 text-slate-700 sm:text-sm">{item.title}</span>
      {!item.ready?<span className="text-[10px] text-gray-400">Coming soon</span>:null}
     </Link>;
    })}</div>
  </section>
 </div>;
}
