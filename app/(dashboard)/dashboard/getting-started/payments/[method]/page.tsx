import {notFound} from "next/navigation";
import {PaymentSetupDetail} from "@/src/features/getting-started/PaymentSetupDetail";
import {isPaymentMethod} from "@/src/features/getting-started/payment-catalog";
export default async function MethodPage({params}:{params:Promise<{method:string}>}){
 const {method}=await params;
 if(!isPaymentMethod(method))notFound();
 return <PaymentSetupDetail method={method}/>;
}
