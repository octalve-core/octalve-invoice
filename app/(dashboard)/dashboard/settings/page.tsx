"use client";
import Link from "next/link";
import {BadgeCheck,BarChart3,Building2,ChevronRight,FileText,FileSpreadsheet,FileMinus,HelpCircle,MoreHorizontal,Package,RefreshCcw,ShieldCheck,Trash2,UserRound,UsersRound,WalletCards} from "lucide-react";
import {UserAvatar} from "@/src/features/merchant-preview/UserAvatar";
import {PreviewLogoutButton} from "@/src/features/merchant-preview/PreviewLogoutButton";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const sections=[
 {title:"Account & billing",rows:[["Manage Subscription","/dashboard/settings/subscription",WalletCards],["Sales Reports","/dashboard/report",BarChart3]]},
 {title:"General settings",rows:[["Profile Settings","/dashboard/settings/profile",UserRound],["Customize Invoices","/dashboard/settings/invoice",FileText],["Business information","/dashboard/getting-started?step=business",Building2]]},
 {title:"Preferences & support",rows:[["FAQs & Help","/dashboard/settings/faqs",HelpCircle],["Deleted Records","/dashboard/settings/deleted",Trash2]]},
 {title:"More workspace tools",rows:[["Quotations","/dashboard/quotation",FileSpreadsheet],["Expenses","/dashboard/expenses",WalletCards],["Items & Services","/dashboard/items",Package],["Staff","/dashboard/staff",UsersRound],["Credit Notes","/dashboard/credit-note",FileMinus],["Other Services","/dashboard/other-services",MoreHorizontal],["Recurring Expenses","/dashboard/recurring-expense",RefreshCcw],["Payments Received","/dashboard/payment-received",WalletCards]]}
] as const;
export default function SettingsPage(){
 const {user,settings}=useMerchantPreview();
 return <main className="w-full min-w-0 space-y-5 pb-4">
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[24px] bg-gradient-to-br from-[#0064E0] via-[#0756B7] to-[#06365F] px-5 py-7 text-white shadow-[0_12px_30px_rgba(2,45,105,.15)] sm:px-7"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">Your workspace</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">Me & Settings</h1><p className="mt-1 text-sm text-blue-100">Manage your business experience in one place.</p></div><PreviewLogoutButton className="rounded-full border border-red-100 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"/></div>
  <Link href="/dashboard/settings/profile" className="flex items-center gap-4 rounded-[22px] border border-[#E5ECF6] bg-white p-4 shadow-[0_10px_30px_rgba(19,49,83,.04)] transition-shadow hover:shadow-md sm:p-5">
   <span className="rounded-full border-[3px] border-blue-100"><UserAvatar size="lg"/></span>
   <span className="min-w-0 flex-1"><strong className="block truncate text-base font-semibold text-[#16324C] sm:text-lg">{user.fullName||"Preview User"}</strong><span className="mt-1 block truncate text-sm text-slate-500">{user.email||"Add your email in Profile Settings"}</span><span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#0064E0]"><BadgeCheck size={13}/> {settings.businessName||"Business workspace"} · Profile</span></span><ChevronRight className="shrink-0 text-slate-400"/>
  </Link>
  <div className="grid items-start gap-5 lg:grid-cols-2 xl:grid-cols-3">
   {sections.map(section=><section key={section.title} className="overflow-hidden rounded-2xl border border-[#EDF0F5] bg-white shadow-sm">
    <h2 className="border-b border-[#F0F3F7] bg-[#FAFBFE] px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#66788E]">{section.title}</h2>
    <div className="divide-y divide-[#F0F3F7]">{section.rows.map(([label,href,Icon])=><Link href={href} key={href} className="flex min-h-[70px] items-center gap-3 px-5 py-4 hover:bg-[#F7FAFF] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
     <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EEF5FF] text-[#0064E0]"><Icon size={19} strokeWidth={1.9}/></span><span className="flex-1 text-sm font-semibold text-[#19334F]">{label}</span><ChevronRight size={18} className="text-[#94A3B8]"/>
    </Link>)}</div>
   </section>)}
  </div>
  <p className="flex items-start gap-2 text-xs leading-5 text-slate-500"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#0064E0]"/>This is a demonstration workspace. Billing, secure staff access and real record deletion are not active.</p>
 </main>;
}