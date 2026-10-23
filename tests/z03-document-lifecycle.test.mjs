import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
 z03PreviewCapabilities,z03UnissuedPreview,lifecycleContractErrors,
 quotationConversionRequirements,receiptPreparationRequirements
} from "../src/features/documents/z03-lifecycle-contract.ts";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");

test("Z03 has four independent axes and no operational frontend grants",()=>{
 assert.deepEqual(z03UnissuedPreview,{issuance:"DRAFT",delivery:"NOT_PREPARED",collection:"NOT_VERIFIED",refund:"NONE"});
 for(const [key,value] of Object.entries(z03PreviewCapabilities)){
  if(key!=="source")assert.equal(value,false,key);
 }
 assert.equal(z03PreviewCapabilities.source,"FRONTEND_PREVIEW_ONLY");
});
test("delivery can never claim sent or queued on an unissued document",()=>{
 assert.deepEqual(lifecycleContractErrors({...z03UnissuedPreview,delivery:"SENT"}),["An unissued document cannot enter delivery transport states."]);
 assert.equal(lifecycleContractErrors({...z03UnissuedPreview,collection:"FULLY_VERIFIED"}).length,0,"collection status is a separate axis");
 assert.equal(lifecycleContractErrors({...z03UnissuedPreview,refund:"SETTLED"}).length,1);
});
test("quotation acceptance alone is insufficient to convert or issue",()=>{
 const none=quotationConversionRequirements({state:"ACCEPTED",hasAcceptedImmutableSnapshot:false,hasExplicitMerchantAction:false,hasReviewedTaxAndBuyer:false});
 assert.equal(none.length,3);
 assert.equal(quotationConversionRequirements({state:"SENT",hasAcceptedImmutableSnapshot:true,hasExplicitMerchantAction:true,hasReviewedTaxAndBuyer:true}).length,1);
 const all=quotationConversionRequirements({state:"ACCEPTED",hasAcceptedImmutableSnapshot:true,hasExplicitMerchantAction:true,hasReviewedTaxAndBuyer:true});
 assert.deepEqual(all,[]);
});
test("receipt preparation requires independent verified money and duplicate protection",()=>{
 assert.equal(receiptPreparationRequirements({verifiedPaymentEvidence:false,verifiedAllocationOrStandalonePayment:false,merchantApproved:false,alreadyReceipted:false}).length,3);
 assert.equal(receiptPreparationRequirements({verifiedPaymentEvidence:true,verifiedAllocationOrStandalonePayment:true,merchantApproved:true,alreadyReceipted:true}).length,1);
 assert.equal(receiptPreparationRequirements({verifiedPaymentEvidence:true,verifiedAllocationOrStandalonePayment:true,merchantApproved:true,alreadyReceipted:false}).length,0);
});
test("new delivery and quotation lifecycle pages are preview only",()=>{
 const delivery=read("app/(dashboard)/dashboard/invoice/[id]/delivery-preview/page.tsx");
 assert.match(delivery,/getPreviewInvoice/);
 assert.match(delivery,/z03PreviewCapabilities\.canSend/);
 assert.match(delivery,/z03PreviewCapabilities\.canShare/);
 assert.match(delivery,/Not issued|not issued/i);
 assert.doesNotMatch(delivery,/fetch\(|localStorage|navigator\.clipboard|window\.open/);
 const quote=read("app/(dashboard)/dashboard/quotation/[id]/lifecycle/page.tsx");
 assert.match(quote,/quotationConversionRequirements/);
 assert.match(quote,/z03PreviewCapabilities\.canConvertQuotation/);
 assert.doesNotMatch(quote,/fetch\(|localStorage|sessionStorage/);
});
