import Tabs from "@/components/dashboard/ui/Tabs";
import AnnouncementCard from "@/components/dashboard/cards/AnnouncementCard";
const tabs=[{label:"Dashboard",href:"/dashboard"},{label:"Announcement",href:"/dashboard/announcement"},{label:"Recent Update",href:"/dashboard/updates"}];
const updates=[
 {date:"15 October 2026",title:"Invoice and document workspace",description:"We are refining invoice, receipt, quotation and expense layouts for a consistent experience on desktop and mobile."},
 {date:"15 October 2026",title:"Bank transfer verification",description:"Manual bank transfers will be recorded against an invoice with controlled confirmation. Integrated payment gateways and virtual accounts will use provider verification."},
 {date:"15 October 2026",title:"Merchant profile setup",description:"Business name, logo and bank details can be configured in Business Settings so invoice documents use the merchant's own identity."}
];
export default function AnnouncementPage(){return <div className="mx-auto max-w-4xl space-y-5"><Tabs tabs={tabs}/><div><h1 className="text-xl font-bold text-[#1f344c]">Announcements</h1><p className="text-sm text-gray-500">Product and account information</p></div><div className="space-y-3">{updates.map(x=><AnnouncementCard key={x.title} {...x}/>)}</div></div>;}
