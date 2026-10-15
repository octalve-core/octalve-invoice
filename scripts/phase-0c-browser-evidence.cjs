/* eslint-disable @typescript-eslint/no-require-imports -- isolated CommonJS Playwright runner */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const routes = ["/onboarding", "/login", "/signup", "/verify-email", "/business-info", "/set-currency", "/dashboard", "/dashboard/getting-started", "/dashboard/invoice", "/dashboard/invoice/create", "/dashboard/invoice/1", "/dashboard/invoice/1/edit", "/dashboard/receipt", "/dashboard/quotation", "/dashboard/expenses", "/dashboard/customer", "/dashboard/items", "/dashboard/staff", "/dashboard/credit-note", "/dashboard/other-services", "/dashboard/other-services/pay-tax", "/dashboard/settings", "/dashboard/settings/profile", "/dashboard/settings/invoice", "/dashboard/settings/business"];
const viewports = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 390, height: 844 },
};
const origin = process.env.OCTALVE_BASE_URL || "http://127.0.0.1:3000";
(async function main() {
  const output = path.resolve("artifacts/phase-0c");
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const records = [];
  let failures = 0;
  try {
    for (const [view, viewport] of Object.entries(viewports)) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      for (const route of routes) {
        const name = route.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "home";
        const record = { viewport: view, route, status: "UNKNOWN", screenshot: view + "-" + name + ".png" };
        try {
          const response = await page.goto(origin + route, { waitUntil: "domcontentloaded", timeout: 16000 });
          record.statusCode = response?.status();
          await page.waitForTimeout(350);
          if (viewport.width < 768) { const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2); if (overflow) throw new Error("Unexpected page-level horizontal overflow"); }
          if (record.statusCode !== 200) throw new Error("Non-200 status: " + record.statusCode);
          if (route === "/dashboard" && view === "mobile") {
            const chart = page.getByRole("img",{name:/Monthly receivables comparison/});
            await chart.waitFor({state:"visible"});
            if(await chart.locator("span[title]").count()!==36)throw new Error("Mobile chart does not render 12 months × 3 bars");
            record.mobileChart = "PASS";
          }
          if (route === "/dashboard/invoice" && view === "mobile") {
            await page.locator('article[role="link"]').first().waitFor();
            const width=await page.locator('article[role="link"]').first().evaluate(el=>el.getBoundingClientRect().width);
            if(width > viewport.width+1)throw new Error("Invoice mobile card exceeds viewport");
            record.mobileCard="PASS";
          }
          if(route==="/dashboard/receipt") { await page.getByText("OL-00001RP").first().waitFor({state:"attached"});record.typeRef="RP"; }
          if(route==="/dashboard/quotation") { await page.getByText("OL-00001QUO").first().waitFor({state:"attached"});record.typeRef="QUO"; }
          if(route==="/dashboard/expenses") { await page.getByText("OL-00001EXP").first().waitFor({state:"attached"});record.typeRef="EXP"; }
          if(route==="/dashboard/staff") { await page.getByText("OL-00001SF").first().waitFor({state:"attached"});record.typeRef="SF"; }
          if(route==="/dashboard/credit-note") { await page.getByText("OL-00001CR").first().waitFor({state:"attached"});record.typeRef="CR"; }
          if(route==="/dashboard/other-services"){
             await page.getByRole("heading",{name:"More"}).waitFor();
             if(await page.locator('a[href="/dashboard/other-services/pay-tax"]').count()!==1)throw Error("Pay Tax coming soon missing");
             if(view==="desktop"){
               const cols=await page.locator('section[aria-label="Other services"] > div').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(" ").length);
               if(cols!==4)throw Error("Other Services desktop must be 4 columns; got "+cols);
             }
          }
          if(route==="/dashboard/other-services/pay-tax"){await page.getByText("Coming soon to Octalve Invoice.").waitFor();await page.getByRole("link",{name:/Back to Overview/}).waitFor();}
          if(route==="/dashboard"&&view==="mobile"){
            await page.getByRole("link",{name:"Open profile settings"}).getByText("Preview User").waitFor();
          }
          if(["/dashboard/receipt","/dashboard/quotation","/dashboard/expenses","/dashboard/customer","/dashboard/items","/dashboard/staff","/dashboard/credit-note"].includes(route)){
            if(view==="mobile"){
              const card=page.locator('article[role="link"]').first();
              await card.waitFor({state:"visible"});
              await card.click({position:{x:Math.min(90,viewport.width/4),y:25}});
              await page.getByRole("dialog",{name:/Actions for OL-/}).waitFor();
              const sheet=page.getByRole("dialog",{name:/Actions for OL-/});
              const dangerous=sheet.getByRole("button",{name:/Delete /});
              await dangerous.waitFor({state:"visible"});
              if(!(await dangerous.getAttribute("class")).includes("text-red"))throw new Error("Delete action has no danger color");
              await sheet.getByRole("button",{name:/View /}).first().click();
              await page.getByRole("dialog",{name:/ details/i}).waitFor();
              record.sheetAndDetail="PASS";
              await page.getByRole("button",{name:"Close details"}).click();
            }
            if(view==="desktop"){
              await page.locator("table").first().waitFor({state:"visible"});
              if(await page.locator("table thead th").count()<4)throw new Error("Desktop table columns missing");
              record.desktopTable="PASS";
            }
          }
          if (route==="/dashboard"&&view==="mobile"){
            const receipts=page.getByRole("button",{name:"Receipts",exact:true});
            await receipts.click();
            await page.getByText("OL-00001RP").first().waitFor();
            await page.locator('article[role="link"]').first().click();
            await page.getByRole("dialog",{name:/Actions for OL-00001RP/}).waitFor();
            record.overviewActionSheet="PASS";
            await page.getByRole("button",{name:"Close record actions"}).click();
            await page.getByRole("button",{name:"All",exact:true}).last().click();
          }
          if (route === "/dashboard/invoice/create") {
            await page.getByRole("heading", { name: "Create invoice" }).waitFor();
            await page.getByRole("heading", { name: "Live Modern Invoice preview" }).waitFor();
            const customer = page.locator('section[aria-label="Invoice input"]').getByLabel("Customer name");
            await customer.fill("Golden Preview Customer");
            await page.locator('#invoice-document').waitFor();
            await page.locator('#invoice-document').getByText("Octalve Limited").waitFor();
            if(await page.locator('#invoice-document').getByText("Sapphire Quest").count()) throw new Error("Legacy merchant branding remains");
            const logoNotice=page.getByText("Your business logo is missing.");
            await logoNotice.waitFor();
            record.merchantIdentity="PASS";
            if(view==="desktop"){
              const left=await page.locator('section[aria-label="Invoice input"]').boundingBox();
              const right=await page.locator('section[aria-label="Live document preview"]').boundingBox();
              if(!left||!right||Math.abs(left.width-right.width)>12)throw new Error("Desktop invoice columns are not approximately 50/50");
            }
            await page.screenshot({ path: path.join(output, view+"-invoice-modern.png"), fullPage: true, animations: "disabled" });
            await page.getByLabel("Template").selectOption("ledger");
            await page.locator('[data-invoice-renderer="classic-ledger-v1"]').waitFor();
            record.templateSwitch = "PASS";
            await page.screenshot({ path: path.join(output, view+"-invoice-classic-ledger.png"), fullPage: true, animations: "disabled" });
          }
          await page.screenshot({ path: path.join(output, record.screenshot), fullPage: true, animations: "disabled" });
          if(route==="/dashboard/invoice" && view==="mobile"){
            await page.locator('article[role="link"]').first().click({position:{x:150,y:25}});
            await page.getByRole("dialog",{name:/Actions for OL-00001INV/}).waitFor();
            record.rowBottomSheet="PASS";
            await page.getByRole("button",{name:"View Invoice"}).click();
            await page.waitForURL(/\/dashboard\/invoice\/\d+$/);
            record.viewAfterSelection="PASS";
          }
          if(route==="/dashboard/settings"&&view==="desktop"){
            await page.getByRole("button",{name:"Log out",exact:true}).first().click();
            await page.getByRole("dialog",{name:"Leave preview"}).waitFor();
            await page.getByRole("button",{name:"Log out of Preview"}).click();
            await page.waitForURL(/\/login\?preview=exited/);
            record.previewLogout="PASS";
          }
          if(route==="/dashboard/settings/profile"&&view==="desktop"){
            const name=page.locator(".largeScreen").getByLabel("Full Name");
            await name.fill("Aisha Bello");
            await page.getByRole("button",{name:"Account menu"}).getByText("Aisha Bello").waitFor();
            record.inSessionUserName="PASS";
          }
          record.status = "PASS";
        } catch (error) {
          record.status = "FAIL";
          record.error = String(error?.message || error).slice(0, 1000);
          failures++;
        }
        records.push(record);
      }
      await page.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(output, "report.json"), JSON.stringify({ commit: process.env.GITHUB_SHA || "local", testedAt: new Date().toISOString(), records }, null, 2));
  console.log("Phase 0D browser checks:", records.length - failures, "/", records.length, "passed; screenshots in", output);
  for (const entry of records.filter(x=>x.status==="FAIL")) console.error("SCREENSHOT FAIL",entry.viewport,entry.route,entry.error);
  if (failures) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
