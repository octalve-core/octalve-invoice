import test from "node:test";
import assert from "node:assert/strict";
import {evaluateCollectionPlan,lagosLocalToUtc,strictProviderUtc,providerPublishedReference,lagosDateTime} from "../src/features/invoices/lib/collection-expiry.ts";
const day="2026-10-31T23:59",at="2026-10-17T10:00:00Z";
const company=(shares,dates=[])=>evaluateCollectionPlan({
 totalMinor:10000001,invoiceDueAtLagos:day,mode:"company-bank",
 stages:shares.map((share,i)=>({id:"s"+(i+1),share,dueAtLagos:dates[i]??""}))
});
const dynamic=(stages,verifiedExpiries,asOfUtc=at,provider="flutterwave-v4")=>evaluateCollectionPlan({
 totalMinor:10000001,invoiceDueAtLagos:day,stages,mode:"dynamic-account",provider,verifiedExpiries,asOfUtc
});
test("Nigeria UTC+1 dates are exact without browser timezone or February overflow",()=>{
 assert.equal(new Date(lagosLocalToUtc(day)).toISOString(),"2026-10-31T22:59:00.000Z");
 assert.equal(lagosLocalToUtc("2028-02-29T12:00"),Date.parse("2028-02-29T11:00:00Z"));
 for(const value of ["2026-02-29T12:00","2026-13-01T12:00","2026-01-01T24:00","2026-01-01","2026-1-01T10:00","garbage"])
  assert.equal(lagosLocalToUtc(value),null,value);
 assert.equal(strictProviderUtc("2026-02-30T12:00:00Z"),null);
 assert.equal(strictProviderUtc("2026-10-31T22:59:00+01:00"),null);
 assert.equal(lagosDateTime("2026-10-31","23:59"),day);
});
test("Full/50-50/70-30/25-25-50/custom are retained, exact at subunit level",()=>{
 for(const shares of [[100],[50,50],[70,30],[25,25,50],[1,99],[33,33,34],[15,15,15,15,15,25]]){
  const x=company(shares);
  assert.deepEqual(x.errors,[],String(shares));
  assert.equal(x.amountsMinor.reduce((a,b)=>a+b,0),10000001);
  assert.equal(x.readyForIssue,false);
  assert.equal(x.providerVerificationRequired,false);
 }
 for(const shares of [[50,40],[0,100],[-1,101],[50.5,49.5],[20,20,20,20,20,0],[17,17,17,17,16,16,0]]){
  assert.ok(company(shares).errors.length>0,JSON.stringify(shares));
 }
});
test("Milestone dates must be ordered, valid and not later than contractual invoice due",()=>{
 assert.deepEqual(company([50,50],["2026-10-20T10:30",day]).errors,[]);
 assert.match(company([50,50],[day,"2026-11-01T00:00"]).errors.join(" "),"exceeds the invoice due");
 assert.match(company([50,50],["2026-10-30T10:00","2026-10-29T10:00"]).errors.join(" "),"chronological");
 assert.match(company([100],["2026-02-30T10:00"]).errors.join(" "),"invalid Lagos");
});
test("Actual confirmed account expiry is inclusive at exact second, not date-only",()=>{
 const stages=[{id:"s1",share:100,dueAtLagos:day}];
 const proof=[{stageId:"s1",provider:"flutterwave-v4",amountMinor:10000001,accountReference:"provider-ref-1",expiresAtUtc:"2026-10-31T22:59:00Z",confirmedByServer:true}];
 const valid=dynamic(stages,proof);
 assert.deepEqual(valid.errors,[]);
 assert.equal(valid.readyForIssue,false,"still requires approved server issuance, even when preview test proof aligns");
 assert.match(dynamic(stages,[{...proof[0],expiresAtUtc:"2026-10-31T22:58:59Z"}]).errors.join(" "),"due after");
 assert.match(dynamic(stages,[{...proof[0],expiresAtUtc:"2026-10-17T09:59:59Z"}]).errors.join(" "),"already expired");
 assert.match(dynamic(stages,[{...proof[0],amountMinor:5}]).errors.join(" "),"matching");
 assert.match(dynamic(stages,[{...proof[0],provider:"monnify-invoice"}]).errors.join(" "),"matching");
 assert.match(dynamic(stages,[{...proof[0],expiresAtUtc:"2026-02-30T22:59:00Z"}]).errors.join(" "),"invalid provider");
 assert.match(dynamic(stages,[{...proof[0],accountReference:""}]).errors.join(" "),"distinct provider");
 assert.match(dynamic(stages,undefined).errors.join(" "),"provider-confirmed");
});
test("Milestone-specific dynamic accounts reject reused refs, missed dates, mismatched kobo and untrusted time",()=>{
 const stages=[{id:"a",share:70,dueAtLagos:"2026-10-20T15:00"},{id:"b",share:30,dueAtLagos:day}];
 const proofs=[
  {stageId:"a",provider:"flutterwave-v4",amountMinor:7000000,accountReference:"ref-a",expiresAtUtc:"2026-10-20T14:00:00Z",confirmedByServer:true},
  {stageId:"b",provider:"flutterwave-v4",amountMinor:3000001,accountReference:"ref-b",expiresAtUtc:"2026-10-31T22:59:00Z",confirmedByServer:true}
 ];
 assert.deepEqual(dynamic(stages,proofs).errors,[]);
 assert.match(dynamic(stages,[proofs[0],{...proofs[1],accountReference:"ref-a"}]).errors.join(" "),"distinct");
 assert.match(dynamic(stages,[proofs[0],{...proofs[1],amountMinor:3000000}]).errors.join(" "),"matching");
 assert.match(dynamic(stages,proofs,"").errors.join(" "),"Server issuance time");
 assert.match(dynamic([{...stages[0],dueAtLagos:""},stages[1]],proofs).errors.join(" "),"exact due");
});
test("Published provider limits are informative only, Monnify maximum unknown",()=>{
 assert.equal(providerPublishedReference("monnify-invoice").seconds,null);
 assert.equal(providerPublishedReference("flutterwave-v3").seconds,5270401);
 assert.equal(providerPublishedReference("flutterwave-v4").seconds,31536000);
});
