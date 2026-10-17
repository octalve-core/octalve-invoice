"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {ArrowLeft,Search,FileText,Users,Wallet,FileSpreadsheet,BarChart3,Scale,ScrollText,Package,RefreshCw,ReceiptText,Calculator,ContactRound,TrendingUp,WalletCards,IdCard,BookOpen,ShieldCheck,Clock3,Files,MessagesSquare,Landmark,ShieldAlert,Coins,PanelsTopLeft,UserCog,type LucideIcon} from "lucide-react";
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
 "coins":Coins,
 "panels-top-left":PanelsTopLeft,
 "user-cog":UserCog
};
const tones=["bg-blue-50 text-[#0064E0]","bg-emerald-50 text-emerald-600","bg-violet-50 text-violet-600","bg-amber-50 text-amber-600","bg-green-50 text-green-600","bg-cyan-50 text-cyan-600","bg-red-50 text-red-600","bg-slate-100 text-slate-700","bg-orange-50 text-orange-600","bg-indigo-50 text-indigo-600","bg-sky-50 text-sky-600","bg-purple-50 text-purple-600"];

const serviceGroups=[
 {title:"Business operations",description:"Your day-to-day workspace",slugs:["overview","report","staff","items","customer","recurring-income-expense","create-statement"]},
 {title:"Finance & compliance",description:"Records, approvals and controls",slugs:["tax-centre","statement-of-account","approvals","receivables-ageing","credit-debit-notes","communication-history","bank-reconciliation","audit-exceptions","multi-currency","finance-calculator"]},
 {title:"Services & support",description:"Connections, access and assistance",slugs:["customer-portal","insights-support","business-card","investment","digital-pay","id-card"]}
] as const;
const quick=[
 {label:"New Invoice",href:"/dashboard/invoice/create",icon:FileText,tone:"bg-blue-100 text-[#0064E0]"},
 {label:"New Customer",href:"/dashboard/customer/add",icon:Users,tone:"bg-green-100 text-green-600"},
 {label:"New Expenses",href:"/dashboard/expenses",icon:Wallet,tone:"bg-red-100 text-red-600"},
 {label:"New Quotation",href:"/dashboard/quotation",icon:FileSpreadsheet,tone:"bg-orange-100 text-orange-600"}
] as const;
export default function OtherServicesPage(){
 const router=useRouter();
 const [search,setSearch]=useState("");
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
   <label className="relative mb-6 block"><Search className="absolute left-3 top-3 text-slate-400" size={18}/><input aria-label="Search More services" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a tool or service" className="h-11 w-full rounded-xl border border-slate-200 bg-[#FBFCFF] pl-10 pr-3 text-sm outline-none focus:border-[#0064E0]"/></label>
   <div className="space-y-7">{serviceGroups.map(group=>{
    const items=otherServiceItems.filter(item=>group.slugs.some(slug=>slug===item.slug)&&item.title.toLowerCase().includes(search.toLowerCase().trim()));
    if(!items.length)return null;
    return <div key={group.title} className="border-t border-slate-100 pt-5"><h3 className="text-sm font-semibold text-[#193955]">{group.title}</h3><p className="mb-5 mt-1 text-xs text-slate-500">{group.description}</p>
     <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-4 xl:grid-cols-5">{items.map((item,i)=>{
      const Icon=icons[item.icon];
      return <Link key={item.slug} href={item.href} className="flex min-w-0 flex-col items-center gap-2 rounded-xl px-1 py-2 text-center focus-visible:outline-2 focus-visible:outline-[#0064E0] hover:bg-[#F7FAFF]">
       <span className={"grid h-12 w-12 place-items-center rounded-2xl sm:h-14 sm:w-14 "+tones[i%tones.length]}><Icon size={23} strokeWidth={1.8}/></span>
       <span className="text-[11px] font-medium leading-5 text-[#24405A] sm:text-sm">{item.title}</span>
       {!item.ready?<span className="text-[10px] text-slate-400">Coming soon</span>:null}
      </Link>;
     })}</div>
    </div>;
   })}</div>
   {!otherServiceItems.some(item=>item.title.toLowerCase().includes(search.toLowerCase().trim()))?<p className="py-5 text-center text-sm text-slate-500">No service matches this search.</p>:null}
  </section>
 </div>;
}
