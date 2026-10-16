import type {InvoiceDraft} from "@/src/features/invoice/types";
import type {InvoicePreferences} from "@/src/features/merchant-preview/MerchantPreviewProvider";
const months=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"] as const;
/** One-time new-draft defaults; never retroactively modify issued documents. */
export function applyNewInvoicePreferences(draft:InvoiceDraft,preferences:InvoicePreferences):InvoiceDraft{
 const month=months.indexOf(draft.month.toUpperCase() as typeof months[number]);
 const year=Number(draft.year),day=Number(draft.day);
 const base={...draft,currency:preferences.currency};
 if(preferences.preferredDueDate==="custom"||month<0||!Number.isInteger(year)||!Number.isInteger(day))return base;
 const issued=new Date(Date.UTC(year,month,day));
 if(issued.getUTCFullYear()!==year||issued.getUTCMonth()!==month||issued.getUTCDate()!==day)return base;
 let due:Date;
 if(preferences.preferredDueDate==="1month"){
   const target=new Date(Date.UTC(year,month+1,1));
   const last=new Date(Date.UTC(year,month+2,0)).getUTCDate();
   due=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth(),Math.min(day,last)));
 }else{
   const days=preferences.preferredDueDate==="1week"?7:14;
   due=new Date(issued.getTime()+days*86400000);
 }
 return {...base,dueDay:String(due.getUTCDate()).padStart(2,"0"),dueMonth:months[due.getUTCMonth()],dueYear:String(due.getUTCFullYear())};
}
