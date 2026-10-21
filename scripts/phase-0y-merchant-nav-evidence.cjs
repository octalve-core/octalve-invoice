/* eslint-disable @typescript-eslint/no-require-imports */
/** Real browser UI only: one entry navigation, all other changes through clicks and typing.
 * Global page finder is route-only; invoice/expense/payment search is feature-local.
 */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000";
const output=path.resolve("artifacts/phase-0y-navigation");
(async()=>{
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({headless:true});
 const reports=[];
 try{
  for(const width of [390,1440]){
   const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
   const actions=[],errors=[];
   const desktop=width>=1024;
   const check=async(label,{expectedTitle,requiresHeading=desktop}={})=>{
    const route=new URL(page.url()).pathname;
    const measurement=await page.evaluate(()=>{
     const top=document.querySelector('header input[aria-label="Find a workspace page"]');
     const nav=top?.closest('header');
     const heading=document.querySelector('[data-merchant-page-heading]');
     const visible=!!heading&&getComputedStyle(heading).display!=="none";
     return {topNav:nav?{y:Math.round(nav.getBoundingClientRect().top),height:Math.round(nav.getBoundingClientRect().height)}:null,
      pageHeading:visible?{y:Math.round(heading.getBoundingClientRect().top),title:heading.querySelector('h1')?.textContent||""}:null,
      overflow:document.documentElement.scrollWidth>window.innerWidth+2};
    });
    actions.push({action:label,route,...measurement});
    if(desktop&&!measurement.topNav)errors.push({label,error:"Missing global merchant header"});
    if(requiresHeading&&!measurement.pageHeading)errors.push({label,error:"Missing common merchant heading"});
    if(expectedTitle&&measurement.pageHeading?.title!==expectedTitle)errors.push({label,error:"Expected title "+expectedTitle,found:measurement.pageHeading?.title});
    if(measurement.overflow)errors.push({label,error:"Document exceeds viewport width"});
   };
   try{
    const entry=await page.goto(origin+"/workspaces",{waitUntil:"domcontentloaded",timeout:30000});
    if(entry?.status()!==200)throw Error("Workspace entry HTTP "+entry?.status());
    await page.getByRole("link",{name:/Merchant workspace/}).click();
    await check("Entered merchant from workspace selection",{requiresHeading:desktop});
    if(desktop){
     const nav=page.getByRole("navigation",{name:"Desktop main navigation"});
     const sections=[["Quotation","Quotation"],["Expenses","Expenses"],["Invoice","Invoice"],["Receipt","Receipt"],["Payment Received","Payment Received"],["Credit note","Credit Note"],["Other Services","More"],["Settings","Me & Settings"],["Customer","Customers"],["Items","Items"]];
     for(const [link,title] of sections){
      await nav.getByRole("link",{name:link,exact:true}).click();
      await page.locator("[data-merchant-page-heading]").waitFor({state:"visible"});
      await check("Clicked "+link,{expectedTitle:title});
      if(["Quotation","Invoice","Expenses","Receipt"].includes(link)){
       await page.screenshot({path:path.join(output,width+"-"+link.toLowerCase()+".png"),fullPage:true,animations:"disabled"});
      }
     }
     await nav.getByRole("link",{name:"Expenses",exact:true}).click();
     const global=page.getByRole("searchbox",{name:"Find a workspace page"});
     const local=page.getByRole("searchbox",{name:"Search expenses"});
     const count=await page.getByRole("row",{name:/View /}).count();
     await global.fill("Invoice");
     await page.getByRole("navigation",{name:"Workspace search results"}).getByRole("link",{name:"Invoice"}).waitFor();
     if(await page.getByRole("row",{name:/View /}).count()!==count)throw Error("Global search incorrectly filtered Expense records");
     await local.fill("MTN");
     if(await global.inputValue()!=="Invoice")throw Error("Local search changed global page finder");
     if(await local.inputValue()!=="MTN")throw Error("Expense filter did not retain local value");
     await check("Global and local searches isolated");
     await page.getByRole("navigation",{name:"Workspace search results"}).getByRole("link",{name:"Invoice"}).click();
     await check("Navigated to Invoice from global search",{expectedTitle:"Invoice"});
    }else{
     const nav=page.getByRole("navigation",{name:"Primary mobile navigation"});
     for(const name of ["Invoices","Receipts","More","Me","Home"]){
      await nav.getByRole("link",{name,exact:true}).click();
      await check("Tapped mobile "+name,{requiresHeading:false});
     }
     await nav.getByRole("link",{name:"Invoices"}).click();
     await page.screenshot({path:path.join(output,width+"-invoice.png"),fullPage:true,animations:"disabled"});
    }
   }catch(e){errors.push({error:String(e?.message||e).slice(0,1100),route:page.url()});}
   reports.push({width,actions,errors});await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(output,"report.json"),JSON.stringify({sourceSha:process.env.GITHUB_SHA||"local",reports},null,2));
 for(const r of reports){console.log("MERCHANT_NAV",r.width,"actions",r.actions.length,"errors",r.errors.length);r.errors.forEach(e=>console.error(JSON.stringify(e)));}
 if(reports.some(r=>r.errors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
