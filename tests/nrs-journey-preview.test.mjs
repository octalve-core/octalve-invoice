import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {financeJourney,nrsAuthorityBoundaries,nrsPaymentStatusReference,nrsReferenceLinks,officialNrsReadiness} from "../src/features/finance/nrs-journey.ts";
const source=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("NRS lifecycle shows exactly eight distinct ordered stages with independent evidence",()=>{
 assert.equal(financeJourney.length,8);
 assert.equal(new Set(financeJourney.map(stage=>stage.id)).size,8);
 assert.deepEqual(financeJourney.map(stage=>stage.id),["onboard","connect","compose","validate","deliver","verify","reconcile","report"]);
 for(const stage of financeJourney){
  assert.ok(stage.dependency.length>15);
  assert.ok(["preview","specified","external"].includes(stage.mode));
 }
 assert.equal(financeJourney.find(x=>x.id==="validate").actor,"NRS");
 assert.equal(financeJourney.find(x=>x.id==="verify").actor,"Provider");
});
test("Invoice numbering, NRS authority, actual cash and tax filing remain distinct",()=>{
 assert.equal(nrsAuthorityBoundaries.length,4);
 assert.equal(new Set(nrsAuthorityBoundaries.map(x=>x.id)).size,4);
 assert.match(nrsAuthorityBoundaries[0].detail,/Not an IRN/);
 assert.match(nrsAuthorityBoundaries[1].detail,/authenticated response/);
 assert.match(nrsAuthorityBoundaries[2].detail,/trusted bank\/provider/);
 assert.match(nrsAuthorityBoundaries[3].detail,/Separate legal obligations/);
 assert.deepEqual([...nrsPaymentStatusReference],["PENDING","PARTIAL","PAID","REJECTED"]);
});
test("NRS success cannot be derived from profile entries or toggled in Preview",()=>{
 assert.deepEqual(officialNrsReadiness({taxpayerAuthorised:false,approvedIntegration:false,serverBusinessVerified:false,liveNrsResponse:false}),{
  status:"Not connected",canIssueOfficialInvoice:false,canShowOfficialIrnQr:false
 });
 const complete=officialNrsReadiness({taxpayerAuthorised:true,approvedIntegration:true,serverBusinessVerified:true,liveNrsResponse:true});
 assert.equal(complete.canIssueOfficialInvoice,false);
 assert.equal(complete.canShowOfficialIrnQr,false);
});
test("Existing Tax Centre links to canonical NRS journey without creating real fiscal actions",()=>{
 const tax=source("app/(dashboard)/dashboard/tax-centre/page.tsx");
 const route=source("app/(dashboard)/dashboard/tax-centre/nrs-readiness/page.tsx");
 const view=source("src/features/finance/NrsJourneyWorkspace.tsx");
 const readiness=source("src/features/finance/NrsReadinessPanel.tsx");
 assert.match(tax,/dashboard\/tax-centre\/nrs-readiness/);
 assert.match(route,/<NrsJourneyWorkspace\/>/);
 assert.match(view,/No taxpayer link, accreditation, official IRN/);
 assert.match(view,/Payment Received/);
 assert.match(view,/Eight-stage user journey/);
 assert.match(readiness,/Not connected/);
 assert.match(readiness,/No NRS submissions or IRNs yet/);
 assert.doesNotMatch(view,/fetch\(|localStorage|sessionStorage|generateIrn\(|setNrsConnected\(/);
});
test("Official NRS references link only to NRS domain and open safely",()=>{
 assert.equal(nrsReferenceLinks.length,4);
 for(const link of nrsReferenceLinks){
  const url=new URL(link.url);
  assert.equal(url.protocol,"https:");
  assert.equal(url.hostname,"einvoice.nrs.gov.ng");
 }
 const page=source("src/features/finance/NrsJourneyWorkspace.tsx");
 assert.match(page,/rel="noopener noreferrer"/);
});
