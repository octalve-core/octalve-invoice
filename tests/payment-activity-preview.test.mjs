import test from "node:test";
import assert from "node:assert/strict";
import {paymentPreview,financeProjection} from "../src/features/payments/ledger.ts";
import {paymentActivityPreview,filterPaymentActivity,activityProjection,validatePaymentActivity,activityTabs} from "../src/features/payments/activity-preview.ts";
const invoices=[
 {id:"4",amountMinor:10000000,issued:true},{id:"6",amountMinor:15000000,issued:true},{id:"3",amountMinor:5000000,issued:true},{id:"1",amountMinor:25000000,issued:true}
];
test("All activity classes have truthful filters and source-linked verified entries",()=>{
 assert.deepEqual(validatePaymentActivity(paymentActivityPreview),[]);
 assert.equal(activityTabs.length,6);
 assert.ok(filterPaymentActivity(paymentActivityPreview,"all","").length>10);
 for(const [tab,phase] of [["verified","verified-collection"],["awaiting-payout","provider-payout"],["settled","provider-payout"],["exceptions","exception"],["refunds","refund-credit"]]){
  const rows=filterPaymentActivity(paymentActivityPreview,tab,"");
  assert.ok(rows.length>0,tab);
  assert.ok(rows.every(x=>x.phase===phase),tab);
 }
 const verified=filterPaymentActivity(paymentActivityPreview,"verified","");
 assert.equal(verified.length,paymentPreview.filter(p=>p.status==="verified").length);
 assert.ok(verified.every(x=>x.paymentId&&paymentPreview.some(p=>p.id===x.paymentId&&p.status==="verified")));
 assert.ok(filterPaymentActivity(paymentActivityPreview,"all","EXAMPLE-LATE-006").some(x=>x.status==="late-transfer"));
 assert.ok(filterPaymentActivity(paymentActivityPreview,"all","sample customer","Monnify (example)").length>0);
 assert.equal(filterPaymentActivity(paymentActivityPreview,"all","zzz-not-found").length,0);
});
test("Only existing verified ledger events feed collections, never intents/payout/refund sample cards",()=>{
 const original=financeProjection(invoices,paymentPreview,[]);
 const derived=activityProjection(invoices,paymentPreview);
 assert.deepEqual(derived,original);
 assert.equal(original.collectedMinor,35000000);
 assert.equal(original.unallocatedMinor,9500000);
 assert.equal(original.allocatedMinor,25500000);
 assert.equal(original.collectedMinor,original.allocatedMinor+original.unallocatedMinor);
 const attempts=paymentActivityPreview.filter(row=>row.phase==="collection-intent"||row.phase==="payment-attempt");
 assert.ok(attempts.length>=3);
 assert.ok(attempts.every(row=>row.phase!=="verified-collection"));
});
test("Duplicate event identifiers and pretend verified intents are rejected",()=>{
 const initial=paymentActivityPreview[0];
 assert.match(validatePaymentActivity([initial,initial]).join(" " ),/Duplicate/);
 assert.match(validatePaymentActivity([{...initial,phase:"collection-intent",status:"verified"}]).join(" "),/Intent cannot confirm cash/);
 assert.match(validatePaymentActivity([{...initial,phase:"verified-collection",paymentId:undefined}]).join(" "),/source evidence/);
 assert.match(validatePaymentActivity([{...initial,amountMinor:-20}]).join(" "),/Invalid minor-unit/);
});
test("Refund, reversals, underpaid and expired account examples cannot inflate payment projection",()=>{
 for(const x of ["late-transfer","unmatched","manual-review","overpaid","reversed"]){
  assert.ok(paymentActivityPreview.some(row=>row.status===x&&row.phase==="exception"),x);
 }
 assert.ok(paymentActivityPreview.some(row=>row.phase==="collection-intent"&&row.status==="expired"));
 const fakeRefunds=paymentActivityPreview.filter(row=>row.phase==="refund-credit");
 assert.ok(fakeRefunds.length>0);
 assert.deepEqual(activityProjection(invoices,paymentPreview),financeProjection(invoices,paymentPreview,[]));
});
