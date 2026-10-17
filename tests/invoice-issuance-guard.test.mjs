import test from "node:test";
import assert from "node:assert/strict";
import {applyNewInvoicePreferences} from "../src/features/invoices/lib/invoice-preferences.ts";
import {canDownloadIssuedInvoice,PREVIEW_ISSUANCE_EVIDENCE} from "../src/features/invoices/lib/document-lifecycle.ts";

const base={currency:"NGN",day:"31",month:"JAN",year:"2028",dueDay:"31",dueMonth:"JAN",dueYear:"2028"};
const settings={currency:"USD",preferredDueDate:"1month",showPaymentHistory:true,enableAutoReminder:false};

test("shared new-draft preferences use calendar math and do not change source input",()=>{
 const src={...base};
 const out=applyNewInvoicePreferences(src,settings);
 assert.deepEqual([out.currency,out.dueDay,out.dueMonth,out.dueYear],["USD","29","FEB","2028"]);
 assert.deepEqual(src,base);
 const monthly=applyNewInvoicePreferences({...base,year:"2026"},settings);
 assert.equal(monthly.dueDay,"28");
 assert.equal(monthly.dueMonth,"FEB");
 const weekly=applyNewInvoicePreferences({...base,day:"29",month:"DEC",year:"2026"}, {...settings,preferredDueDate:"1week"});
 assert.deepEqual([weekly.dueDay,weekly.dueMonth,weekly.dueYear],["05","JAN","2027"]);
 const fortnight=applyNewInvoicePreferences({...base,day:"20",month:"DEC",year:"2026"}, {...settings,preferredDueDate:"2weeks"});
 assert.deepEqual([fortnight.dueDay,fortnight.dueMonth,fortnight.dueYear],["03","JAN","2027"]);
 const custom=applyNewInvoicePreferences({...base}, {...settings,preferredDueDate:"custom"});
 assert.equal(custom.dueDay,"31");
 assert.equal(custom.currency,"USD");
});

test("unrecorded invoice drafts can never gain download authority",()=>{
 for(const status of ["local_draft","saved_draft","pending_approval","pending_fiscalization","issued","paid"]){
  assert.equal(canDownloadIssuedInvoice(status,PREVIEW_ISSUANCE_EVIDENCE),false,status);
 }
 const issued={recorded:true,authorized:true,immutableSnapshot:true,fiscalizationRequired:false,fiscalizationVerified:false};
 assert.equal(canDownloadIssuedInvoice("issued",issued),true);
 assert.equal(canDownloadIssuedInvoice("saved_draft",issued),false);
 assert.equal(canDownloadIssuedInvoice("pending_fiscalization",issued),false);
 assert.equal(canDownloadIssuedInvoice("issued",{...issued,authorized:false}),false);
 assert.equal(canDownloadIssuedInvoice("issued",{...issued,immutableSnapshot:false}),false);
 assert.equal(canDownloadIssuedInvoice("issued",{...issued,fiscalizationRequired:true}),false);
 assert.equal(canDownloadIssuedInvoice("issued",{...issued,fiscalizationRequired:true,fiscalizationVerified:true}),true);
 assert.equal(canDownloadIssuedInvoice("voided",issued),false);
});
