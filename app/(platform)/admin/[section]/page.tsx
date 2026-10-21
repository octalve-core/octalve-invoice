import {notFound} from "next/navigation";
import {AdminWorkspace,type AdminSection} from "@/src/features/platform-admin/AdminWorkspace";
const sections=["merchants","customers","subscriptions","verifications","support","notifications","updates","staff","security","audit"] as const;
export function generateStaticParams(){return sections.map(section=>({section}));}
export default async function AdminArea({params}:{params:Promise<{section:string}>}){
 const {section}=await params;
 if(!sections.some(value=>value===section))notFound();
 return <AdminWorkspace section={section as AdminSection}/>;
}
