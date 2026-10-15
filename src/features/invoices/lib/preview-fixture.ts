import {formatDocumentNumber} from "./document-number";
import { createEmptyInvoiceDraft } from "@/src/features/invoice/constants";
import type { BusinessIdentityProfile, BusinessPaymentSettings, InvoiceDraft } from "@/src/features/invoice/types";

/** A fixed, public UI test fixture. No merchant account or bank details. */
export const previewMerchant: BusinessIdentityProfile = {
  name: "Preview Merchant",
  email: "preview@example.invalid",
  phone: "",
  website: "",
  address: "Business address entered during onboarding",
  tinNo: "",
  rcNo: "",
};
export const previewPayment: BusinessPaymentSettings = {
  bankName: "", accountName: "", accountNumber: "",
};
export function createPreviewInvoice(): InvoiceDraft {
  return {
    ...createEmptyInvoiceDraft(new Date("2026-10-15T12:00:00Z")),
    invoiceNo: formatDocumentNumber("Octalve Limited",1,"invoice"),
    clientName: "Sample Customer",
    clientEmail: "customer@example.invalid",
    rows: [{
      id: "preview-1", serviceName: "Professional services",
      description: "Editable sample line item", quantity: "1",
      unitPrice: "250000", discount: "0",
    }],
    notes: "UI Preview — this is not an issued invoice.",
    extraDetailsVisible: true,
  };
}
