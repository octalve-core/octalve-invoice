/* eslint-disable @typescript-eslint/no-require-imports */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const out=path.resolve("artifacts/z04-access");
const journeys=[
 {from:"/dashboard/staff",link:"Staff access readiness",target:"/dashboard/staff/access",heading:"Staff access readiness"},
 {from:"/customer/settings",link:"Access readiness",target:"/customer/access",heading:"Customer access readiness"},
 {from:"/admin/security",link:"Access readiness",target:"/admin/access",heading:"Octalve staff access readiness"}
];
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({headless:true});const records=[],errors=[];
 try{
  for(const width of [320,390,768,1440]){
   const page=await browser.newPage({viewport:{width,height:width>=1024?900:780},deviceScaleFactor:1});
   for(const journey of journeys){
    try{
     const from=await page.goto(origin+journey.from,{waitUntil:"domcontentloaded",timeout:30000});
     if(from?.status()!==200)throw Error("Navigation source route HTTP "+from?.status());
     const link=page.getByRole("link",{name:journey.link,exact:true});
     await link.waitFor({state:"visible"});
     await link.click();
     await page.waitForURL(url=>url.pathname===journey.target);
     await page.getByRole("heading",{name:journey.heading}).waitFor({state:"visible"});
     await page.getByRole("status").getByText(/No live authentication, customer grants, staff permissions/i).waitFor();
     await page.getByRole("region",{name:"Required access boundaries"}).waitFor();
     await page.getByRole("region",{name:"Server implementation checklist"}).waitFor();
     const flags=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>window.innerWidth+2,
      buttons:[...document.querySelectorAll("main button")].filter(b=>!b.disabled).map(b=>b.textContent?.trim())}));
     if(flags.overflow)throw Error("Horizontal overflow");
     if(flags.buttons.length)throw Error("Action unexpectedly enabled: "+flags.buttons.join(", "));
     const name=journey.target.replace(/\W+/g,"-").replace(/^-|-$/g,"");
     await page.screenshot({path:path.join(out,name+"-"+width+".png"),fullPage:true,animations:"disabled"});
     records.push({width,journey:journey.target,passed:true});
    }catch(e){
     errors.push({width,journey:journey.target,error:String(e?.message||e).slice(0,500)});
     records.push({width,journey:journey.target,passed:false});
    }
   }
   await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,"report.json"),JSON.stringify({sha:process.env.GITHUB_SHA||"local",records,errors},null,2));
 console.log("Z04_ACCESS_BROWSER",records.filter(x=>x.passed).length+"/"+records.length,JSON.stringify(errors));
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
