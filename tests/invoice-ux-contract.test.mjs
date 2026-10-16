import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=(name)=>readFileSync(new URL("../"+name,import.meta.url),"utf8");

test("invoice payment planning belongs to create/edit and never issued detail",()=>{
 const editor=read("src/features/invoices/sections/InvoiceEditorSection.tsx");
 const detail=read("app/(dashboard)/dashboard/invoice/[id]/page.tsx");
 assert.match(editor,/<InvoiceWorkflowPanel\b/);
 assert.doesNotMatch(detail,/<InvoiceWorkflowPanel\b/);
 assert.match(editor,/aria-expanded=\{open\}/);
 assert.match(editor,/hidden=\{!open\}/);
 assert.match(editor,/Expand all/);
 assert.match(editor,/Number\.isSafeInteger\(totalMinor\)&&totalMinor>0/);
 assert.match(editor,/Add an item with a positive amount before planning installments/);
});
test("item sections support selective expansion and a deliberate expand-all option",()=>{
 const c=read("src/features/invoices/sections/InvoiceItemsSection.tsx");
 assert.match(c,/setExpanded\(current=>current\.includes\(id\)\?current\.filter\(x=>x!==id\):\[id\]\)/);
 assert.match(c,/Expand items/);
 assert.match(c,/aria-expanded=\{expanded\.includes\(line\.id\)\}/);
 assert.match(c,/crypto\.randomUUID\(\)/);
});
test("owner-rejected implementation notices stay out of merchant-facing screens",()=>{
 const paths=["src/features/calculator/FinanceCalculatorWorkspace.tsx","src/features/records/components/RecordDetailDialog.tsx","src/features/finance/RecurringWorkspace.tsx","src/features/invoices/sections/InvoiceWorkflowPanel.tsx"];
 const forbidden=["All calculations happen in this browser using your inputs.","Illustrative display only. No live merchant account","Preview patterns below are illustrative only.","Backend ledger, message outbox, tenant-specific portal tokens","Plan collections, communicate and prepare client-facing access."];
 for(const p of paths)for(const fragment of forbidden)assert.ok(!read(p).includes(fragment),p+" contains rejected copy "+fragment);
});
test("technical authority terms stay in engineering docs rather than merchant copy",()=>{
 const screens=[
  "src/features/finance/FinanceActionSheet.tsx",
  "app/(dashboard)/dashboard/insights-support/page.tsx",
  "app/(dashboard)/dashboard/tax-centre/page.tsx"
 ];
 const forbidden=["tenant isolation, immutable append-only storage","source invoice, due date and verified allocations","tenant-scoped data","seeded invoices","available for this tenant","Provider webhook mismatch"];
 for(const file of screens)for(const phrase of forbidden)assert.ok(!read(file).includes(phrase),file+" still contains implementation copy: "+phrase);
});
test("installment reviews display current percentages and exact allocated amounts, not a fixed split",()=>{
 const workflow=read("src/features/invoices/sections/InvoiceWorkflowPanel.tsx");
 assert.doesNotMatch(workflow,/70\/30 or custom installment amounts/);
 assert.match(workflow,/Proposed split: \$\{percent\}%/);
 assert.match(workflow,/Proposed milestones: \$\{stages\.map/);
 assert.match(workflow,/fmt\(stageAmounts!\[i\]\)/);
 assert.match(workflow,/No payment schedule was saved or communicated\./);
});
test("merchant logo remains connected to both unissued invoice renderers",()=>{
 const settings=read("src/features/merchant-setup/MerchantSetupJourney.tsx");
 const composer=read("src/features/invoices/sections/InvoiceComposer.tsx");
 const preview=read("src/features/invoices/sections/InvoiceDocumentPreviewSection.tsx");
 assert.match(settings,/reader\.readAsDataURL\(file\)/);
 assert.match(composer,/merchantLogo=\{logoPreview\}/);
 assert.match(preview,/companyLogo=\{merchantLogo\}/);
 assert.match(preview,/<SapphireInvoiceRenderer/);
 assert.match(preview,/<ClassicLedgerRenderer/);
});
test("unsaved and edit-mode browser previews are watermarked and cannot download",()=>{
 const preview=read("src/features/invoices/sections/InvoiceDocumentPreviewSection.tsx");
 const composer=read("src/features/invoices/sections/InvoiceComposer.tsx");
 assert.match(preview,/data-testid="draft-preview-watermark"/);
 assert.match(preview,/DRAFT · NOT ISSUED/);
 assert.match(preview,/DRAFT — NOT ISSUED/);
 assert.doesNotMatch(preview,/performDownload|exportNativeInvoicePdf|exportClassicLedgerPdf|exportRenderedDocumentPng/);
 assert.doesNotMatch(preview,/Download preview PDF|Download preview PNG/);
 assert.match(composer,/invoicePreferences/);
 assert.match(composer,/applyNewInvoicePreferences/);
});
test("invoice settings use shared merchant state without invented default tax",()=>{
 const settings=read("app/(dashboard)/dashboard/settings/invoice/page.tsx");
 const provider=read("src/features/merchant-preview/MerchantPreviewProvider.tsx");
 assert.match(settings,/setInvoicePreferences/);
 assert.match(settings,/setInvoiceAppearance/);
 assert.doesNotMatch(settings,/3\.5%|autoEnableTax|Auto Enable Tax/);
 assert.match(provider,/invoicePreferences:InvoicePreferences/);
});

test("one canonical invoice customization page includes gallery, colours, preview, defaults and receipts",()=>{
 const invoice=read("app/(dashboard)/dashboard/settings/invoice/page.tsx");
 const theme=read("app/(dashboard)/dashboard/settings/theme/page.tsx");
 const settings=read("app/(dashboard)/dashboard/settings/page.tsx");
 assert.match(invoice,/<InvoiceTemplateGallery/);
 assert.match(invoice,/Template & colours/);
 assert.match(invoice,/Font & layout/);
 assert.match(invoice,/Live appearance preview/);
 assert.match(invoice,/New invoice defaults/);
 assert.match(invoice,/Receipts & payment preferences/);
 assert.match(invoice,/DRAFT · NOT ISSUED/);
 assert.match(invoice,/setInvoiceAppearance/);
 assert.match(invoice,/setInvoicePreferences/);
 assert.match(invoice,/setReceiptAutoMode/);
 assert.doesNotMatch(invoice,/Apply to current Preview/);
 assert.match(theme,/redirect\("\/dashboard\/settings\/invoice"\)/);
 assert.match(settings,/Customize Invoices/);
 assert.doesNotMatch(settings,/Theme Settings/);
});

test("business settings and getting started use one canonical setup UI",()=>{
 const legacy=read("app/(dashboard)/dashboard/settings/business/page.tsx");
 const journey=read("src/features/merchant-setup/MerchantSetupJourney.tsx");
 const start=read("app/(dashboard)/dashboard/getting-started/page.tsx");
 const provider=read("src/features/merchant-preview/MerchantPreviewProvider.tsx");
 assert.match(legacy,/redirect\("\/dashboard\/getting-started\?step=business"\)/);
 assert.match(start,/<MerchantSetupJourney/);
 assert.match(journey,/Business identity/);
 assert.match(journey,/Business location/);
 assert.match(journey,/How do you want to receive payments/);
 assert.match(journey,/Online payment connections/);
 assert.match(journey,/Account not verified/);
 assert.match(journey,/reader\.readAsDataURL\(file\)/);
 assert.match(provider,/businessDescription:string/);
 assert.match(provider,/bankVerification\?/);
});
test("unverified business bank account is not leaked into invoice payment instructions",async()=>{
 const {merchantPayment}=await import("../src/features/merchant-preview/merchant-presentation.ts");
 const raw={businessName:"Example",bankName:"Example Bank",bankCode:"001",accountNumber:"0123456789"};
 assert.deepEqual(merchantPayment(raw),{bankName:"",accountNumber:"",accountName:""});
 assert.deepEqual(merchantPayment({...raw,verifiedAccountName:"A Business",
  bankVerification:{status:"unverified",source:"trusted-server",bankCode:"001",accountNumber:"0123456789"}}),
  {bankName:"",accountNumber:"",accountName:""});
 assert.deepEqual(merchantPayment({...raw,verifiedAccountName:"A Business",
  bankVerification:{status:"verified",source:"trusted-server",bankCode:"001",accountNumber:"0123456780"}}),
  {bankName:"",accountNumber:"",accountName:""});
 const verified={...raw,verifiedAccountName:"A Business",
  bankVerification:{status:"verified",source:"trusted-server",bankCode:"001",accountNumber:"0123456789"}};
 assert.deepEqual(merchantPayment(verified),{bankName:"Example Bank",accountNumber:"0123456789",accountName:"A Business"});
});
test("invoice picker does not activate disconnected external providers",()=>{
 const metadata=read("src/features/invoices/sections/InvoiceMetadataSection.tsx");
 assert.match(metadata,/disabled=\{p\.value!=="manual"\}/);
 assert.match(metadata,/getting-started\?step=payments/);
});
