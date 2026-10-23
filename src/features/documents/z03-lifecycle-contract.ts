/**
 * Phase 0I Z03: frontend-only workflow specification.
 * This file is NOT a payment, fiscal, identity, issuance or delivery authority.
 * Backend adjudication and immutable issued snapshots require separate Phase 1 approval.
 */
export const invoiceIssuanceStates=["DRAFT","APPROVAL_PENDING","FISCAL_PENDING","ISSUED"] as const;
export const deliveryStates=["NOT_PREPARED","PREPARED","QUEUED","SENT","FAILED"] as const;
export const collectionStates=["NOT_VERIFIED","PARTIAL_VERIFIED","FULLY_VERIFIED","DISPUTED"] as const;
export const refundStates=["NONE","REQUESTED","PROCESSING","SETTLED","FAILED"] as const;
export const quotationStates=["DRAFT","INTERNAL_REVIEW","APPROVED","SENT","ACCEPTED","DECLINED","EXPIRED","CONVERTED"] as const;
export type InvoiceIssuanceState=(typeof invoiceIssuanceStates)[number];
export type DeliveryState=(typeof deliveryStates)[number];
export type CollectionState=(typeof collectionStates)[number];
export type RefundState=(typeof refundStates)[number];
export type QuotationState=(typeof quotationStates)[number];
export type InvoiceLifecycleAxes=Readonly<{
 issuance:InvoiceIssuanceState;
 delivery:DeliveryState;
 collection:CollectionState;
 refund:RefundState;
}>;
export type QuotationLifecycle=Readonly<{
 proposal:QuotationState;
 delivery:DeliveryState;
 convertedInvoiceId:string|null;
}>;

/** Never translate sample fixture payment labels into verified issuance or collection. */
export const z03UnissuedPreview:InvoiceLifecycleAxes=Object.freeze({
 issuance:"DRAFT",delivery:"NOT_PREPARED",collection:"NOT_VERIFIED",refund:"NONE"
});
/**
 * Pure cross-axis contract checks for proposed future server records.
 * No mutation, collection posting or document issuance is performed here.
 */
export function lifecycleContractErrors(record:InvoiceLifecycleAxes):string[]{
 const errors:string[]=[];
 if(record.issuance!=="ISSUED"&&(["QUEUED","SENT","FAILED"] as DeliveryState[]).includes(record.delivery))
  errors.push("An unissued document cannot enter delivery transport states.");
 if(record.issuance==="DRAFT"&&record.refund!=="NONE")
  errors.push("A draft cannot independently create a verified refund.");
 return errors;
}
/**
 * A quote cannot become an invoice by changing its status.
 * The future backend must create a NEW draft from an approved/accepted
 * immutable quotation snapshot, following policy, tax and buyer revalidation.
 */
export function quotationConversionRequirements(input:{
 state:QuotationState;
 hasAcceptedImmutableSnapshot:boolean;
 hasExplicitMerchantAction:boolean;
 hasReviewedTaxAndBuyer:boolean;
}):readonly string[]{
 const missing:string[]=[];
 if(input.state!=="ACCEPTED")missing.push("Customer acceptance is not verified.");
 if(!input.hasAcceptedImmutableSnapshot)missing.push("No immutable accepted quotation snapshot.");
 if(!input.hasExplicitMerchantAction)missing.push("Merchant has not explicitly requested a new invoice.");
 if(!input.hasReviewedTaxAndBuyer)missing.push("Buyer, dates and tax classifications need fresh review.");
 return missing;
}
/** Receipt provenance is distinct from invoice status, and adds no new cash. */
export function receiptPreparationRequirements(input:{
 verifiedPaymentEvidence:boolean;
 verifiedAllocationOrStandalonePayment:boolean;
 merchantApproved:boolean;
 alreadyReceipted:boolean;
}):readonly string[]{
 const errors:string[]=[];
 if(!input.verifiedPaymentEvidence)errors.push("Trusted cleared-payment evidence is required.");
 if(!input.verifiedAllocationOrStandalonePayment)errors.push("Verified payment linkage is required.");
 if(!input.merchantApproved)errors.push("Authorized merchant receipt approval is required.");
 if(input.alreadyReceipted)errors.push("Prevent duplicate receipt for the same acknowledged allocation.");
 return errors;
}
/** Real sending always requires an authenticated server-issued snapshot. */
export const z03PreviewCapabilities=Object.freeze({
 canIssue:false,canSend:false,canShare:false,canDownloadIssuedPdf:false,
 canAcceptQuotation:false,canConvertQuotation:false,canGenerateReceipt:false,
 canPay:false,canRefund:false,canPublishPortalLink:false,
 source:"FRONTEND_PREVIEW_ONLY" as const
});
