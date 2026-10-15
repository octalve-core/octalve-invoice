import Tabs from "@/components/dashboard/ui/Tabs";
import AnnouncementCard from "@/components/dashboard/cards/AnnouncementCard";
const tabs=[{label:"Dashboard",href:"/dashboard"},{label:"Announcement",href:"/dashboard/announcement"},{label:"Recent Update",href:"/dashboard/updates"}];
const updates=[
 {date:"15 October 2026",title:"One consistent document list",description:"Document lists now share responsive cards, filters and actions, with individual document types and numbers."},
 {date:"15 October 2026",title:"Optional payment receipts",description:"A receipt can document an existing verified payment without being automatically issued for every paid invoice."},
 {date:"15 October 2026",title:"Improved invoice editing",description:"Customer selection, product descriptions and the invoice preview are being brought into a single editing workflow."}
];
export default function RecentUpdatesPage(){return <div className="mx-auto max-w-4xl space-y-5"><Tabs tabs={tabs}/><div><h1 className="text-xl font-bold text-[#1f344c]">Recent Updates</h1><p className="text-sm text-gray-500">What's changing in Octalve Invoice</p></div><div className="space-y-3">{updates.map(x=><AnnouncementCard key={x.title} {...x}/>)}</div></div>;}
