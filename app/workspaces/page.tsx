import Link from "next/link";
import {ArrowRight,Building2,ReceiptText,ShieldCheck} from "lucide-react";
import {BrandWordmark} from "@/src/shared/ui/BrandWordmark";
const areas=[
 {name:"Merchant workspace",desc:"Create invoices, manage collections and run your business.",href:"/dashboard",Icon:Building2},
 {name:"Customer workspace",desc:"Keep invoices from different businesses in one place.",href:"/customer",Icon:ReceiptText},
 {name:"Octalve operations",desc:"Manage support, merchant reviews and platform services.",href:"/admin",Icon:ShieldCheck}
];
export default function WorkspaceChooser(){
 return <main className="min-h-dvh bg-[#F7F9FC] px-4 py-10 text-[#173652] sm:py-16">
  <div className="mx-auto max-w-4xl space-y-7">
   <header className="flex flex-wrap items-center gap-3"><BrandWordmark width={150}/><p className="border-l border-[#DCE7F4] pl-3 text-xs text-slate-500">One platform · Three experiences</p></header>
   <div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore your workspace</h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Choose an experience to review. A single account with authorised access to each workspace will be introduced when secure sign-in is available.</p></div>
   <div className="grid gap-4 md:grid-cols-3">{areas.map(({name,desc,href,Icon})=><Link href={href} key={href}
    className="group flex min-h-[220px] flex-col justify-between rounded-2xl border border-[#E3ECF6] bg-white p-5 transition-all hover:border-[#A4CAFC] hover:shadow-[0_12px_30px_rgba(9,44,88,0.07)]">
     <div><span className="grid h-12 w-12 place-items-center rounded-xl bg-[#EAF3FF] text-[#0064E0]"><Icon size={24}/></span>
      <h2 className="mt-5 font-bold">{name}</h2><p className="mt-2 text-xs leading-6 text-slate-500">{desc}</p></div>
     <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#0064E0]">Explore interface <ArrowRight className="transition-transform group-hover:translate-x-1" size={17}/></span>
    </Link>)}</div>
   <p className="rounded-xl border border-[#E1EAF4] bg-white p-4 text-xs leading-6 text-slate-500">UI demonstration only. This page is not a sign-in or an access-granting mechanism. Staff, merchant and customer permissions will be enforced on the server before launch.</p>
  </div>
 </main>;
}
