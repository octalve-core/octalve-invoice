import {notFound} from "next/navigation";
import {CustomerWorkspace,type CustomerSection} from "@/src/features/customer-portal/CustomerWorkspace";
const sections=["invoices","payments","receipts","merchants","messages","notifications","settings"] as const;
export function generateStaticParams(){return sections.map(section=>({section}));}
export default async function CustomerArea({params}:{params:Promise<{section:string}>}){
 const {section}=await params;
 if(!sections.some(value=>value===section))notFound();
 return <CustomerWorkspace section={section as CustomerSection}/>;
}
