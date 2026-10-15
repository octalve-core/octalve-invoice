import { formatDocumentNumber } from "./document-number";
export type InvoiceStatus="paid"|"pending"|"overdue"|"draft"|"partial"|"refunded";
export type PreviewInvoice={
 id:string;reference:string;customer:string;amount:string;
 date:string;dueDate:string;email:string;status:InvoiceStatus;
};
const people=["Olamide Ismail","Weyport Energy","Abdulsamad Opabode","Olumide Ismail","Weyport Energy","Olamide Ismail","Abdulsamad Opabode"];
const statuses:InvoiceStatus[]=["pending","overdue","partial","paid","refunded","paid","draft"];
export const previewInvoices:PreviewInvoice[]=people.map((customer,i)=>({
 id:String(i+1),reference:formatDocumentNumber("Octalve Limited",i+1,"invoice"),
 customer,amount:i===3?"₦85,000.00":"₦120,000.00",
 date:"12/6/2024",dueDate:"21/6/2024",
 email:`customer${i+1}@example.invalid`,status:statuses[i]
}));
export const getPreviewInvoice=(id:string)=>previewInvoices.find(i=>i.id===id);
