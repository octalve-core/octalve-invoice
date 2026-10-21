import {notFound} from "next/navigation";
import {AdminWorkspace,adminSections,type AdminSection} from "@/src/features/platform-admin/AdminWorkspace";
export function generateStaticParams(){return adminSections.filter(s=>s!=="overview").map(section=>({section}));}
export default async function AdminArea({params}:{params:Promise<{section:string}>}){
 const {section}=await params;
 if(!adminSections.includes(section as AdminSection)||section==="overview")notFound();
 return <AdminWorkspace section={section as AdminSection}/>;
}
