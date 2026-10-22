import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {calculateClassifiedPreview,calculateUntaxedPreview,defaultTaxCentrePolicy,unclassifiedTax,requiresTaxReview} from "../src/features/tax/tax-domain.ts";
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
 assert.equal(calculateClassifiedPreview(lines,"0",defaultTaxCentrePolicy).ready,false,"pending Tax Centre must block tax");
 const policy={...defaultTaxCentrePolicy,version:"counsel-reviewed-fixture-v1",effectiveFrom:"2026-01-01",status:"owner-reviewed"};
 assert.equal(calculateClassifiedPreview(lines,"0",policy).ready,true);
 assert.equal(calculateClassifiedPreview(lines,"0",{...policy,version:"other-rule"}).ready,false);
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


test("responsive customer/item pickers expose shared Add and Edit without duplicate merchant stores",()=>{
 const metadata=read("src/features/invoices/sections/InvoiceMetadataSection.tsx");
 const items=read("src/features/invoices/sections/InvoiceItemsSection.tsx");
 const quote=read("components/dashboard/modals/CreateQuotationModal.tsx");
 const customer=read("src/features/catalog/QuickCustomerEditor.tsx");
 const item=read("src/features/catalog/QuickItemEditor.tsx");
 assert.match(metadata,/Edit customer /);
 assert.match(metadata,/QuickCustomerEditor/);
 assert.match(metadata,/updateQuickCustomer/);
 assert.match(items,/Edit catalogue item /);
 assert.match(items,/QuickItemEditor/);
 assert.match(quote,/Edit selected customer/);
 assert.match(quote,/Edit catalogue item/);
 assert.match(quote,/activeCustomers/);
 assert.match(quote,/activeItems/);
 assert.match(customer,/export function updateQuickCustomer/);
 assert.match(item,/export function createQuickItem/);
});
test("archived master records excluded from selectors while document snapshots are isolated",()=>{
 const helper=read("src/features/merchant-preview/catalog-contract.ts");
 assert.match(helper,/export function isCatalogArchived/);
 for(const path of ["src/features/invoices/sections/InvoiceMetadataSection.tsx","src/features/invoices/sections/InvoiceItemsSection.tsx","components/dashboard/modals/CreateQuotationModal.tsx"])
  assert.match(read(path),/isCatalogArchived/,path);
 const quote=read("components/dashboard/modals/CreateQuotationModal.tsx");
 assert.match(quote,/quote unchanged/);
 assert.match(quote,/quote address unchanged/);
});
test("UI tax calculation remains guarded and overall percentage cannot bypass treatment",()=>{
 const composer=read("src/features/invoices/sections/InvoiceComposer.tsx");
 const editor=read("src/features/invoices/sections/InvoiceEditorSection.tsx");
 assert.match(composer,/calculateDraftPreviewTotals/);
 assert.match(editor,/calculateDraftPreviewTotals/);
 assert.doesNotMatch(editor,/aria-label="Tax percentage"/);
 assert.match(read("src/features/tax/tax-domain.ts"),/requiresTaxReview/);
});

test("unclassified drafts retain exact pre-tax cents without claiming a tax assessment",()=>{
 const lines=[{id:"1",quantity:"3",unitPrice:"0.01",discount:"0",taxClassification:unclassifiedTax}];
 const untaxed=calculateUntaxedPreview(lines,"0");
 assert.deepEqual(untaxed.netMinor,3);
 const flagged=calculateClassifiedPreview(lines,"0");
 assert.equal(flagged.ready,false);
 assert.equal(flagged.netMinor,3);
 assert.equal(flagged.taxMinor,null);
 assert.equal(flagged.totalMinor,null);
 assert.equal(calculateUntaxedPreview([{...lines[0],unitPrice:"1.234"}],"0").ready,false);
});


test("quotation billing fields are copied snapshots and not live customer-directory lookups",()=>{
 const quote=read("components/dashboard/modals/CreateQuotationModal.tsx");
 assert.match(quote,/customerSnapshot\?:ReturnType<typeof snapshotCustomer>/);
 assert.match(quote,/customerSnapshot:selected\?snapshotCustomer\(selected\)/);
 assert.match(quote,/formData\.customerSnapshot\?\.clientName/);
 assert.match(quote,/formData\.customerSnapshot\?\.clientEmail/);
 assert.doesNotMatch(quote,/activeCustomers\.find\(c=>c\.id===formData\.customer\)\?\.name/);
});
test("Tax Centre is one provisional policy owner across invoice, quote and item editors",()=>{
 const taxCentre=read("app/(dashboard)/dashboard/tax-centre/page.tsx");
 assert.match(taxCentre,/setTaxPolicy/);
 for(const path of ["src/features/invoices/sections/InvoiceEditorSection.tsx","components/dashboard/modals/CreateQuotationModal.tsx","src/features/catalog/QuickItemEditor.tsx"])
  assert.match(read(path),/taxPolicy/,path);
 assert.match(taxCentre,/status:"research-pending"/);
 assert.match(read("src/features/catalog/ItemEditor.tsx"),/<QuickItemEditor/);
});
