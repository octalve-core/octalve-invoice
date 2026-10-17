import {createPreviewInvoice} from "./preview-fixture";
import {formatDocumentNumber} from "./document-number";
import type {PreviewInvoice} from "./preview-records";
import type {InvoiceDraft} from "@/src/features/invoice/types";

/** One readonly-preview source for BOTH audiences; never an issued/saved invoice. */
export function buildAudiencePreviewDraft(record:PreviewInvoice,businessName:string):InvoiceDraft{
 const initial=createPreviewInvoice();
 const amountText=record.amount.replace(/[^0-9.]/g,"");
 const amount=Number(amountText);
 // Public demo fixtures only; never reconstruct a live invoice from a formatted amount.
 const value=Number.isFinite(amount)&&amount>=0?amount.toFixed(2):"0";
 const parseDisplay=(value:string)=>{
  const match=/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
  if(!match)return null;
  const [,dd,mm,yyyy]=match;
  const year=Number(yyyy),month=Number(mm),day=Number(dd);
  const date=new Date(Date.UTC(year,month-1,day));
  if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day)return null;
  return {day:dd.padStart(2,"0"),month:["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][month-1],year:yyyy};
 };
 const date=parseDisplay(record.date),due=parseDisplay(record.dueDate);
 const number=Number(record.id);
 return {
  ...initial,
  invoiceNo:formatDocumentNumber(businessName||"Business",Number.isSafeInteger(number)&&number>0?number:1,"invoice"),
  clientName:record.customer,
  clientEmail:record.email,
  ...(date?{day:date.day,month:date.month,year:date.year}:{}),
  ...(due?{dueDay:due.day,dueMonth:due.month,dueYear:due.year}:{}),
  rows:[{id:"audience-preview-line",serviceName:"Sample invoice item",description:"Demonstration only",quantity:"1",unitPrice:value,discount:"0"}],
  discount:"0",tax:"0",notes:"",extraDetailsVisible:false
 };
}
