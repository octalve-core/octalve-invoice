import type {InvoiceDraft} from "@/src/features/invoice/types";
import type {MerchantPreviewSettings,InvoiceAppearance} from "@/src/features/merchant-preview/MerchantPreviewProvider";

/**
 * Detached document-party preparation data. NOT an issued invoice, fiscal
 * snapshot, official number, signature, audit record or document authority.
 * The approved server issuance transaction must validate, allocate numbers
 * and persist its own immutable version from canonical tenant data.
 */
export type DraftIssueSnapshotProposal=Readonly<{
 kind:"DRAFT_PREPARATION_ONLY";
 seller:Readonly<{name:string;registration:string;taxId:string;address:string;email:string;phone:string}>;
 buyer:Readonly<{
  customerId:string;name:string;customerType:"individual"|"business";
  email:string;phone:string;address:string;city:string;state:string;postalCode:string;country:string;taxId:string;companyRegistration:string;
 }>;
 document:Readonly<{
  requestedNumber:string;currency:InvoiceDraft["currency"];date:string;dueDate:string;
  template:string;templateVersion:string;accent:string;
  lines:readonly Readonly<{name:string;description:string;quantity:string;unitPrice:string;discount:string}>[];
 }>;
 fiscal:Readonly<{nrsStatus:"not_submitted";irn:null;officialQr:null;taxClassification:"unreviewed"}>;
}>;
const date=(day:string,month:string,year:string)=>[year,month,day].join("-");
/** Values are copied from a draft into a standalone immutable proposal. */
export function prepareDraftIssueSnapshot(
 draft:InvoiceDraft,merchant:MerchantPreviewSettings,appearance:InvoiceAppearance
):DraftIssueSnapshotProposal{
 const lines=draft.rows.map(row=>Object.freeze({
  name:row.serviceName,description:row.description,quantity:row.quantity,unitPrice:row.unitPrice,discount:row.discount
 }));
 return Object.freeze({
  kind:"DRAFT_PREPARATION_ONLY" as const,
  seller:Object.freeze({
   name:merchant.businessName,registration:merchant.rcNumber,taxId:merchant.taxId,
   address:merchant.businessAddress,email:merchant.email,phone:merchant.businessPhone
  }),
  buyer:Object.freeze({
   customerId:draft.clientCustomerId??"",name:draft.clientName,customerType:draft.clientType??"individual",
   email:draft.clientEmail,phone:draft.clientPhone,address:draft.clientAddress,
   city:draft.clientCity??"",state:draft.clientState??"",postalCode:draft.clientPostalCode??"",
   country:draft.clientCountry??"",taxId:draft.clientTaxId??"",
   companyRegistration:draft.clientCompanyRegistration??""
  }),
  document:Object.freeze({
   requestedNumber:draft.invoiceNo,currency:draft.currency,date:date(draft.day,draft.month,draft.year),
   dueDate:date(draft.dueDay,draft.dueMonth,draft.dueYear),
   template:appearance.template,templateVersion:"preview-config-v1",accent:appearance.accent,
   lines:Object.freeze(lines)
  }),
  fiscal:Object.freeze({nrsStatus:"not_submitted" as const,irn:null,officialQr:null,taxClassification:"unreviewed" as const})
 });
}
