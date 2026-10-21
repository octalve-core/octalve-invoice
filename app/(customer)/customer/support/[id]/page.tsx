import {notFound} from "next/navigation";
import {CustomerSupportDetail,supportExamples} from "@/src/features/customer-portal/CustomerSupport";
export default async function CustomerSupportCase({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!supportExamples.some(x=>x.id===id))notFound();
 return <CustomerSupportDetail id={id}/>;
}
