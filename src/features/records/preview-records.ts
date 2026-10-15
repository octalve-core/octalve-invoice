import {formatDocumentNumber,type DocumentType} from "@/src/features/invoices/lib/document-number";
import {previewInvoices} from "@/src/features/invoices/lib/preview-records";

export type RecordKind="invoice"|"receipt"|"quotation"|"expense"|"creditNote"|"customer"|"staff"|"item";
export type RecordStatus="pending"|"paid"|"overdue"|"draft"|"refunded"|"partial"|"sent"|"declined"|"accepted"|"active"|"inactive"|"available"|"settled"|"open";
export type RecordField="reference"|"title"|"amount"|"date"|"dueDate"|"email"|"paymentMethod"|"category"|"status";
export interface PreviewRecord {
 id:string; kind:RecordKind; reference:string; title:string; status:RecordStatus;
 amount?:string; date:string; dueDate?:string; email?:string; paymentMethod?:string; category?:string;
 relatedInvoiceId?:string; paymentOrigin?:"linked-invoice"|"manual";
}
type Sample=Omit<PreviewRecord,"id"|"kind"|"reference"> & {relatedInvoiceId?:string};
export interface ListDefinition {
 title:string;plural:string;description:string;code:DocumentType;
 columns:ReadonlyArray<{field:RecordField;title:string}>;statuses:ReadonlyArray<RecordStatus>;
}
export const definitions:Record<RecordKind,ListDefinition>={
 invoice:{title:"Invoice",plural:"invoices",description:"Create and manage your invoices",code:"invoice",
 columns:[{field:"reference",title:"Invoice no"},{field:"title",title:"Name"},{field:"amount",title:"Amount"},{field:"date",title:"Date created"},{field:"dueDate",title:"Date due"},{field:"email",title:"Email"},{field:"status",title:"Status"}],
 statuses:["pending","paid","overdue","draft","partial","refunded"]},
 receipt:{title:"Receipt",plural:"receipts",description:"Document payments received when a receipt is needed",code:"receipt",
 columns:[{field:"reference",title:"Receipt no"},{field:"title",title:"Name"},{field:"amount",title:"Amount"},{field:"paymentMethod",title:"Payment method"},{field:"date",title:"Date received"},{field:"email",title:"Email"},{field:"status",title:"Status"}],
 statuses:["paid","refunded","draft"]},
 quotation:{title:"Quotation",plural:"quotations",description:"Prepare and manage estimates — not payment records",code:"quotation",
 columns:[{field:"reference",title:"Quotation no"},{field:"title",title:"Client"},{field:"amount",title:"Amount"},{field:"date",title:"Date created"},{field:"dueDate",title:"Valid until"},{field:"email",title:"Email"},{field:"status",title:"Status"}],
 statuses:["sent","draft","accepted","declined"]},
 expense:{title:"Expenses",plural:"expenses",description:"Track and manage business expenses",code:"expense",
 columns:[{field:"reference",title:"Reference"},{field:"title",title:"Vendor"},{field:"category",title:"Category"},{field:"amount",title:"Amount"},{field:"date",title:"Date"},{field:"paymentMethod",title:"Payment method"},{field:"status",title:"Status"}],
 statuses:["paid","pending","overdue","draft","refunded"]},
 creditNote:{title:"Credit Note",plural:"credit notes",description:"Track customer credits and possible refunds separately",code:"creditNote",
 columns:[{field:"reference",title:"Credit no"},{field:"title",title:"Customer"},{field:"amount",title:"Credit amount"},{field:"date",title:"Date"},{field:"email",title:"Email"},{field:"status",title:"Status"}],
 statuses:["open","partial","settled","refunded","draft"]},
 customer:{title:"Customers",plural:"customers",description:"Keep customer contacts and account details organized",code:"customer",
 columns:[{field:"reference",title:"Customer ID"},{field:"title",title:"Customer"},{field:"category",title:"Business"},{field:"email",title:"Email"},{field:"date",title:"Date added"},{field:"amount",title:"Amount due"},{field:"status",title:"Status"}],
 statuses:["active","inactive"]},
 staff:{title:"Staff",plural:"staff members",description:"Team and permissions preview",code:"staff",
 columns:[{field:"reference",title:"Staff ID"},{field:"title",title:"Name"},{field:"category",title:"Role"},{field:"email",title:"Email"},{field:"date",title:"Date added"},{field:"status",title:"Status"}],
 statuses:["active","inactive"]},
 item:{title:"Items",plural:"items",description:"Manage products and services",code:"item",
 columns:[{field:"reference",title:"Item ID"},{field:"title",title:"Product / service"},{field:"category",title:"Category"},{field:"amount",title:"Unit price"},{field:"date",title:"Date added"},{field:"status",title:"Status"}],
 statuses:["available","inactive"]}
};
const day="12/6/2024",due="21/6/2024",email="customer@example.invalid";
const samples:Record<Exclude<RecordKind,"invoice">,Sample[]>={
 receipt:[
 {title:"Weyport Energy",amount:"₦120,000.00",date:day,email,status:"paid",paymentMethod:"Bank Transfer",relatedInvoiceId:"4",paymentOrigin:"linked-invoice"},
 {title:"Olamide Ismail",amount:"₦95,000.00",date:day,email,status:"paid",paymentMethod:"Cash",paymentOrigin:"manual"},
 {title:"Olamide Ismail",amount:"₦25,000.00",date:day,email,status:"refunded",paymentMethod:"Bank Transfer",paymentOrigin:"manual"},
 {title:"Weyport Energy",amount:"₦130,000.00",date:day,email,status:"draft",paymentMethod:"Bank Cheque",paymentOrigin:"manual"},
 {title:"Sample Customer",amount:"₦55,000.00",date:day,email,status:"paid",paymentMethod:"Card",paymentOrigin:"manual"}
 ],
 quotation:[
 {title:"Olamide Ismail",amount:"₦120,000.00",date:day,dueDate:due,email,status:"sent"},
 {title:"Weyport Energy",amount:"₦255,090.00",date:day,dueDate:due,email,status:"draft"},
 {title:"Sample Customer",amount:"₦500,000.00",date:day,dueDate:due,email,status:"accepted"},
 {title:"Weyport Energy",amount:"₦125,000.00",date:day,dueDate:due,email,status:"declined"},
 {title:"Olamide Ismail",amount:"₦352,090.00",date:day,dueDate:due,email,status:"sent"}
 ],
 expense:[
 {title:"Office Supplies Ltd",category:"Office Supplies",amount:"₦25,000.00",date:day,paymentMethod:"Bank Transfer",status:"paid"},
 {title:"MTN Nigeria",category:"Utilities",amount:"₦15,000.00",date:day,paymentMethod:"Card",status:"paid"},
 {title:"Lagos Electricity",category:"Utilities",amount:"₦50,000.00",date:day,paymentMethod:"Bank Transfer",status:"pending"},
 {title:"Uber for Business",category:"Transport",amount:"₦35,000.00",date:day,paymentMethod:"Card",status:"paid"},
 {title:"Rent - Victoria Island",category:"Rent",amount:"₦450,000.00",date:day,paymentMethod:"Bank Transfer",status:"overdue"}
 ],
 creditNote:[
 {title:"Olamide Ismail",amount:"₦20,000.00",date:day,email,status:"open",relatedInvoiceId:"3"},
 {title:"Weyport Energy",amount:"₦15,000.00",date:day,email,status:"partial",relatedInvoiceId:"4"},
 {title:"Sample Customer",amount:"₦25,000.00",date:day,email,status:"settled"},
 {title:"Olamide Ismail",amount:"₦55,000.00",date:day,email,status:"refunded"},
 {title:"Weyport Energy",amount:"₦5,000.00",date:day,email,status:"draft"}
 ],
 customer:[
 {title:"Olamide Ismail",category:"Bi Creativity",amount:"₦120,000.00",date:day,email:"olamide@example.invalid",status:"active"},
 {title:"Weyport Energy",category:"Weyport Energy Ltd",amount:"₦0.00",date:day,email:"weyport@example.invalid",status:"active"},
 {title:"Sample Customer",category:"Sample Enterprises",amount:"₦35,000.00",date:day,email,status:"inactive"},
 {title:"Akanji Usman",category:"Private Customer",amount:"₦0.00",date:day,email,status:"active"},
 {title:"Mary Steve",category:"All Kitchen Store",amount:"₦0.00",date:day,email,status:"active"}
 ],
 staff:[
 {title:"Idris Jamiu",category:"Salesperson",date:day,email:"staff1@example.invalid",status:"active"},
 {title:"Sample Accountant",category:"Accountant",date:day,email:"staff2@example.invalid",status:"inactive"}
 ],
 item:[
 {title:"Dell 512SSD Laptop",category:"Goods",amount:"₦550,000.00",date:day,status:"available"},
 {title:"Consulting services",category:"Service",amount:"₦120,000.00",date:day,status:"available"},
 {title:"Laptop charger",category:"Goods",amount:"₦6,250.00",date:day,status:"inactive"}
 ]
};
export function getPreviewRecords(kind:RecordKind,merchant:string):PreviewRecord[]{
 if(kind==="invoice")return previewInvoices.map(r=>({id:r.id,kind,reference:formatDocumentNumber(merchant,Number(r.id),"invoice"),title:r.customer,amount:r.amount,date:r.date,dueDate:r.dueDate,email:r.email,status:r.status}));
 return samples[kind].map((record,index)=>({...record,id:String(index+1),kind,reference:formatDocumentNumber(merchant,index+1,definitions[kind].code)}));
}
/** UI-only samples: a paid invoice does not create a receipt entry. Receipt issuance is explicit. */
export function getRelatedPreviewInvoice(receipt:PreviewRecord){
 return receipt.kind==="receipt"&&receipt.relatedInvoiceId?previewInvoices.find(i=>i.id===receipt.relatedInvoiceId):undefined;
}
