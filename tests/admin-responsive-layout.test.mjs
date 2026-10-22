import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
test("Admin Overview support grid remains shrinkable at narrow viewports",()=>{
 const content=read("src/features/platform-admin/AdminWorkspace.tsx");
 assert.match(content,/const cards="min-w-0 rounded-2xl/);
 assert.match(content,/grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-\[minmax\(0,1\.5fr\)_minmax\(280px,1fr\)\]/);
 assert.match(content,/mb-4 flex min-w-0 flex-wrap items-center justify-between gap-2/);
 assert.match(content,/flex w-full min-w-0 items-center gap-3 rounded-xl/);
});
test("continuous browser walkthrough checks actual overflow at 320px after user navigation",()=>{
 const source=read("scripts/phase-0x-human-browser-walkthrough.cjs");
 assert.match(source,/\["narrow",320\]/);
 assert.match(source,/document\.documentElement\.scrollWidth>window\.innerWidth\+2/);
 assert.match(source,/await page\.waitForURL\(url=>url\.pathname===target/);
 assert.match(source,/culprits/);
});
