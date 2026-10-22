/* eslint-disable @typescript-eslint/no-require-imports */
/** Z02 continuous user-only scenario. No API/database operations or deep-link jumps. */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const output=path.resolve("artifacts/phase-0z02-shared-domain");
async function navigateStep(page,label){
 const nav=page.getByRole("navigation",{name:"Invoice steps"});
 await nav.getByRole("link",{name:new RegExp(label)}).click();
 await page.waitForFunction(expected=>[...document.querySelectorAll('nav[aria-label="Invoice steps"] a')]
  .some(a=>a.getAttribute("aria-current")==="step"&&a.textContent?.includes(expected)),label,{timeout:15000});
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true});const reports=[];
 try{
  for(const width of [1440,390,320]){
   const page=await browser.newPage({viewport:{width,height:width>1000?900:740},deviceScaleFactor:1});
   const checks=[],issues=[];
   const check=(name,ok)=>{checks.push({name,ok});if(!ok)issues.push(name);};
   try{
    const response=await page.goto(origin+"/workspaces",{waitUntil:"domcontentloaded",timeout:30000});
    check("Visible workspace entry",response?.status()===200);
    await page.getByRole("link",{name:/Merchant workspace/}).click();
    await page.waitForURL(u=>u.pathname==="/dashboard");
    const quick=page.getByRole("region",{name:"Quick Create"});
    await quick.getByRole("button",{name:/New Invoice/}).click();
    await page.getByRole("heading",{name:"Create invoice"}).waitFor();
    await navigateStep(page,"Items");
    const region=page.getByRole("region",{name:"Invoice products and services"});
    await region.getByRole("button",{name:"Professional services",exact:true}).click();
    const dialog=page.getByRole("dialog",{name:"Select product or service"});
    await dialog.waitFor({state:"visible"});
    const dims=await dialog.evaluate(el=>({left:el.getBoundingClientRect().left,right:el.getBoundingClientRect().right,screen:innerWidth,
     width:getComputedStyle(el).scrollbarWidth}));
    check("Picker within mobile/desktop viewport",dims.left>=-2&&dims.right<=dims.screen+2);
    check("Shared hidden scrollbar policy applies",dims.width==="none");
    await dialog.getByRole("button",{name:"Add new product or service"}).click();
    await dialog.getByRole("textbox",{name:"Item name"}).fill("Z02 browser-created service");
    await dialog.getByRole("textbox",{name:"Item rate"}).fill("125.50");
    await dialog.getByRole("textbox",{name:"Item discountPercent"}).fill("10");
    await dialog.getByRole("button",{name:"Add and select"}).click();
    check("Added item selected in draft",await region.getByRole("textbox",{name:"Product or service 1"}).inputValue()==="Z02 browser-created service");
    check("Unit price copied into draft snapshot",await region.getByRole("textbox",{name:"Rate for item 1"}).inputValue()==="125.50");
    await region.getByRole("button",{name:"Z02 browser-created service",exact:true}).click();
    await dialog.getByRole("button",{name:"Edit catalogue item Z02 browser-created service"}).click();
    await dialog.getByRole("textbox",{name:"Item rate"}).fill("130.75");
    await dialog.getByRole("button",{name:"Update and select"}).click();
    check("Explicit catalogue update copied to draft",await region.getByRole("textbox",{name:"Rate for item 1"}).inputValue()==="130.75");
    await navigateStep(page,"Totals");
    check("Unverified blanket invoice tax removed",await page.getByRole("textbox",{name:"Tax percentage"}).count()===0&&await page.getByRole("spinbutton",{name:"Tax percentage"}).count()===0);
    await navigateStep(page,"Payments");
    await page.getByRole("button",{name:"Custom milestones"}).click();
    await page.getByRole("spinbutton",{name:"Milestone 1 percentage"}).fill("60");
    await page.getByRole("spinbutton",{name:"Milestone 2 percentage"}).fill("20");
    await navigateStep(page,"Items");await navigateStep(page,"Payments");
    check("Custom milestone survives five-step navigation",await page.getByRole("spinbutton",{name:"Milestone 1 percentage"}).inputValue()==="60");
    await navigateStep(page,"Preview");
    check("Cannot issue real financial document",!(await page.getByRole("button",{name:"Issue invoice"}).isEnabled()));
    check("No document horizontal overflow",await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
    await page.screenshot({path:path.join(output,"invoice-"+width+".png"),fullPage:true,animations:"disabled"});
   }catch(e){issues.push(String(e?.message||e).slice(0,1300));}
   reports.push({width,checks,issues});
   await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(output,"report.json"),JSON.stringify({sha:process.env.GITHUB_SHA||"local",reports},null,2));
 for(const r of reports){console.log("Z02_BROWSER",r.width,r.checks.length,"checks",r.issues.length,"issues");for(const i of r.issues)console.error("Z02_BROWSER_FAIL",r.width,i)}
 if(reports.some(r=>r.issues.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
