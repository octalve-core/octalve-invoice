/* eslint-disable @typescript-eslint/no-require-imports */
/** Real-browser Z03 read-only, no POST/API or source-of-truth mutations. */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const out=path.resolve("artifacts/z03-lifecycle");
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const reports=[];
 try{
  for(const width of [1440,390,320]){
   const page=await browser.newPage({viewport:{width,height:width>=1024?900:760},deviceScaleFactor:1});
   let checks=0;const failures=[];
   async function check(label,fn){try{await fn();checks++;console.log("Z03",width,label)}catch(error){failures.push(label+": "+String(error?.message||error).slice(0,450));throw error}}
   try{
    await check("Invoice detail route",async()=>{
     const r=await page.goto(origin+"/dashboard/invoice/1");
     if(r.status()!==200)throw Error("Invoice detail route unreachable");
     await page.getByRole("link",{name:"Delivery preview"}).waitFor();
    });
    await check("Delivery preview via visible detail link",async()=>{
     await page.getByRole("link",{name:"Delivery preview"}).click();
     await page.waitForURL(url=>url.pathname==="/dashboard/invoice/1/delivery-preview");
     await page.getByRole("heading",{name:"Invoice delivery preview"}).waitFor();
    });
    await check("Sending, sharing and customer access remain disabled",async()=>{
     if(await page.getByRole("button",{name:"Send invoice"}).isEnabled())throw Error("Send is operational");
     if(await page.getByRole("button",{name:"Copy secure link"}).isEnabled())throw Error("Link is operational");
     await page.getByText(/no immutable issued snapshot/i).waitFor();
    });
    await check("Delivery method change stays local",async()=>{
     await page.getByRole("radio",{name:"Secure customer link"}).check();
     await page.getByText(/no link is available in this preview/i).waitFor();
     await page.getByRole("radio",{name:"Email"}).check();
     const email=page.getByRole("textbox",{name:"Delivery recipient"});
     if(await email.inputValue()!=="customer1@example.invalid")throw Error("Example recipient not copied");
     await email.fill("customer@invalid.example");
     if(await page.getByRole("button",{name:"Send invoice"}).isEnabled())throw Error("Local recipient unlocked real sending");
    });
    await check("No horizontal overflow",async()=>{
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
     if(overflow)throw Error("Horizontal overflow in delivery preview");
    });
    await page.screenshot({path:path.join(out,"delivery-"+width+".png"),fullPage:true,animations:"disabled"});
    await check("Quotation detail route",async()=>{
     const r=await page.goto(origin+"/dashboard/quotation/3");
     if(r.status()!==200)throw Error("Quotation detail route unreachable");
     await page.getByRole("link",{name:"Lifecycle preview"}).waitFor();
    });
    await check("Quotation lifecycle via visible detail link",async()=>{
     await page.getByRole("link",{name:"Lifecycle preview"}).click();
     await page.waitForURL(url=>url.pathname==="/dashboard/quotation/3/lifecycle");
     await page.getByRole("heading",{name:"Quotation lifecycle preview"}).waitFor();
    });
    await check("Sample acceptance never converts into a real invoice",async()=>{
     await page.getByRole("status").getByText(/fictional quotation record/).waitFor();
     if(await page.getByRole("button",{name:/Convert to a new invoice draft/}).isEnabled())throw Error("Unsafe conversion");
     const text=await page.getByRole("region",{name:"Quotation conversion requirements"}).textContent();
     if(!text?.includes("immutable accepted quotation snapshot"))throw Error("Accepted quotation must still require a frozen snapshot");
    });
    await check("No quotation horizontal overflow",async()=>{
     const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
     if(overflow)throw Error("Quotation lifecycle horizontal overflow");
    });
    await page.screenshot({path:path.join(out,"quotation-"+width+".png"),fullPage:true,animations:"disabled"});
   }catch(error){if(!failures.length)failures.push(String(error?.message||error).slice(0,750))}
   reports.push({width,checks,failures});await page.close();
  }
 }finally{await browser.close()}
 fs.writeFileSync(path.join(out,"report.json"),JSON.stringify({source:process.env.GITHUB_SHA||"local",reports},null,2));
 for(const x of reports)console.log("Z03_BROWSER",JSON.stringify(x));
 if(reports.some(x=>x.failures.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
