/** Ledger projections. Payments—not documents—are the sole basis for cash received.
 * All amounts are integer minor units; NEVER count receipt documents as additional cash.
 * Preview examples only. A real ledger requires server verification, idempotency and RBAC.
 */
export type PaymentSource="manual-bank"|"gateway"|"virtual-account";
export type PaymentStatus="verified"|"pending";
export interface InvoiceClaim {id:string;amountMinor:number;issued:boolean;}
export interface PaymentAllocation {invoiceId:string;amountMinor:number;}
export interface PaymentEntry {
 id:string;customer:string;reference:string;amountMinor:number;source:PaymentSource;
 status:PaymentStatus;date:string;allocations:PaymentAllocation[];receiptId?:string;
}
export interface RefundEntry {id:string;paymentId:string;amountMinor:number;status:PaymentStatus;}
export function financeProjection(invoices:InvoiceClaim[],payments:PaymentEntry[],refunds:RefundEntry[]){
 const amount=(n:number)=>{if(!Number.isSafeInteger(n)||n<0)throw new Error("Invalid minor-unit amount");return n;};
 const claims=new Map(invoices.filter(i=>i.issued).map(i=>[i.id,amount(i.amountMinor)]));
 const unique=new Map<string,PaymentEntry>();
 for(const p of payments){
  amount(p.amountMinor);
  if(!unique.has(p.id))unique.set(p.id,p);
 }
 const approved=[...unique.values()].filter(p=>p.status==="verified");
 const invoiceAllocations=new Map<string,number>();
 let collectedMinor=0,unallocatedMinor=0;
 for(const payment of approved){
  collectedMinor+=payment.amountMinor;
  let allocated=0;
  for(const a of payment.allocations){
   amount(a.amountMinor);
   if(!claims.has(a.invoiceId))throw new Error("Allocation references an unissued or unknown invoice");
   allocated+=a.amountMinor;
   invoiceAllocations.set(a.invoiceId,(invoiceAllocations.get(a.invoiceId)||0)+a.amountMinor);
  }
  if(allocated>payment.amountMinor)throw new Error("Payment allocations exceed received amount");
  unallocatedMinor+=payment.amountMinor-allocated;
 }
 for(const [id,allocated] of invoiceAllocations){
  if(allocated>(claims.get(id)||0))throw new Error("Invoice allocations exceed invoice balance");
 }
 const seenRefunds=new Set<string>();let refundedMinor=0;
 for(const refund of refunds){
  if(seenRefunds.has(refund.id))continue;seenRefunds.add(refund.id);
  amount(refund.amountMinor);
  if(refund.status!=="verified")continue;
  if(!unique.get(refund.paymentId)||unique.get(refund.paymentId)?.status!=="verified")throw new Error("Refund has no verified source payment");
  refundedMinor+=refund.amountMinor;
 }
 if(refundedMinor>collectedMinor)throw new Error("Refunds exceed collected funds");
 const invoicedMinor=[...claims.values()].reduce((a,b)=>a+b,0);
 const allocatedMinor=[...invoiceAllocations.values()].reduce((a,b)=>a+b,0);
 return {invoicedMinor,allocatedMinor,outstandingMinor:invoicedMinor-allocatedMinor,collectedMinor,unallocatedMinor,refundedMinor,netCollectedMinor:collectedMinor-refundedMinor};
}
export const paymentPreview:PaymentEntry[]=[
 {id:"PAY-00001",customer:"Olumide Ismail",reference:"BANK-2024-001",source:"manual-bank",status:"verified",amountMinor:8500000,date:"12/06/2024",allocations:[{invoiceId:"4",amountMinor:8500000}],receiptId:"1"},
 {id:"PAY-00002",customer:"Olamide Ismail",reference:"PAY-REF-002",source:"gateway",status:"verified",amountMinor:12000000,date:"12/06/2024",allocations:[{invoiceId:"6",amountMinor:12000000}]},
 {id:"PAY-00003",customer:"Abdulsamad Opabode",reference:"BANK-2024-003",source:"manual-bank",status:"verified",amountMinor:5000000,date:"12/06/2024",allocations:[{invoiceId:"3",amountMinor:5000000}]},
 {id:"PAY-00004",customer:"Olamide Ismail",reference:"CASH-2024-004",source:"manual-bank",status:"verified",amountMinor:9500000,date:"12/06/2024",allocations:[],receiptId:"2"},
 {id:"PAY-00005",customer:"Olamide Ismail",reference:"VIRTUAL-2024-005",source:"virtual-account",status:"pending",amountMinor:12000000,date:"12/06/2024",allocations:[{invoiceId:"1",amountMinor:12000000}]}
];
export const refundPreview:RefundEntry[]=[];
