/* eslint-disable @typescript-eslint/no-require-imports */
/** Z02 cross-page user-browser contract; no API calls, database writes, or deep-link jumps. */
const {chromium}=require("playwright");
const fs=require("node:fs"),path=require("node:path");
const origin=process.env.OCTALVE_BASE_URL||"http://127.0.0.1:3000",out=path.resolve("artifacts/z02-domain");
(async()=>{
 fs.mkdirSync(out,{recursive:true});const browser=await chromium.launch({headless:true});
 const reports=[];try{
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:width>=1024?900:780},deviceScaleFactor:1});
  let steps=0,errors=[];const check=async(fn,name)=>{await fn();steps++;console.log("Z02",width,name);};
  try{
   await check(async()=>{const r=await page.goto(origin+"/workspaces");if(r.status()!==200)throw Error("Entry not available");await page.getByRole("link",{name:/Merchant workspace/}).click();await page.waitForURL(u=>u.pathname==="/dashboard");},"Workspace → Merchant");
   const newInvoice=page.getByRole("region",{name:"Quick Create"}).getByRole("button",{name:/New Invoice/});
   await check(async()=>{await newInvoice.click();await page.getByRole("heading",{name:"Create invoice"}).waitFor();},"New invoice via Quick Create");
   await check(async()=>{
    await page.getByRole("button",{name:"Add New",exact:true}).click();
    const picker=page.getByRole("dialog",{name:/Select customer/i});await picker.waitFor();
    await picker.getByRole("textbox",{name:"Customer name"}).fill("Z02 Example Buyer");
    await picker.getByRole("textbox",{name:"Customer email"}).fill("z02@example.invalid");
    await picker.getByRole("textbox",{name:"Customer taxId"}).fill("EXAMPLE-UNVERIFIED");
    await picker.getByRole("button",{name:"Add and select customer"}).click();
    if(await page.getByRole("textbox",{name:"Customer email"}).inputValue()!=="z02@example.invalid")throw Error("Customer snapshot missing");
    if(await page.getByRole("textbox",{name:"Customer Tax ID"}).inputValue()!=="EXAMPLE-UNVERIFIED")throw Error("Tax ID snapshot missing");
   },"Shared customer form → invoice billing");
   const nav=page.getByRole("navigation",{name:"Invoice steps"});
   await check(async()=>{
    await nav.getByRole("link",{name:/Items/}).click();
    await page.locator('[data-invoice-step="items"]').waitFor({state:"visible"});
    await page.getByRole("button",{name:"Professional services",exact:true}).click();
    const picker=page.getByRole("dialog",{name:"Select product or service"});await picker.waitFor();
    await picker.getByRole("button",{name:/Add new product or service/}).click();
    await picker.getByRole("textbox",{name:"Item name"}).fill("Z02 Repeatable Service");
    await picker.getByRole("textbox",{name:"Item rate"}).fill("1250.25");
    await picker.getByRole("combobox",{name:"Item tax classification"}).selectOption("unclassified");
    await picker.getByRole("button",{name:"Add and select"}).click();
    if(await page.getByRole("textbox",{name:"Product or service 1"}).inputValue()!=="Z02 Repeatable Service")throw Error("Item catalogue snapshot missing");
   },"Shared product form → invoice line");
   await check(async()=>{
    await nav.getByRole("link",{name:/Totals/}).click();
    await page.locator('[data-invoice-step="charges"]').waitFor({state:"visible"});
    await page.getByRole("status").getByText(/Tax is not legally assessed/).waitFor();
    if(await page.getByRole("textbox",{name:"Tax percentage"}).count())throw Error("Unreviewed blanket VAT entry still present");
   },"Fail-closed line tax preview");
   await check(async()=>{
    await nav.getByRole("link",{name:/Payments/}).click();
    await page.locator('[data-invoice-step="workflow"]').waitFor({state:"visible"});
    let slider=page.getByRole("slider",{name:/First installment/});
    if(await slider.inputValue()!=="70")throw Error("70/30 new draft default lost");
    await nav.getByRole("link",{name:/Items/}).click();
    await page.locator('[data-invoice-step="items"]').waitFor({state:"visible"});
    await nav.getByRole("link",{name:/Payments/}).click();
    await page.locator('[data-invoice-step="workflow"]').waitFor({state:"visible"});
    slider=page.getByRole("slider",{name:/First installment/});
    if(await slider.inputValue()!=="70")throw Error("Draft installment state did not persist");
   },"Payment plan retained across invoice steps");
   await page.screenshot({path:path.join(out,width+"-invoice.png"),animations:"disabled"});
   if(width>=1024){
    await check(async()=>{
     await page.getByRole("navigation",{name:"Desktop main navigation"}).getByRole("link",{name:"Items",exact:true}).click();
     await page.getByText("Z02 Repeatable Service",{exact:true}).first().waitFor();
    },"Created item appears on canonical Items page");
    await check(async()=>{
     await page.getByRole("navigation",{name:"Desktop main navigation"}).getByRole("link",{name:"Quotation",exact:true}).click();
     await page.getByRole("button",{name:"Create Quotation"}).first().click();
     const modal=page.getByRole("dialog",{name:"Create Quotation"});
     // The existing quotation editor is itself a popup. Cross-page catalogue is the same provider.
     await modal.getByRole("combobox",{name:"Customer"}).selectOption({label:"Z02 Example Buyer"});
     await modal.getByRole("combobox",{name:"Choose quotation item"}).first().selectOption({label:"Z02 Repeatable Service"});
     await modal.getByText(/Requires Tax Centre review/).waitFor();
    },"Catalogue shared with quotation; no assumed VAT");
    await page.screenshot({path:path.join(out,"1440-quotation.png"),animations:"disabled"});
   }
  }catch(e){errors.push(String(e.message||e).slice(0,1200));}
  reports.push({width,steps,errors});await page.close();
 }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(out,"report.json"),JSON.stringify(reports,null,2));
 for(const row of reports)console.log("Z02_DOMAIN",JSON.stringify(row));
 if(reports.some(x=>x.errors.length))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});