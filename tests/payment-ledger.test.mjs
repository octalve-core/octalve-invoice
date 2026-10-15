import test from "node:test";
import assert from "node:assert/strict";
import {financeProjection,paymentPreview,refundPreview} from "../src/features/payments/ledger.ts";
const invoices=[{id:"1",amountMinor:12000000,issued:true},{id:"3",amountMinor:12000000,issued:true},{id:"4",amountMinor:8500000,issued:true},{id:"6",amountMinor:12000000,issued:true}];
test("a receipt link never increases collected cash",()=>{
 const p=financeProjection(invoices,paymentPreview,refundPreview);
 const withDuplicate=financeProjection(invoices,[...paymentPreview,{...paymentPreview[0],receiptId:"99"}],refundPreview);
 assert.equal(p.collectedMinor,withDuplicate.collectedMinor);
 assert.equal(p.collectedMinor,35000000);
 assert.equal(p.unallocatedMinor,9500000);
 assert.equal(p.outstandingMinor,19000000);
});
test("pending virtual account payment cannot mark an invoice as paid",()=>{
 const p=financeProjection(invoices,paymentPreview,refundPreview);
 assert.equal(p.allocatedMinor,25500000);
 assert.equal(p.outstandingMinor,19000000);
});
test("verified refund only reduces net collected; does not silently edit invoice liability",()=>{
 const before=financeProjection(invoices,paymentPreview,[]);
 const after=financeProjection(invoices,paymentPreview,[{id:"R1",paymentId:"PAY-00001",amountMinor:1000000,status:"verified"}]);
 assert.equal(after.netCollectedMinor,before.collectedMinor-1000000);
 assert.equal(after.outstandingMinor,before.outstandingMinor);
});
test("invalid allocation and unverified refund are rejected",()=>{
 assert.throws(()=>financeProjection(invoices,[{...paymentPreview[0],allocations:[{invoiceId:"4",amountMinor:9000000}]}],[]));
 assert.throws(()=>financeProjection(invoices,paymentPreview,[{id:"R1",paymentId:"missing",amountMinor:100,status:"verified"}]));
});

test("conflicting payment replay cannot be silently deduplicated",()=>{
 assert.throws(()=>financeProjection(invoices,[...paymentPreview,{...paymentPreview[0],amountMinor:12000000}],[]),/Conflicting payment replay/);
});
test("refunds cannot cumulatively exceed their source payment",()=>{
 assert.throws(()=>financeProjection(invoices,paymentPreview,[
 {id:"R1",paymentId:"PAY-00001",amountMinor:6000000,status:"verified"},
 {id:"R2",paymentId:"PAY-00001",amountMinor:3000000,status:"verified"}]),/Refunds exceed source payment/);
});

test("identical refund event retries count once, but conflicting retries are rejected",()=>{
 const refund={id:"R1",paymentId:"PAY-00001",amountMinor:1000000,status:"verified"};
 const once=financeProjection(invoices,paymentPreview,[refund]);
 const twice=financeProjection(invoices,paymentPreview,[refund,{...refund}]);
 assert.equal(twice.refundedMinor,once.refundedMinor);
 assert.throws(()=>financeProjection(invoices,paymentPreview,[refund,{...refund,amountMinor:2000000}]),/Conflicting refund replay/);
 assert.throws(()=>financeProjection(invoices,paymentPreview,[refund,{...refund,status:"pending"}]),/Conflicting refund replay/);
});
test("aggregate financial projections reject minor unit sums beyond safe integers",()=>{
 const huge=[{id:"big-1",amountMinor:Number.MAX_SAFE_INTEGER,issued:true},{id:"big-2",amountMinor:1,issued:true}];
 assert.throws(()=>financeProjection(huge,[],[]),/Financial sum exceeds safe integer limit/);
});
