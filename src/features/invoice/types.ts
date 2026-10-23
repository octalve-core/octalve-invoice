import type {TaxClassification} from "@/src/features/tax/tax-domain";
import type {DraftPaymentPlan} from "@/src/features/invoices/lib/draft-payment-plan";
export const currencyCodes = ["NGN", "USD", "GBP", "EUR"] as const;
export type CurrencyCode = (typeof currencyCodes)[number];

export const paperSizes = ["A4", "A5", "LETTER"] as const;
export type PaperSize = (typeof paperSizes)[number];
export type DocumentDensity = "normal" | "compact";

export const documentTypeCodes = ["INV"] as const;
export type DocumentTypeCode = (typeof documentTypeCodes)[number];

export interface CurrencyDefinition {
  code: CurrencyCode;
  symbol: string;
  locale: string;
  label: string;
}

export interface PaperDefinition {
  code: PaperSize;
  label: string;
  widthMm: number;
  heightMm: number;
  previewWidthPx: number;
  marginMm: number;
}

export interface InvoiceLine {
  id: string;
  /** Only a reference for editing; prices and tax treatment are snapshotted per draft. */
  catalogItemId?:string;
  taxClassification?:TaxClassification;
  serviceName: string;
  description: string;
  quantity: string;
  unitPrice: string;
  discount: string;
}

export interface InvoiceDraft {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderRole: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  /** Copied from selected customer for this draft; no server-issued immutable snapshot yet. */
  clientCustomerId?:string;
  clientType?:"business"|"individual";
  clientTaxId?:string;
  clientCompanyRegistration?:string;
  clientCity?:string;
  clientState?:string;
  clientPostalCode?:string;
  clientCountry?:string;
  invoiceNo: string;
  day: string;
  month: string;
  year: string;
  dueDay: string;
  dueMonth: string;
  dueYear: string;
  tinNo: string;
  rcNo: string;
  rows: InvoiceLine[];
  paymentPlan?:DraftPaymentPlan;
  discount: string;
  tax: string;
  currency: CurrencyCode;
  paperSize: PaperSize;
  notes: string;
  extraDetailsVisible: boolean;
}

export interface InvoiceDraftMetadata {
  dateManuallyEdited: boolean;
  invoiceNumberCommitted: boolean;
}

export interface PersistedInvoiceDraft extends InvoiceDraft, InvoiceDraftMetadata {
  version: 5;
}



export interface InvoiceGeneratorStorageScope {
  draftStorageKey: string;
  paymentSettingsStorageKey: string;
  currencyStorageKey: string;
  paperSizeStorageKey: string;
  legacyDraftStorageKeys: readonly string[];
}

export interface BusinessIdentityProfile {
  name: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tinNo: string;
  rcNo: string;
}

export interface BusinessPaymentSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface InvoiceTotals {
  /** Preview-only classification guard. Undefined retains legacy renderer behaviour. */
  taxAssessed?: boolean;
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}

export type ExportFormat = "pdf" | "png";
