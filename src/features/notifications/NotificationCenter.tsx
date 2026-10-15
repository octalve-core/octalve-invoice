"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {ArrowLeft,CheckCheck,ChevronRight,FileText,Settings2,ShieldCheck,Inbox} from "lucide-react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
type Category="updates"|"settings"|"security";
type Note={id:string;title:string;description:string;time:string;category:Category;href:string};
const notifications:Note[]=[
 {id:"1",title:"Complete your business profile",description:"Add your business address, logo and payment information to your invoice header.",time:"Account setup",category:"settings",href:"/dashboard/settings/business"},
 {id:"2",title:"Review invoice preferences",description:"Configure due dates, document numbering and receipt email preferences.",time:"Getting started",category:"settings",href:"/dashboard/settings/invoice"},
 {id:"3",title:"Explore your documents",description:"Invoices, receipts and quotations now share a consistent layout.",time:"What's new",category:"updates",href:"/dashboard/invoice"},
 {id:"4",title:"Your account security",description:"Staff access, verified payment notifications and login alerts will be available when authentication is enabled.",time:"Security",category:"security",href:"/dashboard/settings"}
];
const ico={updates:FileText,settings:Settings2,security:ShieldCheck};
const tones={updates:"bg-blue-50 text-[#0064E0]",settings:"bg-green-50 text-green-600",security:"bg-amber-50 text-amber-600"};
export function NotificationCenter(){
 const {readNotificationIds:seen,setReadNotificationIds:setSeen}=useMerchantPreview();
 const [tab,setTab]=useState<"all"|"unread"|"updates"|"settings">("all");
 const visible=useMemo(()=>notifications.filter(n=>(tab==="all"||tab==="unread"&&!seen.includes(n.id)||n.category===tab)),[tab,seen]);
 const unread=notifications.filter(n=>!seen.includes(n.id)).length;
 return <div className="mx-auto max-w-3xl space-y-5 pb-12">
  <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><Link href="/dashboard" aria-label="Back to dashboard" className="rounded-full p-2 hover:bg-white"><ArrowLeft size={22}/></Link>
    <div><h1 className="text-xl font-bold text-[#1d2838]">Notifications</h1><p className="text-xs text-gray-500">{unread} unread · Account and product updates</p></div></div>
    <button onClick={()=>setSeen(notifications.map(n=>n.id))} className="flex items-center gap-2 text-xs font-medium text-[#0064E0]"><CheckCheck size={16}/>Mark all read</button></div>
  <div className="flex flex-wrap gap-2" aria-label="Notification categories">{(["all","unread","updates","settings"] as const).map(t=><button key={t} onClick={()=>setTab(t)} aria-pressed={tab===t}
    className={"rounded-full px-4 py-2 text-xs font-medium capitalize "+(tab===t?"bg-[#0064E0] text-white":"bg-white text-[#3e5064]")}>{t}</button>)}</div>
  <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">{visible.length?visible.map(n=>{
    const Icon=ico[n.category],isUnread=!seen.includes(n.id);
    return <Link key={n.id} href={n.href} onClick={()=>setSeen(p=>p.includes(n.id)?p:[...p,n.id])} className={"flex min-w-0 items-center gap-3 border-b border-gray-100 px-4 py-4 hover:bg-blue-50/40 sm:px-6 "+(isUnread?"bg-[#f7fbff]":"")}>
     <span className={"grid h-11 w-11 shrink-0 place-items-center rounded-full "+tones[n.category]}><Icon size={21}/></span>
     <span className="min-w-0 flex-1"><span className="flex items-start gap-2"><strong className="flex-1 text-sm text-[#1c3652]">{n.title}</strong>{isUnread?<span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0064E0]"/>:null}</span>
      <span className="mt-1 block text-xs leading-5 text-gray-500">{n.description}</span><span className="mt-2 block text-[11px] text-gray-400">{n.time}</span></span><ChevronRight size={17} className="shrink-0 text-gray-400"/>
    </Link>;
   }):<div className="flex flex-col items-center gap-2 p-12 text-gray-500"><Inbox size={32}/><p className="text-sm">No notifications here.</p></div>}</div>
  <p className="text-center text-xs text-gray-400">Financial transaction alerts will appear only after securely verified payments and account services are enabled.</p>
 </div>;
}
