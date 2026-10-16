import Link from "next/link";
import {ArrowLeft,Clock3} from "lucide-react";
import {otherServiceItems} from "@/src/features/other-services/feature-links";
import {notFound,redirect} from "next/navigation";
export default async function ComingSoon({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const service=otherServiceItems.find(item=>item.slug===slug);
 if(!service)notFound();
 if(slug==="recurring-income-expense")redirect("/dashboard/recurring");
 if(slug==="create-statement")redirect("/dashboard/finance/statement");
 if(slug==="pay-tax")redirect("/dashboard/tax-centre");
 return <main className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center gap-5 rounded-2xl bg-white p-8 text-center shadow-sm">
  <span className="grid h-20 w-20 place-items-center rounded-full bg-blue-50 text-[#0064E0]"><Clock3 size={36}/></span>
  <h1 className="text-2xl font-bold text-slate-900">{service.title}</h1>
  <p className="text-sm leading-6 text-slate-600">Coming soon to Octalve Invoice. This feature is not active, and no transaction or financial operation is available here yet.</p>
  <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-[#0064E0] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0052B8]"><ArrowLeft size={16}/>Back to Overview</Link>
 </main>;
}
