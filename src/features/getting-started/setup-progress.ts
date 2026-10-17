import {defaultInvoiceAppearance,defaultInvoicePreferences,type InvoiceAppearance,type InvoicePreferences,type MerchantPreviewSettings} from "@/src/features/merchant-preview/MerchantPreviewProvider";
/** Preview-only: financial connections require trusted server evidence, never a radio selection. */
export function previewSetupProgress(settings:MerchantPreviewSettings,appearance:InvoiceAppearance,preferences:InvoicePreferences){
 const business=Boolean(settings.businessName.trim()&&settings.businessPhone.trim()&&settings.businessAddress.trim());
 const invoice=JSON.stringify(appearance)!==JSON.stringify(defaultInvoiceAppearance)
  ||JSON.stringify(preferences)!==JSON.stringify(defaultInvoicePreferences);
 const payment=false; // Later: verified, tenant-scoped server connection, not Preview settings.
 const appLock=false; // Later: authenticated server-controlled MFA/app lock.
 const completed=[business,invoice,payment,appLock].filter(Boolean).length;
 return {business,invoice,payment,appLock,completed,total:4,percent:completed*25};
}
