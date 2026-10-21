import {notFound} from "next/navigation";
import {CustomerWorkspace,customerSections,type CustomerSection} from "@/src/features/customer-portal/CustomerWorkspace";
export function generateStaticParams(){return customerSections.filter(s=>s!=="overview").map(section=>({section}));}
export default async function CustomerArea({params}:{params:Promise<{section:string}>}){
 const {section}=await params;
 if(!customerSections.includes(section as CustomerSection)||section==="overview")notFound();
 return <CustomerWorkspace section={section as CustomerSection}/>;
}
