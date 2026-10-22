import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("shared modal and sheet style hides scroll tracks without disabling scrolling",()=>{
 const css=read("app/globals.css");
 assert.match(css,/\[role="dialog"\]\[aria-modal="true"\]/);
 assert.match(css,/\[role="alertdialog"\]\[aria-modal="true"\]/);
 assert.match(css,/max-height: min\(94dvh/);
 assert.match(css,/overflow-y: auto/);
 assert.match(css,/overscroll-behavior-y: contain/);
 assert.match(css,/scrollbar-width: none/);
 assert.match(css,/-webkit-overflow-scrolling: touch/);
 assert.match(css,/::-webkit-scrollbar\s*\{/);
 assert.match(css,/display: none/);
 assert.doesNotMatch(css,/\*\s*\{\s*overflow:\s*hidden/);
});
test("actual recurring preview retains accessible dialog semantics and internal scroll",()=>{
 const source=read("src/features/finance/RecurringWorkspace.tsx");
 assert.match(source,/role="dialog" aria-modal="true" aria-label="Recurring rule preview"/);
 assert.match(source,/max-h-\[94dvh\]/);
 assert.match(source,/overflow-y-auto/);
});
test("browser verifies wheel, keyboard, and hidden scrollbar at desktop and mobile widths",()=>{
 const script=read("scripts/phase-0i-dialog-scroll-acceptance.cjs");
 for(const view of ["{width:1440,height:900}","{width:1024,height:600}","{width:390,height:740}","{width:320,height:640}"])assert.ok(script.includes(view),view);
 assert.match(script,/scrollbarWidth/);
 assert.match(script,/page\.mouse\.wheel/);
 assert.match(script,/page\.keyboard\.press\("PageDown"\)/);
 assert.match(script,/getByRole\("dialog",\{name:"Recurring rule preview"\}\)/);
 assert.equal((script.match(/page\.goto\(/g)||[]).length,1,"Navigation must start at /workspaces only");
});

test("legacy customer and product selectors share the accessible modal scrollbar policy",()=>{
 for(const [path,label] of [
  ["components/dashboard/modals/SelectCustomerModal.tsx","Select Customer"],
  ["components/dashboard/modals/SelectProductModal.tsx","Add New Product"]
 ]){
  const source=read(path);
  assert.ok(source.includes('role="dialog" aria-modal="true" aria-label="'+label+'"'),path);
 }
});
