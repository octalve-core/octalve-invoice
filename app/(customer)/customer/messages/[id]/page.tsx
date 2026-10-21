import {notFound} from "next/navigation";
import {CustomerMessageDetail} from "@/src/features/customer-portal/CustomerSupport";
const ids=["msg-1","msg-2"];
export function generateStaticParams(){return ids.map(id=>({id}));}
export default async function MessagePage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;if(!ids.includes(id))notFound();
 return <CustomerMessageDetail id={id}/>;
}
