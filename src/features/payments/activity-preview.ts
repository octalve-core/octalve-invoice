import {paymentPreview,financeProjection,type InvoiceClaim,type PaymentEntry} from "./ledger.ts";

/** Phase 0I UI-only audit rows. No provider/bank proof and no real event ingestion. */
export type ActivityPhase="collection-intent"|"payment-attempt"|"verified-collection"|"provider-payout"|"exception"|"refund-credit";
export type ActivityStatus="active"|"initiated"|"pending"|"expired"|"failed"|"verified"|"awaiting-payout"|"settled"|"late-transfer"|"unmatched"|"underpaid"|"overpaid"|"disputed"|"reversed"|"manual-review"|"refund-pending"|"refunded";
export type ActivityFilter="all"|"verified"|"awaiting-payout"|"settled"|"exceptions"|"refunds";
export type ProviderLabel="Company bank"|"Gateway (example)"|"Virtual account (example)"|"Monnify (example)"|"Flutterwave (example)"|"Paystack (example)";
export interface PaymentActivity{
 id:string;customer:string;phase:ActivityPhase;status:ActivityStatus;
 provider:ProviderLabel;reference:string;amountMinor:number;occurredAt:string;
 invoiceId?:string;paymentId?:string;
 note:string;
}
const sourceLabel:Record<PaymentEntry["source"],ProviderLabel>={
 "manual-bank":"Company bank","gateway":"Gateway (example)","virtual-account":"Virtual account (example)"
};
const currentRows:PaymentActivity[]=paymentPreview.map(payment=>({
 id:"ACT-"+payment.id,customer:payment.customer,phase:payment.status==="verified"?"verified-collection":"payment-attempt",
 status:payment.status==="verified"?"verified":"pending",
 provider:sourceLabel[payment.source],reference:payment.reference,amountMinor:payment.amountMinor,
 occurredAt:payment.date,invoiceId:payment.allocations[0]?.invoiceId,paymentId:payment.id,
 note:payment.status==="verified"?"Example source-verified ledger entry; not an actual collection.":"Unverified example: excluded from totals."
}));
const examples:PaymentActivity[]=[
 {id:"INT-EX-001",customer:"Sample Customer",phase:"collection-intent",status:"active",provider:"Monnify (example)",reference:"EXAMPLE-INT-001",amountMinor:12500000,occurredAt:"12/06/2024",invoiceId:"2",note:"Account request created; no cash received."},
 {id:"INT-EX-002",customer:"Sample Customer",phase:"collection-intent",status:"expired",provider:"Flutterwave (example)",reference:"EXAMPLE-INT-002",amountMinor:5000000,occurredAt:"12/06/2024",invoiceId:"2",note:"Collection instruction expired. The original invoice remains open."},
 {id:"ATT-EX-003",customer:"Sample Customer",phase:"payment-attempt",status:"initiated",provider:"Paystack (example)",reference:"EXAMPLE-ATT-003",amountMinor:3000000,occurredAt:"12/06/2024",invoiceId:"1",note:"Initialized checkout. Not evidence of payment."},
 {id:"PAY-EX-004",customer:"Sample Customer",phase:"provider-payout",status:"awaiting-payout",provider:"Gateway (example)",reference:"EXAMPLE-SET-004",amountMinor:12000000,occurredAt:"12/06/2024",paymentId:"PAY-00002",note:"Illustrative payout reconciliation; does not add another collection."},
 {id:"PAY-EX-005",customer:"Sample Customer",phase:"provider-payout",status:"settled",provider:"Gateway (example)",reference:"EXAMPLE-SET-005",amountMinor:11500000,occurredAt:"12/06/2024",paymentId:"PAY-00002",note:"Illustrative net payout after example fees, not another invoice payment."},
 {id:"EXC-EX-006",customer:"Sample Customer",phase:"exception",status:"late-transfer",provider:"Monnify (example)",reference:"EXAMPLE-LATE-006",amountMinor:4200000,occurredAt:"12/06/2024",invoiceId:"2",note:"Post-expiry transfer alleged. Verify accepted/reversed outcome with provider; never mark paid."},
 {id:"EXC-EX-007",customer:"Sample Customer",phase:"exception",status:"unmatched",provider:"Flutterwave (example)",reference:"EXAMPLE-UNMATCH-007",amountMinor:2500000,occurredAt:"12/06/2024",note:"Investigate reference, merchant and bank/provider evidence; do not allocate."},
 {id:"EXC-EX-008",customer:"Sample Customer",phase:"exception",status:"manual-review",provider:"Company bank",reference:"EXAMPLE-MANUAL-008",amountMinor:2000000,occurredAt:"12/06/2024",note:"Manual bank proof awaiting role-gated clearance; screenshot is not verification."},
 {id:"EXC-EX-009",customer:"Sample Customer",phase:"exception",status:"overpaid",provider:"Monnify (example)",reference:"EXAMPLE-OVER-009",amountMinor:21000000,occurredAt:"12/06/2024",note:"Unapplied excess must be treated as held funds; do not count extra invoiced revenue."},
 {id:"EXC-EX-010",customer:"Sample Customer",phase:"exception",status:"reversed",provider:"Paystack (example)",reference:"EXAMPLE-REV-010",amountMinor:1500000,occurredAt:"12/06/2024",note:"Illustrative reversal; reopen allocation only through approved corrective ledger event."},
 {id:"REF-EX-011",customer:"Sample Customer",phase:"refund-credit",status:"refund-pending",provider:"Company bank",reference:"EXAMPLE-REF-011",amountMinor:1000000,occurredAt:"12/06/2024",note:"Refund is requested, not paid. Receipt/credit note does not create an outflow."},
 {id:"REF-EX-012",customer:"Sample Customer",phase:"refund-credit",status:"refunded",provider:"Gateway (example)",reference:"EXAMPLE-REF-012",amountMinor:500000,occurredAt:"12/06/2024",note:"Illustrative refund state, not applied to ledger totals without a verified RefundEntry."},
];
export const paymentActivityPreview:ReadonlyArray<PaymentActivity>=[...currentRows,...examples];
export const activityTabs:ReadonlyArray<{id:ActivityFilter;label:string}>= [
 {id:"all",label:"All activity"},{id:"verified",label:"Verified collections"},
 {id:"awaiting-payout",label:"Awaiting payout"},{id:"settled",label:"Provider settled"},
 {id:"exceptions",label:"Exceptions"},{id:"refunds",label:"Refunds & credits"}
];
export const exceptionStatuses:ReadonlyArray<ActivityStatus>=["late-transfer","unmatched","underpaid","overpaid","disputed","reversed","manual-review","failed"];
export function filterPaymentActivity(rows:ReadonlyArray<PaymentActivity>,filter:ActivityFilter,query:string,provider:string="all"):PaymentActivity[]{
 const q=query.trim().toLocaleLowerCase("en");
 return rows.filter(row=>{
  const inTab=filter==="all"||
   filter==="verified"&&row.phase==="verified-collection"&&row.status==="verified"||
   filter==="awaiting-payout"&&row.phase==="provider-payout"&&row.status==="awaiting-payout"||
   filter==="settled"&&row.phase==="provider-payout"&&row.status==="settled"||
   filter==="exceptions"&&row.phase==="exception"||
   filter==="refunds"&&row.phase==="refund-credit";
  return inTab&&(provider==="all"||row.provider===provider)&&(!q||
   [row.id,row.customer,row.reference,row.invoiceId??"",row.provider,row.status,row.paymentId??""].some(v=>v.toLocaleLowerCase("en").includes(q)));
 });
}
/** Money totals come ONLY from ledger's existing verified payment sources; no activity row adds cash. */
export function activityProjection(invoices:InvoiceClaim[],payments:PaymentEntry[]){
 return financeProjection(invoices,payments,[]);
}
export function validatePaymentActivity(rows:ReadonlyArray<PaymentActivity>):string[]{
 const errors:string[]=[],ids=new Set<string>();
 for(const row of rows){
  if(!row.id||ids.has(row.id))errors.push("Duplicate activity event identifier");
  ids.add(row.id);
  if(!Number.isSafeInteger(row.amountMinor)||row.amountMinor<=0)errors.push("Invalid minor-unit amount");
  if(row.phase==="collection-intent"&&["verified","settled","refunded"].includes(row.status))errors.push("Intent cannot confirm cash");
  if(row.phase==="verified-collection"&&(row.status!=="verified"||!row.paymentId))errors.push("Verified collection needs source evidence");
  if(row.phase==="provider-payout"&&!["awaiting-payout","settled"].includes(row.status))errors.push("Payout status mismatch");
  if(row.phase==="refund-credit"&&!["refund-pending","refunded"].includes(row.status))errors.push("Refund status mismatch");
 }
 return errors;
}
