import {notFound} from "next/navigation";
const steps=["details","items","charges","workflow","preview"] as const;
export default async function EditInvoiceStep({params}:{params:Promise<{id:string;step:string}>}){
 const {step}=await params;
 if(!steps.some(value=>value===step))notFound();
 return null; // The edit layout retains the same draft across page navigation.
}
