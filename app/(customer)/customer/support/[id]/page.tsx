import {notFound} from "next/navigation";
import {CustomerSupportDetail} from "@/src/features/customer-portal/CustomerSupport";
const ids=["CSP-101","CSP-102"];
export default async function CustomerSupportCase({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!ids.includes(id))notFound();
 return <CustomerSupportDetail id={id}/>;
}
