import type {CatalogCustomer,CatalogItem} from "./MerchantPreviewProvider";
import type {InvoiceLine} from "../invoice/types";

/** Frontend-only catalogue identity. Never an invoice/document sequence or server ID. */
export function newCatalogPreviewId():string {return crypto.randomUUID();}

/** Copy the fields used for billing; subsequent catalogue edits cannot rewrite this draft. */
export function snapshotCustomer(customer:CatalogCustomer){
 return {
  clientCustomerId:customer.id,
  clientName:customer.billingName?.trim()||customer.name,
  clientEmail:customer.email,
  clientPhone:customer.phone,
  clientAddress:customer.address||customer.addressLine1||"",
  clientType:customer.customerType||"individual" as const,
  clientTaxId:customer.taxId||"",
  clientCompanyRegistration:customer.companyRegistration||"",
  clientCity:customer.city||"",
  clientState:customer.state||"",
  clientPostalCode:customer.postalCode||"",
  clientCountry:customer.country||""
 };
}

/** Catalogue is reusable; invoice line copies values rather than binding live mutable prices. */
export function snapshotItem(item:CatalogItem):Pick<InvoiceLine,"catalogItemId"|"serviceName"|"description"|"unitPrice"|"discount"|"taxClassification">{
 return {
  catalogItemId:item.id,
  serviceName:item.name,
  description:item.description,
  unitPrice:item.rate,
  discount:item.discountPercent,
  taxClassification:item.taxClassification?{...item.taxClassification}:undefined
 };
}
