/* eslint-disable @typescript-eslint/no-require-imports */
/** Batch Y.1 browser geometry regression: begin at the workspace chooser; all
 * merchant routes reached through visible navigation links (no API/DB writes).
 * Page evaluate reads layout geometry only; scrolling uses the mouse wheel.
 */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const output=path.resolve("artifacts/phase-0y1-navbar");
const desktopRoutes=[
 {name:"Overview",path:"/dashboard"},
 {name:"Invoice",path:"/dashboard/invoice"},
 {name:"Receipt",path:"/dashboard/receipt"},
 {name:"Quotation",path:"/dashboard/quotation"},
 {name:"Expenses",path:"/dashboard/expenses"},
 {name:"Customer",path:"/dashboard/customer"},
 {name:"Items",path:"/dashboard/items"},
 {name:"Payment Received",path:"/dashboard/payment-received"},
 {name:"Credit note",path:"/dashboard/credit-note"},
 {name:"Other Services",path:"/dashboard/other-services"},
 {name:"Settings",path:"/dashboard/settings"}
];
async function geometry(page){
 return page.evaluate(()=>{
  const sidebar=document.querySelector('aside[aria-label="Desktop workspace sidebar"]');
  const logo=sidebar?.querySelector("div.h-16");
  const header=document.querySelector('header input[aria-label="Find a workspace page"]')?.closest("header");
  const panel=sidebar?.nextElementSibling;
  const main=document.querySelector('main[data-merchant-scroll-region]');
  const rect=el=>{if(!(el instanceof HTMLElement))return null;const r=el.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height,left:r.left};};
  return {sidebar:rect(sidebar),logo:rect(logo),header:rect(header),main:rect(main),
   headerFlexShrink:header?getComputedStyle(header).flexShrink:null,
   mainOverflowY:main?getComputedStyle(main).overflowY:null,
   panelOverflowY:panel?getComputedStyle(panel).overflowY:null,
   mainScrollTop:main?.scrollTop??null,mainScrollable:!!main&&main.scrollHeight>main.clientHeight+2,
   outerScrollable:!!panel&&panel.scrollHeight>panel.clientHeight+2,
   bodyScrollY:window.scrollY,
   horizontalOverflow:document.documentElement.scrollWidth>window.innerWidth+2};
 });
}
function compare(before,after,width,label){
 const issues=[],close=(a,b,tol=1)=>typeof a==="number"&&typeof b==="number"&&Math.abs(a-b)<=tol;
 if(!before.header||!before.logo||!before.sidebar||!before.main)issues.push("Missing nav, logo, sidebar or content region");
 else{
  if(!close(before.header.height,64,0.75))issues.push("Navbar is not exactly 64px: "+before.header.height);
  if(!close(before.logo.height,64,0.75))issues.push("Logo container is not 64px: "+before.logo.height);
  if(!close(before.logo.bottom,before.header.bottom,0.75))issues.push("Navbar and logo bottom edges differ");
  if(!close(before.header.top,0,0.75))issues.push("Navbar not anchored at viewport top");
  if(!close(before.sidebar.top,0,0.75))issues.push("Sidebar not anchored at viewport top");
  if(before.headerFlexShrink!=="0")issues.push("Navbar is still shrinkable");
  if(!["auto","scroll"].includes(before.mainOverflowY))issues.push("Main is not independently scrollable: "+before.mainOverflowY);
  if(before.panelOverflowY!=="hidden")issues.push("Column still owns vertical scrolling: "+before.panelOverflowY);
  if(before.outerScrollable)issues.push("Desktop panel overflow (wrong scroll owner)");
  if(!close(before.main.top,before.header.bottom,0.75))issues.push("Page main starts above or below navbar");
  if(!close(before.header.top,after.header?.top,0.75)||!close(before.header.height,after.header?.height,0.75))issues.push("Navbar moved during content scrolling");
  if(!close(before.logo.bottom,after.logo?.bottom,0.75)||!close(before.sidebar.top,after.sidebar?.top,0.75))issues.push("Sidebar/branding moved during content scrolling");
  if(before.mainScrollable&&!(after.mainScrollTop>0))issues.push("Mouse scroll did not move long content");
  if(!close(after.bodyScrollY,0,0.75))issues.push("Entire document scrolled instead of just content");
 }
 if(before.horizontalOverflow||after.horizontalOverflow)issues.push("Horizontal overflow at "+width+" on "+label);
 return issues;
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true}),reports=[];
 try{
  for(const {width,height} of [{width:1024,height:600},{width:1280,height:768},{width:1440,height:900},{width:390,height:780},{width:320,height:700},{width:430,height:900}]){
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
   const cases=[],problems=[];
   try{
    const res=await page.goto(origin+"/workspaces",{waitUntil:"domcontentloaded",timeout:30000});
    if(res?.status()!==200)throw Error("Workspace chooser unavailable: "+res?.status());
    await page.getByRole("link",{name:/Merchant workspace/}).click();
    await page.waitForURL(/\/dashboard(?:\/|$)/);
    if(width>=1024){
     const nav=page.getByRole("navigation",{name:"Desktop main navigation"});
     for(const route of desktopRoutes){
      if(route.path!=="/dashboard")await nav.getByRole("link",{name:route.name,exact:true}).click();
      await page.waitForURL(url=>url.pathname===route.path,{timeout:15000});
      const before=await geometry(page);
      if(!before.main)throw Error("Missing main for "+route.name);
      await page.mouse.move(Math.max(before.main.left+20,Math.min(width-60,before.main.left+120)),Math.min(height-40,before.main.top+130));
      await page.mouse.wheel(0,9000);
      // Chromium may defer wheel scrolling until a subsequent frame. Wait for
      // the actual rendered scroll position, then retry with a visible hover.
      if(before.mainScrollable && before.mainScrollTop===0){
       try{
        await page.waitForFunction(()=>((document.querySelector('main[data-merchant-scroll-region]'))?.scrollTop||0)>0,null,{timeout:1800});
       }catch{
        await page.locator('main[data-merchant-scroll-region]').hover({position:{x:24,y:24}});
        await page.mouse.wheel(0,9000);
        await page.waitForTimeout(450);
       }
      }else await page.waitForTimeout(160);
      const after=await geometry(page);
      const errors=compare(before,after,width+"x"+height,route.name);
      cases.push({route:route.path,label:route.name,before,after,errors});
      if(errors.length)problems.push({route:route.path,errors});
      if(["Invoice","Quotation","Expenses"].includes(route.name))await page.screenshot({path:path.join(output,width+"-"+route.name.toLowerCase()+".png"),animations:"disabled"});
      if(after.mainScrollTop>0){
       await page.mouse.wheel(0,-12000);
       await page.waitForTimeout(100);
      }
     }
    }else{
     const menu=page.getByRole("navigation",{name:"Primary mobile navigation"});
     for(const name of ["Invoices","Receipts","More","Me","Home"]){
      await menu.getByRole("link",{name,exact:true}).click();
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
      cases.push({label:name,route:new URL(page.url()).pathname,horizontalOverflow:overflow});
      if(overflow)problems.push({name,error:"mobile horizontal overflow"});
     }
     await page.screenshot({path:path.join(output,width+"-mobile.png"),animations:"disabled"});
    }
   }catch(error){problems.push({error:String(error?.message||error).slice(0,1200),route:page.url()});}
   reports.push({viewport:{width,height},cases,problems});await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(output,"report.json"),JSON.stringify({sourceSha:process.env.GITHUB_SHA||"local",reports},null,2));
 for(const report of reports){
  console.log("NAVBAR_GEOMETRY",JSON.stringify({viewport:report.viewport,checked:report.cases.length,problems:report.problems.length}));
  for(const problem of report.problems)console.error("FAIL",JSON.stringify(problem));
 }
 if(reports.some(r=>r.problems.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
