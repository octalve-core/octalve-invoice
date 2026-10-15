const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const routes = ["/onboarding", "/login", "/signup", "/verify-email", "/business-info", "/set-currency", "/dashboard", "/dashboard/getting-started", "/dashboard/invoice", "/dashboard/invoice/create"];
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
          if (record.statusCode !== 200) throw new Error("Non-200 status: " + record.statusCode);
          if (route === "/dashboard/invoice/create") {
            await page.getByRole("heading", { name: "Create invoice" }).waitFor();
            await page.getByRole("heading", { name: "Live Modern Invoice preview" }).waitFor();
            const customer = page.getByLabel("Customer name");
            await customer.fill("Golden Preview Customer");
            await page.getByText("Golden Preview Customer").first().waitFor();
            await page.getByLabel("Template").selectOption("ledger");
            await page.locator('[data-invoice-renderer="classic-ledger-v1"]').waitFor();
            record.templateSwitch = "PASS";
          }
          await page.screenshot({ path: path.join(output, record.screenshot), fullPage: true, animations: "disabled" });
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
  console.log("Phase 0C browser checks:", records.length - failures, "/", records.length, "passed; screenshots in", output);
  if (failures) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
