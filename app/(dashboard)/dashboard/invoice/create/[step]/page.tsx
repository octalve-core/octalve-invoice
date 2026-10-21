import {notFound} from "next/navigation";
const steps=["details","items","charges","workflow","preview"] as const;
export function generateStaticParams(){return steps.map(step=>({step}));}
export default async function CreateInvoiceStep({params}:{params:Promise<{step:string}>}){
 const {step}=await params;
 if(!steps.some(value=>value===step))notFound();
 return null; // The persistent parent layout owns the shared editable invoice.
}
