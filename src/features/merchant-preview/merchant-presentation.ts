import type {BusinessIdentityProfile,BusinessPaymentSettings} from "@/src/features/invoice/types";
import type {MerchantPreviewSettings} from "./MerchantPreviewProvider";
/** The merchant identity comes from one shared setup record, not Octalve software branding. */
export function merchantCompany(s:MerchantPreviewSettings):BusinessIdentityProfile{
 return {name:s.legalName?.trim()||s.businessName,phone:s.businessPhone,email:s.email,website:s.website,
 address:s.businessAddress,tinNo:s.taxId,rcNo:s.rcNumber};
}
/** No bank/payment instructions until trusted name enquiry confirms the exact bank code and account number. */
export function merchantPayment(s:MerchantPreviewSettings):BusinessPaymentSettings{
 const evidence=s.bankVerification;
 const valid=evidence?.status==="verified"&&evidence.source==="trusted-server"
  &&Boolean(s.verifiedAccountName?.trim())&&Boolean(s.bankName?.trim())
  &&/^[0-9]{10}$/.test(s.accountNumber)&&Boolean(s.bankCode?.trim())
  &&evidence.bankCode===s.bankCode&&evidence.accountNumber===s.accountNumber;
 return valid?{bankName:s.bankName,accountName:s.verifiedAccountName!.trim(),accountNumber:s.accountNumber}:
 {bankName:"",accountName:"",accountNumber:""};
}
