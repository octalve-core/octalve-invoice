import {notFound} from "next/navigation";
import {CustomerInvoiceDetail} from "@/src/features/customer-portal/CustomerWorkspace";
import {sampleCustomerInvoices} from "@/src/features/customer-portal/sample-data";
export function generateStaticParams(){return sampleCustomerInvoices.map(row=>({id:row.id}));}
export default async function CustomerInvoicePage({params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 if(!sampleCustomerInvoices.some(row=>row.id===id))notFound();
 return <CustomerInvoiceDetail id={id}/>;
}
