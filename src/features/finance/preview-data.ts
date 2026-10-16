import {previewInvoices} from "@/src/features/invoices/lib/preview-records";
import {getPreviewRecords} from "@/src/features/records/preview-records";
import {paymentPreview} from "@/src/features/payments/ledger";

export const financeModes=[
 "statement","approvals","receivables","adjustments","communications","reconciliation","audit","currencies"
] as const;
export type FinanceMode=typeof financeModes[number];
export type FinanceRow={
 id:string;reference:string;title:string;date:string;status:string;
 amountMinor?:number;type:string;details:string;customer?:string;
 sourceHref?:string; secondary?:string; due?:string;
};
export type FinanceDefinition={title:string;description:string;metric:string;note:string;statuses:string[];columns:[string,string,string,string,string];primaryAction:string};
export const financeDefinitions:Record<FinanceMode,FinanceDefinition>={
 statement:{title:"Statements of Account",description:"A chronological view of customer invoices and their verified payment allocations.",metric:"Net customer receivables",note:"Amounts reflect sample issued invoices less sample verified allocations. Receipt documents do not create collections.",statuses:["invoice","payment"],columns:["Reference","Customer","Event","Debit / Credit","Running balance"],primaryAction:"Prepare statement"},
 approvals:{title:"Approval Workflows",description:"Review sensitive changes before any money, access or issued document is affected.",metric:"Requests awaiting approval",note:"No actual approvals or role grants exist in this Preview; the queue is deliberately empty.",statuses:["pending","approved","rejected"],columns:["Reference","Request","Action","Status","Submitted"],primaryAction:"Request approval"},
 receivables:{title:"Receivables Ageing",description:"Group unpaid invoice balances by elapsed time since each invoice's due date.",metric:"Sample outstanding",note:"Only issued invoice balances net of verified allocations are shown; these are 2024 demo records, not live arrears.",statuses:["current","1–30 days","31–60 days","61–90 days","90+ days"],columns:["Invoice","Customer","Due date","Outstanding","Age bucket"],primaryAction:"Review receivables"},
 adjustments:{title:"Credit & Debit Notes",description:"Keep traceable adjustments linked to original issued documents.",metric:"Sample credit notes",note:"Credit notes here are seeded examples. No debit notes or taxable corrections have been issued.",statuses:["credit","debit"],columns:["Reference","Customer","Document","Amount","Status"],primaryAction:"Prepare adjustment"},
 communications:{title:"Communication History",description:"Track reminders, invoices and customer notices without inventing delivery receipts.",metric:"Confirmed deliveries",note:"The Preview has no authenticated mail outbox; an invoice being listed does not mean email was sent.",statuses:["draft","queued","sent","delivered","failed"],columns:["Invoice","Customer","Channel","State","Date"],primaryAction:"Compose message"},
 reconciliation:{title:"Bank Reconciliation",description:"Review existing sample verified payments and distinguish provider confirmation from bank matching.",metric:"Sample allocations",note:"Verified sample payments are not proof that a live bank statement was imported or reconciled.",statuses:["manual-bank","gateway","virtual-account"],columns:["Payment","Customer","Source","Amount","Allocation"],primaryAction:"Import statement"},
 audit:{title:"Audit & Exception Centre",description:"Investigate authorized changes, payment exceptions, retries and compliance failures.",metric:"Verified audit events",note:"No actual server-authoritative audit log exists in Phase 0I. Sample finance records are not an audit history.",statuses:["open","resolved","investigating"],columns:["Event","Actor","Type","Status","Occurred"],primaryAction:"Review exceptions"},
 currencies:{title:"Multi-currency",description:"See source amounts separately from functional-currency conversions and rate history.",metric:"Configured base currency",note:"The existing sample invoices are NGN. No external FX quotes or cross-currency collections have been imported.",statuses:["NGN","USD","GBP","EUR"],columns:["Reference","Customer","Currency","Amount","FX source"],primaryAction:"Review currencies"}
};
const money=(s:string)=>Math.round(Number(s.replace(/[^0-9.]/g,""))*100);
const parsed=(s:string)=>{const parts=s.split("/");return parts.length===3?new Date(Date.UTC(Number(parts[2]),Number(parts[1])-1,Number(parts[0]))):new Date(NaN);};
const safeAmount=(n:number)=>{if(!Number.isSafeInteger(n)||n<0)throw new Error("Invalid finance preview amount");return n;};
const issued=previewInvoices.filter(i=>i.status!=="draft").map(i=>({...i,amountMinor:safeAmount(money(i.amount))}));
const allocations=paymentPreview.filter(p=>p.status==="verified").flatMap(p=>p.allocations.map(a=>({...a,paymentId:p.id,date:p.date,source:p.source,customer:p.customer})));
const allocated=(id:string)=>safeAmount(allocations.filter(a=>a.invoiceId===id).reduce((sum,a)=>sum+safeAmount(a.amountMinor),0));
export const formatMinor=(minor:number,currency="NGN")=>new Intl.NumberFormat("en-NG",{style:"currency",currency,minimumFractionDigits:2,maximumFractionDigits:2}).format(safeAmount(minor)/100);

export function getFinanceRows(mode:FinanceMode,asOf=new Date("2026-10-16T00:00:00Z")):FinanceRow[]{
 if(mode==="statement"){
  const events:FinanceRow[]=[
   ...issued.map(i=>({id:"i-"+i.id,reference:i.reference,title:i.customer,date:i.date,status:"invoice",type:"Invoice",customer:i.customer,amountMinor:i.amountMinor,details:"Issued invoice (debit)",sourceHref:"/dashboard/invoice/"+i.id})),
   ...allocations.flatMap((a,index)=>{
    const claim=issued.find(i=>i.id===a.invoiceId);
    return claim?[{id:"p-"+a.paymentId+"-"+index,reference:a.paymentId,title:claim.customer,date:a.date,status:"payment",type:"Payment",customer:claim.customer,amountMinor:-a.amountMinor,details:"Verified sample payment allocation (credit)",sourceHref:"/dashboard/invoice/"+claim.id}]:[];
   })
  ];
  return events.sort((a,b)=>parsed(a.date).getTime()-parsed(b.date).getTime()||(a.status==="invoice"?-1:1)-(b.status==="invoice"?-1:1));
 }
 if(mode==="receivables")return issued.map(i=>{
  const remaining=safeAmount(i.amountMinor-allocated(i.id));if(remaining===0)return null;
  const days=Math.max(0,Math.floor((asOf.getTime()-parsed(i.dueDate).getTime())/86400000));
  const bucket=days===0||asOf<parsed(i.dueDate)?"current":days<=30?"1–30 days":days<=60?"31–60 days":days<=90?"61–90 days":"90+ days";
  return {id:i.id,reference:i.reference,title:i.customer,customer:i.customer,date:i.date,due:i.dueDate,status:bucket,type:"Invoice",amountMinor:remaining,details:"Verified allocated sample funds deducted; "+days+" day(s) past due",sourceHref:"/dashboard/invoice/"+i.id};
 }).filter((x):x is NonNullable<typeof x>=>x!==null);
 if(mode==="adjustments")return getPreviewRecords("creditNote","Octalve Limited").map(x=>({id:x.id,reference:x.reference,title:x.title,date:x.date,status:"credit",type:"Credit note · "+x.status,amountMinor:money(x.amount||"0"),customer:x.title,details:"Seeded credit-note document; cannot alter posted invoice/payment totals from this screen",sourceHref:"/dashboard/credit-note"}));
 if(mode==="reconciliation")return paymentPreview.map(p=>({id:p.id,reference:p.reference,title:p.customer,date:p.date,status:p.source,type:p.source,amountMinor:p.amountMinor,customer:p.customer,details:p.allocations.length+" linked invoice allocation(s) · "+p.status+" sample payment event. Not a live bank-statement match."}));
 if(mode==="currencies")return issued.map(i=>({id:i.id,reference:i.reference,title:i.customer,date:i.date,status:"NGN",type:"NGN",amountMinor:i.amountMinor,details:"Original currency NGN · 1:1 base unit; no FX quote applied",customer:i.customer,sourceHref:"/dashboard/invoice/"+i.id}));
 return [];
}
export function getFinanceMetrics(mode:FinanceMode,rows:FinanceRow[]){
 if(mode==="statement"){
  const invoiced=issued.reduce((s,i)=>s+i.amountMinor,0);
  const paid=allocations.reduce((s,a)=>s+a.amountMinor,0);
  return [{label:"Issued claims",value:formatMinor(invoiced)},{label:"Verified allocations",value:formatMinor(paid)},{label:"Outstanding",value:formatMinor(Math.max(0,invoiced-paid))}];
 }
 if(mode==="receivables"){
  const buckets=["current","1–30 days","31–60 days","61–90 days","90+ days"];
  return buckets.map(status=>({label:status==="current"?"Not yet overdue":status,value:formatMinor(rows.filter(r=>r.status===status).reduce((s,r)=>s+(r.amountMinor||0),0))}));
 }
 if(mode==="adjustments")return [{label:"Example credit notes",value:String(rows.length)},{label:"Issued debit notes",value:"0"},{label:"Real adjustments",value:"Not connected"}];
 if(mode==="reconciliation")return [{label:"Demo payment events",value:String(rows.length)},{label:"Allocated source events",value:String(rows.filter(r=>r.details.includes("linked invoice")).length)},{label:"Bank imports",value:"0"}];
 if(mode==="currencies")return [{label:"Base currency",value:"NGN"},{label:"Foreign currencies live",value:"0"},{label:"Rates imported",value:"0"}];
 return [{label:mode==="communications"?"Confirmed deliveries":mode==="audit"?"Verified audit events":"Approval requests",value:"0"},{label:"Live connection",value:"Not enabled"},{label:"Preview status",value:"Read-only"}];
}
