import {notFound} from "next/navigation";
import FinanceWorkspace from "@/src/features/finance/FinanceWorkspace";
import {financeModes,type FinanceMode} from "@/src/features/finance/preview-data";
export default async function FinanceToolPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 if(!financeModes.includes(slug as FinanceMode))notFound();
 return <FinanceWorkspace mode={slug as FinanceMode}/>;
}
