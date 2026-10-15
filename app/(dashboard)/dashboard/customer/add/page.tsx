"use client";
import {useRouter} from "next/navigation";
import AddCustomerForm from "@/components/dashboard/forms/AddCustomerForm";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
export default function AddCustomerPage(){
 const router=useRouter(),{setCustomers,customers}=useMerchantPreview();
 const handleSubmit=(data:{displayName:string;firstName:string;lastName:string;email:string;phone:string;billingAddress:string;companyName:string})=>{
  const name=data.displayName.trim()||[data.firstName,data.lastName].join(" ").trim();
  if(!name)return;
  setCustomers(p=>[...p,{id:String(customers.length+1),name,email:data.email,phone:data.phone,address:data.billingAddress,company:data.companyName}]);
  router.push("/dashboard/customer");
 };
 return <AddCustomerForm onSubmit={handleSubmit} onCancel={()=>router.push("/dashboard/customer")}/>;
}
