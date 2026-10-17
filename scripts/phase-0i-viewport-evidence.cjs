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
   if(await page.getByRole("main").getByRole("link",{name:"Dashboard",exact:true}).count())throw Error("Getting Started retained redundant dashboard button");
   if(await page.getByRole("link",{name:/Open full workspace setup/}).count())throw Error("Retired workspace entry point present");
   const quick=page.getByRole("region",{name:"Quick Create"});
   if(await quick.getByRole("button",{name:/New (Invoice|Customer|Expenses|Quotation)/}).count()!==4)throw Error("Shared Quick Create actions missing");
   await page.getByRole("link",{name:/Add business information/}).click();
   await page.getByRole("heading",{name:"Business Identity",level:1}).waitFor();
   await page.getByRole("link",{name:"Back to checklist"}).click();
   await page.getByRole("heading",{name:"Your setup checklist"}).waitFor();
   await page.getByRole("link",{name:/Customize invoice template/}).click();
   await page.waitForURL("**/dashboard/settings/invoice?from=getting-started");
   await page.getByRole("link",{name:"Back to Getting Started"}).click();
   await page.waitForURL("**/dashboard/getting-started");
   await page.getByRole("progressbar",{name:"Setup completion"}).waitFor();
   await page.getByRole("link",{name:/Set up payments and banks/}).click();
   await page.getByRole("heading",{name:"Online Payments & Banks"}).waitFor();
   const cards=page.locator('a[href^="/dashboard/getting-started/payments/"]');
   const cardStyle=await cards.first().evaluate(el=>getComputedStyle(el).backgroundColor);
   if(cardStyle!=="rgb(244, 248, 255)")throw Error("Payment method cards must use the approved blue tint");
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
   await page.goto(base+"/dashboard",{waitUntil:"domcontentloaded",timeout:18000});
   const welcome=page.getByRole("heading",{name:/Welcome to your dashboard|Welcome back/});
   await welcome.waitFor();
   const font=await welcome.evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
   if(width<640&&font>21)throw Error("Mobile welcome heading is oversized");
   const newInvoice=page.getByRole("region",{name:"Quick Create"}).getByRole("button",{name:/New Invoice/});
   await newInvoice.waitFor();
   if(width<640){
    const parts=newInvoice.locator("span.block");
    const first=await parts.nth(0).boundingBox();
    const second=await parts.nth(1).boundingBox();
    if(!first||!second||second.y<=first.y+2)throw Error("Mobile Quick Create label must stack New above Invoice");
   }
   await page.screenshot({path:path.join(out,"owner-polish-dashboard-"+width+".png"),fullPage:false,animations:"disabled"});
   if(await page.locator("html").evaluate(el=>el.scrollWidth>el.clientWidth+2))throw Error("Setup horizontal overflow");
   detail.status="PASS";
  }catch(e){errors++;detail.status="FAIL";detail.error=String(e?.message||e).slice(0,650)}
  results.push({batchP:detail});
  await page.close();
 }

 // Batch Q: independent invoice due/milestone responsive smoke tests.
 const qWidths=[320,360,390,430,768,1024,1440];
 for(const width of qWidths){
  const page=await browser.newPage({viewport:{width,height:width>=1024?650:780},deviceScaleFactor:1});
  const batchQ={width,status:"unknown"};
  try{
   const response=await page.goto(base+"/dashboard/invoice/create",{waitUntil:"domcontentloaded",timeout:20000});
   if(response?.status()!==200)throw Error("Invoice composer HTTP "+response?.status());
   await page.getByRole("button",{name:/Payment plan & communication/}).click();
   await page.getByRole("heading",{name:"Invoice workflow"}).waitFor();
   const method=page.getByRole("combobox",{name:"Collection method preview"});
   const review=page.getByRole("button",{name:"Review proposed split"});
   const dueTime=page.locator('input[aria-label="Invoice due time Africa/Lagos"]');
   if(!await dueTime.inputValue())throw Error("Invoice due time not initialized");
   await method.selectOption("dynamic-account");
   await page.getByRole("combobox",{name:"Dynamic account provider reference"}).selectOption("flutterwave-v3");
   await page.getByText("No account or expiry has been issued.",{exact:false}).waitFor();
   if(!await review.isDisabled())throw Error("Dynamic plan reviewed without verified account");
   await page.getByRole("button",{name:"Custom milestones"}).click();
   await page.getByRole("spinbutton",{name:"Milestone 1 percentage"}).fill("25");
   await page.getByRole("spinbutton",{name:"Milestone 2 percentage"}).fill("25");
   await page.getByRole("spinbutton",{name:"Milestone 3 percentage"}).fill("50");
   await page.getByText("Total allocation: 100%",{exact:false}).waitFor();
   if(!await review.isDisabled())throw Error("Dynamic milestones treated as valid without provider response");
   await method.selectOption("company-bank");
   await page.getByRole("button",{name:"Full payment"}).click();
   if(await review.isDisabled())throw Error("Manual full payment preview unexpectedly blocked");
   await page.getByRole("button",{name:"Two installments"}).click();
   await page.getByRole("button",{name:"Custom milestones"}).click();
   if(await page.getByRole("spinbutton",{name:"Milestone 1 percentage"}).inputValue()!=="25")throw Error("Custom milestone percentages lost when changing tabs");
   await page.getByRole("button",{name:"Review proposed split"}).click();
   await page.getByText("No payment schedule was saved or communicated.",{exact:false}).last().waitFor();
   if(await page.locator("html").evaluate(el=>el.scrollWidth>el.clientWidth+2))throw Error("Batch Q viewport overflow");
   await page.screenshot({path:path.join(out,"batch-q-due-milestones-"+width+".png"),fullPage:true,animations:"disabled"});
   batchQ.status="PASS";
  }catch(e){errors++;batchQ.status="FAIL";batchQ.error=String(e?.message||e).slice(0,720);}
  results.push({batchQ});
  await page.close();
 }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,"report.json"),JSON.stringify({head:process.env.GITHUB_SHA||"local",results},null,2));
 console.log("Phase 0I viewport checks:",results.filter(x=>!x.batchP&&!x.batchQ&&x.status==="PASS").length,"/",results.filter(x=>!x.batchP&&!x.batchQ).length);
 console.log("Batch P payment setup checks:",results.filter(x=>x.batchP?.status==="PASS").length,"/",results.filter(x=>x.batchP).length);
 console.log("Batch Q invoice due and milestone checks:",results.filter(x=>x.batchQ?.status==="PASS").length,"/",results.filter(x=>x.batchQ).length);
 for(const failed of results.filter(x=>x.status==="FAIL"))console.error("VIEWPORT FAIL",failed.width,failed.route,failed.error);
 for(const failed of results.filter(x=>x.batchP?.status==="FAIL"))console.error("BATCH P FAIL",failed.batchP.width,failed.batchP.error);
 for(const failed of results.filter(x=>x.batchQ?.status==="FAIL"))console.error("BATCH Q FAIL",failed.batchQ.width,failed.batchQ.error);
 if(errors)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
