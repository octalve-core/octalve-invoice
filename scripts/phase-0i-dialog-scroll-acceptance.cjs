/* eslint-disable @typescript-eslint/no-require-imports */
/** Browser-only scrollbar-visibility and preserved scrolling acceptance.
 * Start at workspace chooser and reach pop-ups through ordinary UI navigation.
 * No API calls, database edits, synthetic save or direct deep-link navigation.
 */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const output=path.resolve("artifacts/phase-0i-dialog-scroll");
const sizes=[{width:1440,height:900},{width:1024,height:600},{width:390,height:740},{width:320,height:640}];
const selector='[role="dialog"][aria-modal="true"]';
const css=async(page)=>page.locator(selector).evaluate(el=>{
 const g=getComputedStyle(el),r=el.getBoundingClientRect();
 return {scrollbarWidth:g.scrollbarWidth,overflowY:g.overflowY,overscrollY:g.overscrollBehaviorY,
  height:r.height,viewport:window.innerHeight,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,
  scrollTop:el.scrollTop,documentOverflow:document.documentElement.scrollWidth>innerWidth+2};
});
(async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({headless:true});
 const reports=[];try{
 for(const viewport of sizes){
  const page=await browser.newPage({viewport,deviceScaleFactor:1,hasTouch:viewport.width<700,isMobile:viewport.width<700});
  const problems=[],observations=[];
  try{
   const x=await page.goto(origin+"/workspaces",{waitUntil:"domcontentloaded",timeout:30000});
   if(x?.status()!==200)throw Error("Workspace selection unavailable");
   await page.getByRole("link",{name:/Merchant workspace/}).click();
   await page.waitForURL(url=>url.pathname==="/dashboard");
   if(viewport.width>=1024){
    await page.getByRole("navigation",{name:"Desktop main navigation"}).getByRole("link",{name:"Recurring Expense"}).click();
   }else{
    await page.getByRole("navigation",{name:"Primary mobile navigation"}).getByRole("link",{name:"More"}).click();
    await page.getByRole("link",{name:/Recurring income\/expense/i}).click();
   }
   await page.waitForURL(url=>/\/dashboard\/recurring(?:-expense)?$/.test(url.pathname));
   await page.getByRole("button",{name:"New recurring rule"}).click();
   const dialog=page.getByRole("dialog",{name:"Recurring rule preview"});
   await dialog.waitFor({state:"visible"});
   let before=await css(page);observations.push({step:"initial recurring sheet",...before});
   if(before.scrollbarWidth!=="none")problems.push("Dialog scroll track visible");
   if(before.overflowY!=="auto"&&before.overflowY!=="scroll")problems.push("Dialog scrolling disabled");
   if(before.documentOverflow)problems.push("Opening dialog causes viewport horizontal overflow");
   if(before.height>viewport.height+1)problems.push("Dialog exceeds viewport");
   if(before.scrollHeight<=before.clientHeight+8)problems.push("Cannot verify scroll on long recurring form");
   await page.screenshot({path:path.join(output,viewport.width+"-recurring-before.png"),animations:"disabled"});
   const box=await dialog.boundingBox();if(!box)throw Error("No visible recurring dialog");
   await page.mouse.move(box.x+Math.min(box.width/2,150),box.y+Math.min(box.height/2,230));
   await page.mouse.wheel(0,1200);
   await page.waitForFunction(()=>document.querySelector('[role="dialog"][aria-label="Recurring rule preview"]')?.scrollTop>10,null,{timeout:3500});
   const after=await css(page);observations.push({step:"mouse wheel",...after});
   if(!(after.scrollTop>10))problems.push("Wheel scroll did not move dialog");
   if(after.scrollbarWidth!=="none")problems.push("Scrollbar reappeared after scrolling");
   await page.screenshot({path:path.join(output,viewport.width+"-recurring-after.png"),animations:"disabled"});
   // Demonstrate the dialog remains keyboard-scrollable, too, without a visible rail.
   await page.mouse.wheel(0,-2000);
   await page.waitForTimeout(140);
   await dialog.getByRole("textbox",{name:"Name"}).focus();
   await page.keyboard.press("PageDown");
   await page.waitForTimeout(170);
   const keyboard=await css(page);observations.push({step:"keyboard PageDown",...keyboard});
   if(!(keyboard.scrollTop>0))problems.push("Keyboard PageDown did not move dialog");
   await dialog.getByRole("button",{name:"Close recurring form"}).click();
   if(await page.getByRole("dialog",{name:"Recurring rule preview"}).count())problems.push("Dialog did not close");
   await page.getByRole("button",{name:"Filter recurring records"}).click();
   const filters=page.getByRole("dialog",{name:"Recurring filters"});
   await filters.waitFor({state:"visible"});
   const style=await css(page);observations.push({step:"short filter popup",...style});
   if(style.scrollbarWidth!=="none")problems.push("Filter dialog scrollbar visible");
   await filters.getByRole("button",{name:"Close recurring filters"}).click();
  }catch(e){problems.push(String(e?.message||e).slice(0,1200));}
  reports.push({viewport,observations,problems});await page.close();
 }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(output,"report.json"),JSON.stringify({sourceSha:process.env.GITHUB_SHA||"local",reports},null,2));
 for(const d of reports){console.log("DIALOG_SCROLL",d.viewport.width,d.viewport.height,"checks",d.observations.length,"errors",d.problems.length);for(const e of d.problems)console.error("DIALOG_SCROLL_FAIL",d.viewport.width,e);}
 if(reports.some(d=>d.problems.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});