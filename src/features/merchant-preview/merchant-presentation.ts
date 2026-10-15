import type {BusinessIdentityProfile,BusinessPaymentSettings} from "@/src/features/invoice/types";
import type {MerchantPreviewSettings} from "./MerchantPreviewProvider";
export function merchantCompany(s:MerchantPreviewSettings):BusinessIdentityProfile{
 return {name:s.businessName,phone:s.businessPhone,email:s.email,website:s.website,
 address:s.businessAddress,tinNo:s.taxId,rcNo:s.rcNumber};
}
export function merchantPayment(s:MerchantPreviewSettings):BusinessPaymentSettings{
 return {bankName:({"gtb":"Guaranty Trust Bank","firstbank":"First Bank","zenith":"Zenith Bank","access":"Access Bank","uba":"United Bank for Africa","sterling":"Sterling Bank"} as Record<string,string>)[s.bankName]||s.bankName,accountName:s.accountNumber?s.businessName:"",accountNumber:s.accountNumber};
}
