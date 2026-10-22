import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {calculateClassifiedPreview,unclassifiedTax,requiresTaxReview} from "../src/features/tax/tax-domain.ts";
import {newDraftPaymentPlan,proposedStagesFromDraft} from "../src/features/invoices/lib/draft-payment-plan.ts";
import {snapshotCustomer,snapshotItem} from "../src/features/merchant-preview/catalog-contract.ts";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const reviewed=(t,rate)=>({treatment:t,jurisdiction:"NG",effectiveFrom:"2026-01-01",ruleVersion:"counsel-reviewed-fixture-v1",review:"owner-reviewed",proposedRatePercent:rate});
test("no default standard VAT or assumed product eligibility",()=>{
 assert.equal(unclassifiedTax.review,"needs-review");
 assert.equal(requiresTaxReview(unclassifiedTax),true);
 assert.equal(requiresTaxReview({...reviewed("conditional","7.50")}),true);
 const sample={id:"1",quantity:"1",unitPrice:"125.00",discount:"0",taxClassification:unclassifiedTax};
 const result=calculateClassifiedPreview([sample],"0");
 assert.equal(result.ready,false);assert.equal(result.taxMinor,null);
 assert.doesNotMatch(read("components/dashboard/modals/CreateQuotationModal.tsx"),/subtotal\s*\*\s*0\.075/);
});
test("mixed categories and exact cents use only explicitly reviewed rule fixtures",()=>{
 const lines=[
 {id:"a",quantity:"2",unitPrice:"12.50",discount:"0",taxClassification:reviewed("standard","7.50")},
 {id:"b",quantity:"1",unitPrice:"40.00",discount:"0",taxClassification:reviewed("zero-rated")},
 {id:"c",quantity:"1",unitPrice:"10.00",discount:"0",taxClassification:reviewed("exempt")}
 ];
 let d=calculateClassifiedPreview(lines,"0");
 assert.equal(d.ready,true);assert.equal(d.netMinor,7500);assert.equal(d.taxMinor,188);assert.equal(d.totalMinor,7688);
 assert.equal(calculateClassifiedPreview(lines.map((x,i)=>i===1?{...x,taxClassification:unclassifiedTax}:x),"0").ready,false);
 assert.equal(calculateClassifiedPreview(lines,"5").ready,true);
});
test("catalogue record edits cannot mutate captured customer or item snapshots",()=>{
 const c={id:"123",name:"Example Client",email:"a@example.invalid",phone:"0",address:"Old address",company:""};
 const d=snapshotCustomer(c);c.address="New address";assert.equal(d.clientAddress,"Old address");
 const item={id:"prod",name:"S",description:"Original",rate:"120.00",taxPercent:"0",discountPercent:"0",category:"Services",type:"service",taxClassification:unclassifiedTax};
 const snapshot=snapshotItem(item);item.rate="250.00";item.taxClassification={...unclassifiedTax,treatment:"conditional"};
 assert.equal(snapshot.unitPrice,"120.00");assert.equal(snapshot.taxClassification.treatment,"unclassified");
});
test("draft-owned payment plan keeps 70/30 and six-stage guard contract",()=>{
 const draft=newDraftPaymentPlan();assert.equal(draft.firstPercent,70);
 assert.deepEqual(proposedStagesFromDraft(draft,"2026-11-30T23:59").map(x=>x.share),[70,30]);
 assert.equal(read("src/features/invoices/sections/InvoiceWorkflowPanel.tsx").includes("onPlanChange"),true);
 assert.match(read("src/features/invoices/lib/collection-expiry.ts"),/stages\.length>6/);
});
test("merchant provider is the one catalogue, currency and policy owner",()=>{
 const p=read("src/features/merchant-preview/MerchantPreviewProvider.tsx");
 assert.match(p,/const \[taxPolicy,setTaxPolicy\]/);
 assert.match(p,/const \[customers,setCustomers\]/);
 assert.match(p,/const \[items,setItems\]/);
 assert.match(p,/const \[invoicePreferences,setInvoicePreferences\]/);
 assert.match(read("src/features/invoices/sections/InvoiceComposer.tsx"),/applyNewInvoicePreferences/);
});
