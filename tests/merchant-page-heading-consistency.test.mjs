import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const pages={
 overview:"app/(dashboard)/dashboard/page.tsx",
 invoice:"app/(dashboard)/dashboard/invoice/page.tsx",
 receipt:"app/(dashboard)/dashboard/receipt/page.tsx",
 quotation:"app/(dashboard)/dashboard/quotation/page.tsx",
 expenses:"app/(dashboard)/dashboard/expenses/page.tsx",
 credit:"app/(dashboard)/dashboard/credit-note/page.tsx",
 more:"app/(dashboard)/dashboard/other-services/page.tsx",
 settings:"app/(dashboard)/dashboard/settings/page.tsx",
 payments:"src/features/payments/PaymentReceivedWorkspace.tsx"
};
test("merchant top navigation is mounted exactly once, from the common layout",()=>{
 const layout=read("app/(dashboard)/layout.tsx");
 assert.equal((layout.match(/<TopNavbar\s*\/>/g)||[]).length,1);
 const navbar=read("components/dashboard/TopNavbar.tsx");
 assert.match(navbar,/Find a workspace page/);
 assert.match(navbar,/Workspace search results/);
 assert.match(navbar,/destinations\.filter/);
 for(const p of Object.values(pages))assert.doesNotMatch(read(p),/<TopNavbar|Search workspace preview/);
});
test("all named merchant pages use the same heading, not copies of h1 markup",()=>{
 const heading=read("components/dashboard/ui/MerchantPageHeading.tsx");
 assert.match(heading,/data-merchant-page-heading/);
 assert.match(heading,/text-\[\#173652\]/);
 assert.match(heading,/hideOnMobile/);
 for(const [key,p] of Object.entries(pages)){
  const source=read(p);
  assert.match(source,/<MerchantPageHeading\b/,key+" must render the common merchant heading");
 }
 const directory=read("src/features/records/components/RecordDirectory.tsx");
 assert.match(directory,/<MerchantPageHeading title=\{def\.title\}/);
 assert.doesNotMatch(directory,/showDesktopHeader\?<div className="hidden lg:block"><h1/);
});
test("list pages retain one desktop header and one mobile list heading",()=>{
 for(const kind of ["invoice","receipt","quotation","expense","creditNote"]){
  const pathname={invoice:pages.invoice,receipt:pages.receipt,quotation:pages.quotation,expense:pages.expenses,creditNote:pages.credit}[kind];
  const source=read(pathname);
  assert.match(source,/hideOnMobile/,kind+" desktop heading must not duplicate mobile list heading");
  if(kind==="quotation"||kind==="expense")assert.match(source,/showDesktopHeader=\{false\}/);
 }
});
test("global route finder and page-level record filters have independent state and labels",()=>{
 const nav=read("components/dashboard/TopNavbar.tsx");
 const directory=read("src/features/records/components/RecordDirectory.tsx");
 const payment=read(pages.payments);
 const other=read(pages.more);
 assert.match(nav,/aria-label="Find a workspace page"/);
 assert.match(directory,/aria-label=\{"Search "\+def\.plural\}/);
 assert.match(payment,/aria-label="Search payment activity"/);
 assert.match(other,/aria-label="Search More services"/);
 assert.doesNotMatch(nav,/Search payment activity|Search More services|Search "\+def/);
 assert.doesNotMatch(directory,/Workspace search results/);
 assert.match(nav,/setQuery\("“?”?\)/); // local navigation query resets after route selection
});
