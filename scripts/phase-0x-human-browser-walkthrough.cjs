/* eslint-disable @typescript-eslint/no-require-imports */
/** Browser-only walkthrough: one entry URL, then visible clicks/fills/links.
 * No page.request, fetch, direct deep-link goto, mocks, backend writes or database calls.
 */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const output=path.resolve("artifacts/phase-0x-walkthrough");
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const reports=[];
 try{
  for(const [name,width] of [["mobile",390],["desktop",1440],["narrow",320]]){
   const page=await browser.newPage({viewport:{width,height:width>=1024?900:780},deviceScaleFactor:1});
   const steps=[],issues=[];
   const record=async(label)=>{
    await page.waitForLoadState("domcontentloaded");
    const url=new URL(page.url()).pathname;
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
    steps.push({action:label,route:url,overflow});
    if(overflow)issues.push({step:label,error:"Document horizontal overflow",route:url});
   };
   const click=async(locator,label)=>{await locator.click({timeout:15000});await record(label);};
   const customerNav=page.getByRole("navigation",{name:"Customer workspace navigation"});
   const adminNav=page.getByRole("navigation",{name:"Octalve operations navigation"});
   const customerMobile=page.getByRole("navigation",{name:"Customer workspace mobile navigation"});
   const adminMobile=page.getByRole("navigation",{name:"Octalve operations mobile navigation"});
   const mobile=width<1024;
   const cNav=(label)=>mobile?customerMobile.getByRole("link",{name:label,exact:true}):customerNav.getByRole("link",{name:label,exact:true});
   const aNav=(label)=>mobile?adminMobile.getByRole("link",{name:label,exact:true}):adminNav.getByRole("link",{name:label,exact:true});
   try{
    const entry=await page.goto(origin+"/workspaces",{waitUntil:"domcontentloaded",timeout:30000});
    if(entry?.status()!==200)throw Error("Entry page HTTP "+entry?.status());
    await record("Open workspace chooser");
    await click(page.getByRole("link",{name:/Merchant workspace/}),"Choose merchant from landing card");
    if(mobile){
     await click(page.getByRole("navigation",{name:"Primary mobile navigation"}).getByRole("link",{name:"Invoices"}),"Merchant invoices via mobile footer");
    }else{
     await click(page.getByRole("navigation",{name:"Desktop main navigation"}).getByRole("link",{name:"Invoice",exact:true}),"Merchant invoices via sidebar");
    }
    await page.getByRole("heading",{name:"Invoice",exact:true}).first().waitFor();
    if(!mobile){
     const search=page.getByRole("searchbox",{name:"Find a workspace page"});
     await search.fill("expenses");await record("Type global navigation search (not record search)");
     await click(page.getByRole("navigation",{name:"Workspace search results"}).getByRole("link",{name:"Expenses"}),"Use global search suggestion");
     const filter=page.getByRole("button",{name:"Filters",exact:true});
     if(await filter.count()){await click(filter.first(),"Open local expenses filter");}
     await click(page.getByRole("navigation",{name:"Desktop main navigation"}).getByRole("link",{name:"Overview"}),"Return to merchant overview");
    }else{
     await click(page.getByRole("navigation",{name:"Primary mobile navigation"}).getByRole("link",{name:"Home"}),"Return to merchant overview");
    }
    const quick=page.getByRole("region",{name:"Quick Create"});
    await click(quick.getByRole("button",{name:/New Invoice/}),"Create invoice from overview");
    await page.getByRole("heading",{name:"Create invoice"}).waitFor();
    const stepnav=page.getByRole("navigation",{name:"Invoice steps"});
    await click(stepnav.getByRole("link",{name:/Items/}),"Open invoice items");
    await click(stepnav.getByRole("link",{name:/Totals/}),"Open invoice totals");
    await click(stepnav.getByRole("link",{name:/Payments/}),"Open invoice payment plan");
    await click(stepnav.getByRole("link",{name:/Preview/}),"Open invoice document view");
    if(await page.getByRole("button",{name:"Issue invoice"}).isEnabled())throw Error("Draft incorrectly issuable");
    await page.screenshot({path:path.join(output,name+"-merchant-invoice.png"),fullPage:true,animations:"disabled"});
    if(mobile){
     await click(page.getByRole("navigation",{name:"Primary mobile navigation"}).getByRole("link",{name:"Me"}),"Open merchant settings via footer");
     await click(page.getByRole("link",{name:/Switch workspace/}).first(),"Switch workspace through settings");
    }else{
     await click(page.getByRole("button",{name:"Account menu"}),"Open merchant account menu");
     await click(page.getByRole("menuitem",{name:"Switch workspace"}),"Switch workspace through account menu");
    }
    await click(page.getByRole("link",{name:/Customer workspace/}),"Choose customer from workspace chooser");
    await page.screenshot({path:path.join(output,name+"-customer-home.png"),fullPage:true,animations:"disabled"});
    await click(page.getByRole("link",{name:/Weyport Energy.*Equipment servicing/}).first(),"Open received customer invoice");
    await page.getByRole("heading",{name:"WE-00001INV"}).waitFor();
    if(await page.getByRole("button",{name:"Pay invoice"}).isEnabled())throw Error("Unverified payment action enabled");
    await click(page.getByRole("link",{name:/All invoices/}),"Return to customer invoices");
    const cs=page.getByRole("searchbox",{name:"Search customer invoices"});
    await cs.fill("Atlas");await record("Filter customer invoice records");
    await cs.fill("");await record("Clear customer record filter");
    await click(cNav("Payments"),"Customer payment activity");
    if(mobile){
     await click(cNav("More"),"Customer mobile More");
     await click(page.getByRole("navigation",{name:"Additional workspace pages"}).getByRole("link",{name:"Support"}),"Reach customer support from More");
    }else{
     await click(cNav("Support"),"Customer support via sidebar");
    }
    await click(page.getByRole("link",{name:/Invoice access question/}).first(),"Open customer support case");
    await page.getByRole("heading",{name:"Invoice access question"}).waitFor();
    await click(page.getByRole("link",{name:/Support cases/}),"Return to customer support cases");
    if(mobile){
     await click(cNav("More"),"Customer More for messaging");
     await click(page.getByRole("navigation",{name:"Additional workspace pages"}).getByRole("link",{name:"Messages"}),"Open customer messages");
    }else{
     await click(cNav("Messages"),"Open customer messages");
    }
    await click(page.getByRole("link",{name:/Your invoice is ready/}).first(),"Read customer message");
    await click(page.getByRole("link",{name:/Messages/}).first(),"Return to message inbox");
    if(mobile){await click(page.getByRole("link",{name:"Change workspace"}),"Switch customer workspace with top control");}
    else{await click(page.getByRole("link",{name:"Other workspaces"}),"Switch customer workspace from sidebar");}
    await click(page.getByRole("link",{name:/Octalve operations/}),"Choose Octalve operations");
    await page.screenshot({path:path.join(output,name+"-admin-home.png"),fullPage:true,animations:"disabled"});
    await click(aNav("Support"),"Open Octalve support directory");
    await click(page.getByRole("button",{name:"Filters"}),"Open support filters");
    await click(page.getByRole("button",{name:"Pending",exact:true}),"Filter support to Pending");
    await click(page.getByRole("button",{name:"All",exact:true}),"Reset support filter");
    await click(page.getByRole("button",{name:"Actions for SUP-001"}),"Open actions via three-dot button");
    await page.getByRole("dialog",{name:"Actions for SUP-001"}).waitFor();
    await click(page.getByRole("dialog",{name:"Actions for SUP-001"}).getByRole("link",{name:"View details"}),"Open support case from actions");
    await click(page.getByRole("button",{name:"Choose sample assignment"}),"Open assignment selector");
    await page.getByRole("dialog",{name:"Choose sample assignment"}).waitFor();
    await click(page.getByRole("dialog",{name:"Choose sample assignment"}).getByRole("button",{name:"Support specialist"}),"Select local assignment without saving");
    if(await page.getByRole("button",{name:"Save assignment"}).isEnabled())throw Error("Unapproved staff assignment enabled");
    await page.screenshot({path:path.join(output,name+"-admin-case.png"),fullPage:true,animations:"disabled"});
    await click(page.getByRole("link",{name:/Back to support/}),"Back to support");
    if(mobile){
     await click(aNav("More"),"Open admin More");
     await click(page.getByRole("navigation",{name:"Additional workspace pages"}).getByRole("link",{name:"Staff"}),"Open admin staff from More");
    }else{
     await click(aNav("Staff"),"Open admin staff directory");
    }
    await click(page.getByRole("link",{name:"View ST-001"}),"Open staff role details");
    await page.getByRole("heading",{name:"Support specialist"}).waitFor();
    await record("Inspect staff role and assignment restrictions");
   }catch(error){issues.push({error:String(error?.message||error).slice(0,1000),at:page.url()});}
   reports.push({viewport:name,width,steps,issues});
   await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(output,"report.json"),JSON.stringify({sha:process.env.GITHUB_SHA||"local",reports},null,2));
 for(const r of reports){console.log("WALKTHROUGH",r.viewport,r.steps.length,"steps",r.issues.length,"issues");for(const i of r.issues)console.error(r.viewport,JSON.stringify(i));}
 if(reports.some(r=>r.issues.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
