import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createEmptyInvoiceDraft} from "../src/features/invoice/constants.ts";
import {prepareDraftIssueSnapshot} from "../src/features/invoices/lib/issue-snapshot-proposal.ts";
const source=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");

test("a customer billing proposal remains detached from its editable draft and seller",()=>{
 const draft=createEmptyInvoiceDraft(new Date("2026-10-16T12:00:00Z"));
 Object.assign(draft,{clientCustomerId:"customer-1",clientType:"business",clientName:"Example Traders Ltd",
  clientTaxId:"EXAMPLE-ID",clientAddress:"Example Road",clientCity:"Akure",clientCountry:"Nigeria"});
 draft.rows[0].serviceName="Professional services";
 const merchant={businessName:"Example Merchant",rcNumber:"EXAMPLE-RC",taxId:"SELLER-ID",
  businessAddress:"Business Road",email:"example@example.invalid",businessPhone:"",businessDescription:"",
  bankName:"",accountNumber:"",website:""};
 const appearance={template:"modern",accent:"#0064E0",font:"system",density:"comfortable",
  header:"standard",logoPosition:"left",showFooter:true,showWatermark:false};
 const result=prepareDraftIssueSnapshot(draft,merchant,appearance);
 draft.clientName="Changed draft only";
 draft.rows[0].serviceName="Changed line only";
 merchant.businessName="Changed merchant";
 appearance.accent="#FFFFFF";
 assert.equal(result.kind,"DRAFT_PREPARATION_ONLY");
 assert.equal(result.buyer.name,"Example Traders Ltd");
 assert.equal(result.buyer.taxId,"EXAMPLE-ID");
 assert.equal(result.buyer.customerId,"customer-1");
 assert.equal(result.seller.name,"Example Merchant");
 assert.equal(result.document.lines[0].name,"Professional services");
 assert.equal(result.document.accent,"#0064E0");
 assert.equal(result.fiscal.irn,null);
 assert.equal(result.fiscal.officialQr,null);
 assert.equal(result.fiscal.nrsStatus,"not_submitted");
 assert.equal(Object.isFrozen(result.buyer),true);
 assert.equal(Object.isFrozen(result.document.lines),true);
 assert.equal(Object.isFrozen(result.document.lines[0]),true);
});

test("customer master mapping retains tax ID distinct from company ID and registration",()=>{
 const form=source("components/dashboard/forms/AddCustomerForm.tsx");
 const page=source("app/(dashboard)/dashboard/customer/add/page.tsx");
 const picker=source("src/features/invoices/sections/InvoiceMetadataSection.tsx");
 const panel=source("src/features/finance/NrsReadinessPanel.tsx");
 assert.match(form,/Customer Tax ID \(if applicable\)/);
 assert.match(page,/taxId:data\.taxId\.trim\(\)/);
 assert.match(page,/companyRegistration:data\.companyRegistration\.trim\(\)/);
 assert.match(page,/companyId:data\.companyId\.trim\(\)/);
 const contract=source("src/features/merchant-preview/catalog-contract.ts");
 assert.match(picker,/snapshotCustomer\(row\)/);
 assert.match(contract,/clientTaxId:customer\.taxId\|\|""/);
 assert.match(contract,/clientCountry:customer\.country\|\|""/);
 assert.match(picker,/Edits here affect this draft only/);
 assert.match(panel,/Not connected/);
 assert.match(panel,/No NRS submissions/);
 assert.doesNotMatch(panel,/generate.*[iI][rR][nN]\(/);
});

test("template gallery permits only two existing live renderers",()=>{
 const gallery=source("src/features/invoices/components/InvoiceTemplateGallery.tsx");
 const prefs=source("app/(dashboard)/dashboard/settings/invoice/page.tsx");
 assert.match(gallery,/id:"modern".*available:true/);
 assert.match(gallery,/id:"ledger".*available:true/);
 for(const name of ["standard","spreadsheet","continental","compact","legal"]){
  assert.ok(gallery.includes('id:"'+name+'"'),"Missing future style "+name);
 }
 assert.match(gallery,/disabled=\{!style\.available\}/);
 assert.match(prefs,/<InvoiceTemplateGallery /);
});
