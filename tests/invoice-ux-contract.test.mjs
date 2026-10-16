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
test("merchant logo upload is shared with browser and native document exports",()=>{
 const settings=read("app/(dashboard)/dashboard/settings/business/page.tsx");
 const composer=read("src/features/invoices/sections/InvoiceComposer.tsx");
 const preview=read("src/features/invoices/sections/InvoiceDocumentPreviewSection.tsx");
 assert.match(settings,/setLogoPreview\(reader\.result as string\)/);
 assert.match(composer,/merchantLogo=\{logoPreview\}/);
 assert.match(preview,/companyLogo=\{merchantLogo\}/);
 assert.match(preview,/exportNativeInvoicePdf\(presentation,"octalve-modern-preview\.pdf",merchantLogo\)/);
 assert.match(preview,/exportClassicLedgerPdf\(presentation,"octalve-classic-ledger-preview\.pdf",invoiceAppearance\.accent,merchantLogo\)/);
});
