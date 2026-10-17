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

test("invoice customization returns to Getting Started and saves session preferences before Payments",()=>{
 const invoice=read("app/(dashboard)/dashboard/settings/invoice/page.tsx");
 const journey=read("src/features/merchant-setup/MerchantSetupJourney.tsx");
 assert.match(invoice,/query\.get\("from"\)==="getting-started"/);
 assert.match(invoice,/gettting-started\?step=appearance|getting-started\?step=appearance/);
 assert.match(invoice,/router\.push\("\/dashboard\/getting-started\?step=payments"\)/);
 assert.match(invoice,/Save & Continue/);
 assert.match(invoice,/Preferences kept for this session/);
 assert.match(journey,/settings\/invoice\?from=getting-started/);
});
test("payment bank picker is searchable and not falsely called a verified full directory",()=>{
 const picker=read("src/features/merchant-setup/NigerianBankPicker.tsx");
 const setup=read("src/features/merchant-setup/MerchantSetupJourney.tsx");
 assert.match(picker,/role="combobox"/);
 assert.match(picker,/role="listbox"/);
 assert.match(picker,/role="option"/);
 assert.match(picker,/toLowerCase\(\)\.includes/);
 assert.match(picker,/ArrowDown/);
 assert.match(picker,/Suggestions only/);
 assert.match(picker,/value=\{open\?query:value\}/);
 assert.match(setup,/<NigerianBankPicker/);
 assert.match(setup,/About|SetupInfoNote/);
 assert.match(setup,/Account not verified/);
});

test("premium desktop sidebar is dark blue-active, separately scrollable and keeps billing/logout anchored",()=>{
 const sidebar=read("components/dashboard/Sidebar.tsx");
 const layout=read("app/(dashboard)/layout.tsx");
 assert.match(sidebar,/bg-\[#000A16\]/);
 assert.match(sidebar,/bg-\[#0064E0\] text-white/);
 assert.match(sidebar,/lg:h-dvh lg:min-h-0 lg:overflow-hidden/);
 assert.match(sidebar,/min-h-0 flex-1 overflow-y-auto overscroll-contain/);
 assert.match(sidebar,/Sidebar account and billing/);
 assert.match(sidebar,/dashboard\/settings\/subscription/);
 assert.match(sidebar,/<PreviewLogoutButton/);
 assert.match(sidebar,/aria-current=\{isActive\?"page":undefined\}/);
 assert.match(layout,/lg:h-dvh lg:min-h-0 lg:overflow-hidden/);
 assert.match(layout,/lg:h-full lg:min-h-0 lg:overflow-y-auto/);
 assert.match(layout,/<BottomNavbar \/>/);
 assert.match(layout,/<MobileHeader \/>/);
});

test("Staff and Report remain routed through More, with invisible sidebar scrollbar",()=>{
 const side=read("components/dashboard/Sidebar.tsx");
 const data=read("src/features/other-services/feature-links.ts");
 const more=read("app/(dashboard)/dashboard/other-services/page.tsx");
 assert.doesNotMatch(side,/\{label:"Staff"/);
 assert.doesNotMatch(side,/\{label:"Report"/);
 assert.match(side,/\[scrollbar-width:none\]/);
 assert.match(side,/\[&::-webkit-scrollbar\]:hidden/);
 assert.match(data,/slug:"staff",title:"Staff",icon:"user-cog",href:"\/dashboard\/staff",ready:true/);
 assert.match(data,/slug:"report",title:"Report",icon:"scale",href:"\/dashboard\/report",ready:true/);
 assert.match(more,/"user-cog":UserCog/);
 assert.match(more,/slugs:\["overview","report","staff"/);
});
test("Overview uses one set of four financial cards on phone and desktop, not invoice stats",async()=>{
 const home=read("app/(dashboard)/dashboard/page.tsx");
 const shared=read("src/features/dashboard/OverviewMetrics.tsx");
 assert.match(home,/<OverviewMetrics \/>/);
 assert.doesNotMatch(home,/statsData|<StatCard|Mobile receivables/);
 assert.match(shared,/title:"Current invoices"/);
 assert.match(shared,/title:"Total inflow"/);
 assert.match(shared,/title:"Overdue invoices"/);
 assert.match(shared,/title:"Total outflow"/);
 assert.match(shared,/vs last month/);
 const {overviewChange}=await import("../src/features/dashboard/overview-math.ts");
 assert.equal(overviewChange(506000,500000),1.2);
 assert.equal(overviewChange(0,20000),-100);
 assert.equal(overviewChange(0,0),0);
 assert.equal(overviewChange(100,0),null);
});
test("Tax Centre stays non-filing but links one business setup and uses compact disclosures",()=>{
 const tax=read("app/(dashboard)/dashboard/tax-centre/page.tsx");
 const nrs=read("src/features/finance/NrsReadinessPanel.tsx");
 const note=read("src/features/merchant-setup/SetupInfoNote.tsx");
 assert.match(tax,/Tax totals await classification/);
 assert.match(tax,/No NRS e-invoices submitted/);
 assert.match(tax,/<SetupInfoNote/);
 assert.match(nrs,/getting-started\?step=business/);
 assert.match(nrs,/No NRS submissions/);
 assert.match(nrs,/Not connected/);
 assert.match(note,/createPortal/);
 assert.match(note,/role="dialog"/);
 assert.match(note,/env\(safe-area-inset-bottom\)/);
});

test("Batch P uses one canonical payment setup and keeps real payment methods disconnected",()=>{
 const journey=read("src/features/merchant-setup/MerchantSetupJourney.tsx");
 const connections=read("src/features/merchant-setup/PaymentConnectionsPanel.tsx");
 const settings=read("app/(dashboard)/dashboard/settings/page.tsx");
 const provider=read("src/features/merchant-preview/MerchantPreviewProvider.tsx");
 const options=read("src/features/merchant-setup/payment-capabilities.ts");
 const invoice=read("src/features/invoices/sections/InvoiceMetadataSection.tsx");
 assert.match(journey,/Business identity/);
 assert.match(journey,/Company Bank Transfer/);
 assert.match(journey,/<PaymentConnectionsPanel\/>/);
 assert.match(journey,/<NigerianBankPicker/);
 assert.match(journey,/Account not verified/);
 assert.match(settings,/\["Payment connections","\/dashboard\/getting-started\?step=payments"/);
 assert.match(connections,/Dynamic Account/);
 assert.match(connections,/Online payment connections/);
 assert.match(connections,/Partner Bank Collection/);
 assert.match(connections,/Coming soon/);
 assert.match(connections,/Not connected/);
 assert.match(connections,/Provider secret key/);
 assert.match(connections,/fieldset disabled/);
 assert.doesNotMatch(connections,/localStorage|sessionStorage|fetch\(|getServerSideProps|setPaymentMode\(/);
 assert.match(provider,/collectionSetup:PreviewCollectionSetup/);
 assert.match(provider,/setCollectionSetup\(defaultPreviewCollectionSetup\)/);
 assert.match(invoice,/disabled=\{p\.value!=="manual"\}/);
});
test("Batch P provider account limits remain separate and server expiry is required later",()=>{
 const caps=read("src/features/merchant-setup/payment-capabilities.ts");
 const ui=read("src/features/merchant-setup/PaymentConnectionsPanel.tsx");
 assert.match(caps,/monnify-invoice/);
 assert.match(caps,/expiryDate/);
 assert.match(caps,/limitSeconds:null/);
 assert.match(caps,/5270401/);
 assert.match(caps,/31536000/);
 assert.match(caps,/15 minutes–8 hours/);
 assert.match(ui,/provider-confirmed account expiry/);
 assert.match(ui,/Batch Q/);
 assert.match(ui,/reference only/);
});
