"use client";
import {useRouter} from "next/navigation";
import AddCustomerForm,{type CustomerData} from "@/components/dashboard/forms/AddCustomerForm";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
export default function AddCustomerPage(){
 const router=useRouter(),{setCustomers,customers}=useMerchantPreview();
 const handleSubmit=(data:CustomerData)=>{
  const name=data.displayName.trim()||[data.firstName,data.lastName].join(" ").trim();
  if(!name)return;
  setCustomers(p=>[...p,{
    id:globalThis.crypto.randomUUID(),
    name,email:data.email.trim(),phone:data.phone.trim(),
    address:(data.billingAddress||data.addressLine1).trim(),company:data.companyName.trim(),
    customerType:data.customerType,billingName:data.customerType==="business"?(data.companyName.trim()||name):name,
    taxId:data.taxId.trim(),companyRegistration:data.companyRegistration.trim(),companyId:data.companyId.trim(),
    addressLine1:data.addressLine1.trim(),city:data.city.trim(),state:data.state.trim(),postalCode:data.zipCode.trim(),
    country:data.country.trim(),currency:data.currency.split(" ")[0]||"",website:data.website.trim()
  }]);
  router.push("/dashboard/customer");
 };
 return <AddCustomerForm onSubmit={handleSubmit} onCancel={()=>router.push("/dashboard/customer")}/>;
}
