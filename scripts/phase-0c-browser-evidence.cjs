/* eslint-disable @typescript-eslint/no-require-imports -- isolated CommonJS Playwright runner */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const routes = ["/onboarding", "/login", "/signup", "/verify-email", "/business-info", "/set-currency", "/dashboard", "/dashboard/getting-started", "/dashboard/invoice", "/dashboard/invoice/create", "/dashboard/invoice/1", "/dashboard/invoice/1/edit"];
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
            await page.waitForURL(/\/dashboard\/invoice\/\d+$/);
            record.rowNavigate="PASS";
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
