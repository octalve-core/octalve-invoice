/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require("playwright");
const fs=require("node:fs");
const path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const routes=[
 "/workspaces","/customer","/customer/invoices","/customer/invoices/sample-1",
 "/customer/payments","/customer/receipts","/customer/merchants","/customer/messages",
 "/customer/notifications","/customer/settings","/admin","/admin/merchants",
 "/admin/customers","/admin/subscriptions","/admin/verifications","/admin/support",
 "/admin/notifications","/admin/updates","/admin/staff","/admin/security","/admin/audit"
];
(async()=>{
 const out=path.resolve("artifacts/phase-0uvw");fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const records=[],errors=[];
 try{
  for(const width of [320,390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:width>=1024?900:780},deviceScaleFactor:1});
   try{
    for(const route of routes){
     const name=route.replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"");
     try{
      const response=await page.goto(origin+route,{waitUntil:"domcontentloaded",timeout:30000});
      if(response?.status()!==200)throw Error("HTTP "+response?.status());
      if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2))throw Error("Horizontal page overflow");
      if(route.startsWith("/customer")){
       await page.getByText("Customer workspace",{exact:false}).first().waitFor();
       if(!await page.getByText("Sample data",{exact:false}).count()&&!await page.getByText("Sample invoice",{exact:false}).count())throw Error("Customer example indicator missing");
       if(route==="/customer/invoices/sample-1"){
        await page.getByRole("heading",{name:"WE-00001INV"}).waitFor();
        if(await page.getByRole("button",{name:"Pay invoice"}).isEnabled())throw Error("Payment enabled without authority");
       }
      }
      if(route.startsWith("/admin")){
       await page.getByText("Octalve operations",{exact:false}).first().waitFor();
       await page.getByText("Interface sample",{exact:false}).first().waitFor();
       if(await page.getByRole("button",{name:"Manage plans"}).count()&&await page.getByRole("button",{name:"Manage plans"}).isEnabled())throw Error("Admin billing mutation enabled");
      }
      if(["/customer","/customer/invoices","/customer/invoices/sample-1","/admin","/admin/merchants","/admin/support"].includes(route)){
       await page.screenshot({path:path.join(out,width+"-"+name+".png"),fullPage:true,animations:"disabled"});
      }
      records.push({width,route,status:"PASS"});
     }catch(e){const message=String(e?.message||e);errors.push({width,route,error:message.slice(0,700)});records.push({width,route,status:"FAIL",error:message.slice(0,700)});}
    }
   }finally{await page.close();}
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,"report.json"),JSON.stringify({sha:process.env.GITHUB_SHA||"local",records},null,2));
 console.log("Three-experience routes:",records.length-errors.length,"/",records.length);
 for(const e of errors)console.error("FAIL",e.width,e.route,e.error);
 if(errors.length)process.exitCode=1;
})().catch(err=>{console.error(err);process.exitCode=1;});
