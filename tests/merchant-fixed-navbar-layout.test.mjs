import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL("../"+path,import.meta.url),"utf8");
test("exactly one global merchant navbar is nonshrinking and 64px",()=>{
 const header=read("components/dashboard/TopNavbar.tsx");
 const layout=read("app/(dashboard)/layout.tsx");
 const sidebar=read("components/dashboard/Sidebar.tsx");
 assert.equal((layout.match(/<TopNavbar\s*\/>/g)||[]).length,1);
 assert.match(header,/h-16 min-h-16 shrink-0/);
 assert.match(header,/sticky top-0/);
 assert.match(sidebar,/h-16 shrink-0/);
 assert.match(sidebar,/lg:h-dvh/);
});
test("desktop merchant page is the only scroll container below the header",()=>{
 const layout=read("app/(dashboard)/layout.tsx");
 assert.match(layout,/lg:h-dvh lg:min-h-0 lg:overflow-hidden/);
 assert.match(layout,/lg:h-full lg:min-h-0 lg:overflow-hidden/);
 assert.match(layout,/<main data-merchant-scroll-region aria-label="Merchant page content"/);
 assert.match(layout,/min-h-0 min-w-0 flex-1/);
 assert.match(layout,/lg:overflow-y-auto lg:overscroll-contain/);
 assert.doesNotMatch(layout,/lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain/);
 const sidebar=read("components/dashboard/Sidebar.tsx");
 assert.match(sidebar,/nav aria-label="Desktop main navigation"/);
 assert.match(sidebar,/overflow-y-auto overscroll-contain/);
});
test("only navigation-search scopes exist globally; record search remains local",()=>{
 const navbar=read("components/dashboard/TopNavbar.tsx");
 const invoice=read("src/features/records/components/RecordDirectory.tsx");
 const payment=read("src/features/payments/PaymentReceivedWorkspace.tsx");
 assert.match(navbar,/aria-label="Find a workspace page"/);
 assert.match(invoice,/aria-label=\{"Search "\+def\.plural\}/);
 assert.match(payment,/aria-label="Search payment activity"/);
 assert.doesNotMatch(navbar,/Search payment activity|Search expenses|Search invoices/);
});
test("browser qualification measures actual geometry at short and tall desktop viewport heights",()=>{
 const script=read("scripts/phase-0y1-navbar-geometry.cjs");
 for(const viewport of ["{width:1024,height:600}","{width:1280,height:768}","{width:1440,height:900}","{width:390,height:780}","{width:320,height:700}","{width:430,height:900}"]){
  assert.ok(script.includes(viewport),"Expected viewport "+viewport);
 }
 assert.match(script,/headerFlexShrink/);
 assert.match(script,/mainOverflowY/);
 assert.match(script,/panelOverflowY/);
 assert.match(script,/mainScrollTop/);
 assert.match(script,/mouse\.wheel/);
 assert.match(script,/Math\.abs\(a-b\)/);
 assert.match(script,/sidebar\.top/);
 assert.match(script,/mainScrollable/);
 assert.equal((script.match(/page\.goto\(/g)||[]).length,1,"Navigate directly only to /workspaces");
});
test("existing browser sidebar regression was migrated to the new scroll owner",()=>{
 const legacy=read("scripts/phase-0c-browser-evidence.cjs");
 assert.match(legacy,/main\[data-merchant-scroll-region\]/);
 assert.match(legacy,/content\.scrollTop=content\.scrollHeight/);
 assert.match(legacy,/layout\.panelScrollable/);
 assert.doesNotMatch(legacy,/panel\.scrollTop=panel\.scrollHeight/);
});
