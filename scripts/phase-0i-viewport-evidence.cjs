/* eslint-disable @typescript-eslint/no-require-imports -- isolated CommonJS browser evidence */
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const base=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const widths=[320,360,430,1024];
const routes=[
 "/login","/signup","/dashboard","/dashboard/other-services",
 "/dashboard/invoice","/dashboard/invoice/create","/dashboard/invoice/1",
 "/dashboard/finance-calculator","/dashboard/finance/statement",
 "/dashboard/finance/receivables","/dashboard/recurring",
 "/dashboard/report","/dashboard/tax-centre","/dashboard/insights-support",
 "/dashboard/quotation/1","/portal"
];
(async()=>{
 const out=path.resolve("artifacts/phase-0i-viewports");fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const results=[];let errors=0;
 try{
  for(const width of widths){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   for(const route of routes){
    const item={width,route,status:"unknown"};
    try{
     const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:18000});
     if(response?.status()!==200)throw Error("HTTP "+response?.status());
     await page.waitForTimeout(240);
     const layout=await page.evaluate(()=>({
      scroll:document.documentElement.scrollWidth,
      width:document.documentElement.clientWidth,
      body:document.body.scrollWidth
     }));
     if(layout.scroll>width+2)throw Error("Viewport overflow: "+JSON.stringify(layout));
     if(route==="/dashboard/finance-calculator"){
      await page.getByRole("heading",{name:"Finance Calculator"}).waitFor();
      await page.getByRole("button",{name:"Cash flow"}).click();
      await page.getByRole("button",{name:"Cash runway"}).click();
      await page.getByRole("heading",{name:/Cash runway|Cash/}).first().waitFor();
     }
     if(route==="/dashboard/finance/statement"){
      const trigger=page.getByRole("button",{name:"Filter finance records"});
      await trigger.click();
      const dialog=page.getByRole("dialog",{name:"Finance filters"});
      await dialog.waitFor({state:"visible"});
      await page.keyboard.press("Escape");
      await dialog.waitFor({state:"hidden"});
      if(!await trigger.evaluate(el=>document.activeElement===el))throw Error("Dialog did not restore focus to its filter trigger");
     }
     if(route==="/dashboard/quotation/1"){
      await page.getByRole("button",{name:"Prepare email"}).click();
      const dialog=page.getByRole("dialog",{name:"Preview quotation email"});
      await dialog.waitFor({state:"visible"});
      await page.keyboard.press("Escape");
      await dialog.waitFor({state:"hidden"});
     }
     const filename=width+"-"+route.replace(/[^\w]+/g,"-").replace(/^-|-$/g,"")+".png";
     await page.screenshot({path:path.join(out,filename),fullPage:true,animations:"disabled"});
     item.status="PASS";item.screenshot=filename;
    }catch(e){item.status="FAIL";item.error=String(e?.message||e).slice(0,650);errors++;}
    results.push(item);
   }
   await page.close();
  }

 // Batch P compact setup and six dedicated routes — separate from standard 64 checks.
 const paymentWidths=[320,360,390,430,768,1024,1440];
 for(const width of paymentWidths){
  const page=await browser.newPage({viewport:{width,height:width>=1024?650:780},deviceScaleFactor:1});
  const detail={width,status:"unknown"};
  try{
   let response=await page.goto(base+"/dashboard/getting-started",{waitUntil:"domcontentloaded",timeout:18000});
   if(response?.status()!==200)throw Error("Checklist HTTP "+response?.status());
   await page.getByRole("heading",{name:"Your setup checklist"}).waitFor();
   await page.getByRole("progressbar",{name:"Setup completion"}).waitFor();
   await page.getByRole("link",{name:/Set up payments and banks/}).click();
   await page.getByRole("heading",{name:"Online Payments & Banks"}).waitFor();
   if(await page.locator('a[href^="/dashboard/getting-started/payments/"]').count()!==6)throw Error("Six payment methods not available");
   if(await page.locator("html").evaluate(el=>el.scrollWidth>el.clientWidth+2))throw Error("Directory horizontal overflow");
   await page.screenshot({path:path.join(out,"batch-p-directory-"+width+".png"),fullPage:true,animations:"disabled"});
   await page.locator('a[href="/dashboard/getting-started/payments/paystack"]').click();
   await page.getByRole("heading",{name:"Paystack",level:1}).waitFor();
   const keys=page.getByRole("group",{name:"Example credential fields"});
   if(await keys.locator("input:enabled").count())throw Error("Live credential collection unexpectedly active");
   await page.getByRole("button",{name:"Show example"}).first().click();
   await page.getByRole("button",{name:"Hide example"}).waitFor();
   if(!await page.getByRole("button",{name:"Save & Verify Connection"}).isDisabled())throw Error("Fake provider connection is enabled");
   await page.screenshot({path:path.join(out,"batch-p-paystack-"+width+".png"),fullPage:true,animations:"disabled"});
   await page.getByRole("link",{name:"← All payment methods"}).click();
   await page.locator('a[href="/dashboard/getting-started/payments/bank-transfer"]').click();
   await page.getByRole("combobox",{name:"Bank name"}).fill("Guaranty");
   await page.getByRole("option",{name:"Guaranty Trust Bank (GTBank)"}).click();
   await page.getByRole("textbox",{name:"Bank account number"}).fill("0123456789");
   if(!await page.getByRole("button",{name:"Add Account"}).isDisabled())throw Error("Unverified account could be added");
   await page.screenshot({path:path.join(out,"batch-p-bank-"+width+".png"),fullPage:true,animations:"disabled"});
   if(await page.locator("html").evaluate(el=>el.scrollWidth>el.clientWidth+2))throw Error("Setup horizontal overflow");
   detail.status="PASS";
  }catch(e){errors++;detail.status="FAIL";detail.error=String(e?.message||e).slice(0,650)}
  results.push({batchP:detail});
  await page.close();
 }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,"report.json"),JSON.stringify({head:process.env.GITHUB_SHA||"local",results},null,2));
 console.log("Phase 0I viewport checks:",results.filter(x=>!x.batchP&&x.status==="PASS").length,"/",results.filter(x=>!x.batchP).length);
 console.log("Batch P payment setup checks:",results.filter(x=>x.batchP?.status==="PASS").length,"/",results.filter(x=>x.batchP).length);
 for(const failed of results.filter(x=>x.status==="FAIL"))console.error("VIEWPORT FAIL",failed.width,failed.route,failed.error);
 for(const failed of results.filter(x=>x.batchP?.status==="FAIL"))console.error("BATCH P FAIL",failed.batchP.width,failed.batchP.error);
 if(errors)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
