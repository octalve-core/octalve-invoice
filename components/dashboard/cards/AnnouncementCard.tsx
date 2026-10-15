import {Megaphone,ArrowUpRight} from "lucide-react";
interface AnnouncementCardProps {date:string;title:string;description:string;}
export default function AnnouncementCard({date,title,description}:AnnouncementCardProps){
 return <article className="group relative min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
  <div className="flex items-start gap-4"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0064E0]"><Megaphone size={21}/></span>
   <div className="min-w-0 flex-1"><p className="mb-1 text-xs text-gray-400">{date}</p><h3 className="text-base font-semibold text-[#17334e]">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p></div>
   <ArrowUpRight size={17} className="shrink-0 text-gray-300 transition-colors group-hover:text-[#0064E0]"/>
  </div>
 </article>;
}
