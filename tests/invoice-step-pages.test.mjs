import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const root="app/(dashboard)/dashboard/invoice/";
test("create and edit use persistent nested layouts, not independent draft copies",()=>{
 const composer=read("src/features/invoices/sections/InvoiceComposer.tsx");
 const create=read(root+"create/layout.tsx");
 const edit=read(root+"[id]/edit/layout.tsx");
 assert.match(create,/<InvoiceComposer mode="create"\/>/);
 assert.match(edit,/<InvoiceComposer mode="edit"\/>/);
 assert.match(read(root+"create/page.tsx"),/return null/);
 assert.match(read(root+"[id]/edit/page.tsx"),/return null/);
 assert.match(composer,/usePathname/);
 assert.match(composer,/useParams/);
 assert.match(composer,/aria-current=\{step===item\.id\?"step":undefined\}/);
 assert.match(composer,/href=\{href\(item\.id\)\}/);
 for(const page of [read(root+"create/[step]/page.tsx"),read(root+"[id]/edit/[step]/page.tsx")]){
  for(const step of ["details","items","charges","workflow","preview"])assert.ok(page.includes('"'+step+'"'));
  assert.match(page,/notFound\(\)/);
 }
});
test("all four original authoring sections and payment validations remain mounted",()=>{
 const editor=read("src/features/invoices/sections/InvoiceEditorSection.tsx");
 for(const step of ["details","items","charges","workflow"])assert.ok(editor.includes('name="'+step+'"'));
 assert.match(editor,/hidden=\{!active\}/);
 assert.match(editor,/dueTime/);
 assert.match(editor,/lagosDateTime/);
 assert.match(editor,/Number\.isSafeInteger\(totalMinor\)&&totalMinor>0/);
 assert.match(editor,/<InvoiceMetadataSection/);
 assert.match(editor,/<InvoiceItemsSection/);
 assert.match(editor,/<InvoiceWorkflowPanel/);
 assert.doesNotMatch(editor,/setOpen\(|Expand all|Collapse all/);
});
test("full invoice preview is a fifth page with safe issue lock and one watermark",()=>{
 const composer=read("src/features/invoices/sections/InvoiceComposer.tsx");
 const preview=read("src/features/invoices/sections/InvoiceDocumentPreviewSection.tsx");
 assert.match(composer,/step==="preview"/);
 assert.match(composer,/merchantLogo=\{logoPreview\}/);
 assert.match(composer,/disabled className="min-h-11/);
 assert.match(composer,/applyNewInvoicePreferences/);
 assert.match(preview,/data-testid="draft-preview-watermark"/);
 assert.match(preview,/DRAFT — NOT ISSUED/);
 assert.match(preview,/-rotate-\[34deg\]/);
 assert.doesNotMatch(preview,/Array\.from\(\{length:5\}/);
 assert.doesNotMatch(preview,/performDownload|exportNativeInvoicePdf|exportRenderedDocumentPng/);
});
test("both invoice document renderers still use merchant-owned payment and template authority",()=>{
 const preview=read("src/features/invoices/sections/InvoiceDocumentPreviewSection.tsx");
 const composer=read("src/features/invoices/sections/InvoiceComposer.tsx");
 assert.match(preview,/paymentReady=paymentMode==="manual"&&hasBank/);
 assert.match(preview,/merchantLogo/);
 assert.match(preview,/<SapphireInvoiceRenderer/);
 assert.match(preview,/<ClassicLedgerRenderer/);
 assert.match(composer,/merchantPayment\(settings\)/);
 assert.match(composer,/invoiceAppearance\.template/);
});
