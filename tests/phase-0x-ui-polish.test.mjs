import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("official Octalve wordmark is reused, with restrained merchant width",()=>{
 const shell=read("src/features/experience-preview/PreviewShell.tsx");
 const sidebar=read("components/dashboard/Sidebar.tsx");
 const chooser=read("app/workspaces/page.tsx");
 for(const file of [shell,sidebar,chooser])assert.match(file,/BrandWordmark/);
 assert.match(sidebar,/width=\{136\}/);
 assert.match(shell,/width=\{132\}/);
 assert.match(shell,/width=\{102\}/);
});
test("merchant route search is separately scoped from record filters",()=>{
 const nav=read("components/dashboard/TopNavbar.tsx");
 const directory=read("src/features/records/components/RecordDirectory.tsx");
 assert.match(nav,/Find a workspace page/);
 assert.match(nav,/Workspace search results/);
 assert.match(nav,/router\.push\(matches\[0\]\.href\)/);
 assert.match(directory,/Search.*def\.plural/);
 assert.doesNotMatch(directory,/Find a workspace page/);
 assert.match(nav,/Switch workspace/);
});
test("customer invoice row wraps at narrow widths",()=>{
 const source=read("src/features/customer-portal/CustomerWorkspace.tsx");
 assert.match(source,/function InvoiceRow/);
 assert.match(source,/break-words text-sm font-bold/);
 assert.match(source,/flex-wrap items-start justify-between/);
 assert.match(source,/min-w-0 flex-1/);
 assert.match(source,/shrink-0 text-xs font-bold tabular-nums/);
 assert.match(source,/Upcoming payments/);
});
test("five-slot mobile bars always expose full role-specific More pages",()=>{
 const shell=read("src/features/experience-preview/PreviewShell.tsx");
 const more=read("src/features/experience-preview/ExperienceMore.tsx");
 assert.match(shell,/grid-cols-5/);
 assert.match(shell,/morePath/);
 assert.match(shell,/MoreHorizontal/);
 assert.match(more,/customerNavigation/);
 assert.match(more,/adminNavigation/);
 assert.match(read("app/(customer)/customer/more/page.tsx"),/ExperienceMore/);
 assert.match(read("app/(platform)/admin/more/page.tsx"),/ExperienceMore/);
});
test("admin records have source-grounded standalone routes and action surfaces",()=>{
 const directory=read("src/features/platform-admin/AdminDirectory.tsx");
 const detail=read("src/features/platform-admin/AdminRecordDetail.tsx");
 const route=read("app/(platform)/admin/[section]/[id]/page.tsx");
 assert.match(directory,/role="dialog"/);
 assert.match(directory,/lg:items-center/);
 assert.match(directory,/aria-label=\{"Actions for "/);
 assert.match(directory,/Filter by status/);
 assert.match(detail,/Choose sample assignment/);
 assert.match(detail,/Save assignment/);
 assert.match(detail,/disabled/);
 assert.match(route,/adminPreviewRecord/);
});
test("customer messaging and support cases are standalone and synthetic",()=>{
 const more=read("src/features/experience-preview/PreviewShell.tsx");
 const support=read("src/features/customer-portal/CustomerSupport.tsx");
 const customer=read("src/features/customer-portal/CustomerWorkspace.tsx");
 assert.match(more,/path:"\/customer\/support"/);
 assert.match(customer,/href=\{"\/customer\/messages\/"/);
 assert.match(support,/CSP-101/);
 assert.match(support,/supportExamples/);
 assert.doesNotMatch(support,/fetch\(|localStorage|sessionStorage|markPaid/);
});
test("browser walkthrough begins once at chooser, then follows links and controls only",()=>{
 const s=read("scripts/phase-0x-human-browser-walkthrough.cjs");
 assert.match(s,/page\.goto\(origin\+"\/workspaces"/);
 assert.equal((s.match(/page\.goto\(/g)||[]).length,1);
 assert.doesNotMatch(s,/page\.request\.|fetch\(|route\.fulfill|setCookie|localStorage|sessionStorage|page\.evaluate\([^)]*fetch/);
 assert.match(s,/getByRole\("navigation"/);
 assert.match(s,/getByRole\("link"/);
 assert.match(s,/getByRole\("button"/);
 assert.match(s,/getByRole\("searchbox"/);
 assert.match(s,/issues\.push/);
});
