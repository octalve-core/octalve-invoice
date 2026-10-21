import {notFound} from "next/navigation";
import {AdminRecordDetail} from "@/src/features/platform-admin/AdminRecordDetail";
import {adminPreviewRecord,adminPreviewRecords,type AdminRecordKind} from "@/src/features/platform-admin/admin-preview-data";
const kinds=["merchants","customers","subscriptions","verifications","support","staff"] as const;
export function generateStaticParams(){return adminPreviewRecords.map(row=>({section:row.kind,id:row.id}));}
export default async function AdminDetailPage({params}:{params:Promise<{section:string;id:string}>}){
 const {section,id}=await params;
 if(!kinds.some(kind=>kind===section)||!adminPreviewRecord(section as AdminRecordKind,id))notFound();
 return <AdminRecordDetail kind={section as AdminRecordKind} id={id}/>;
}
