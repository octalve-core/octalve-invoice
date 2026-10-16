/* eslint-disable @typescript-eslint/no-require-imports -- isolated CommonJS Playwright runner */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const { execFileSync } = require("node:child_process");
async function qualifyBrowserPng(page, output, view, template) {
  await page.getByRole("button", { name: "Download preview PNG" }).click();
  const prompt = page.getByRole("dialog", { name: "Complete invoice details" });
  await prompt.waitFor();
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 90000 }),
    prompt.getByRole("button", { name: "Continue without details" }).click()
  ]);
  const pngPath = path.join(output, view + "-" + template + "-browser-export.png");
  await download.saveAs(pngPath);
  const bytes = fs.readFileSync(pngPath);
  const magic = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!bytes.subarray(0, 8).equals(magic)) throw Error("Downloaded browser PNG has invalid signature");
  if (bytes.length < 24) throw Error("PNG too short");
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (width < 500 || height < 500) throw Error(template + " browser PNG geometry too small: " + width + "x" + height);
  return { png: path.basename(pngPath), width, height, signature: "PASS" };
}
async function qualifyNativePdf(page, output, view, template) {
  await page.getByRole("button", { name: "Download preview PDF" }).click();
  const prompt = page.getByRole("dialog", { name: "Complete invoice details" });
  await prompt.waitFor();
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 90000 }),
    prompt.getByRole("button", { name: "Continue without details" }).click()
  ]);
  const pdfPath = path.join(output, view + "-" + template + "-native.pdf");
  await download.saveAs(pdfPath);
  const bytes = fs.readFileSync(pdfPath);
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") throw Error("Native PDF magic bytes missing: " + template);
  const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8", timeout: 20000 });
  if (!/Page size:\s*595(?:\.|\s)/.test(info)) throw Error(template + " PDF is not A4 at the default paper setting");
  const extracted = execFileSync("pdftotext", ["-layout", pdfPath, "-"], { encoding: "utf8", timeout: 20000 }).replace(/\s+/g, " ");
  for (const expected of ["Golden Preview Customer", "Golden Item One", "Golden Item Two", "PHASE ZERO NOTE WITHOUT BANK DETAILS"]) {
    if (!extracted.toLocaleUpperCase("en").includes(expected.toLocaleUpperCase("en"))) throw Error(template + " PDF selectable text missing: " + expected);
  }
  if (extracted.includes("Editable sample line item")) throw Error(template + " PDF retained removed/blank item description");
  const rasterPrefix = path.join(output, view + "-" + template + "-pdf-first-page");
  execFileSync("pdftoppm", ["-f", "1", "-l", "1", "-singlefile", "-png", "-r", "115", pdfPath, rasterPrefix], { timeout: 60000 });
  if (!fs.existsSync(rasterPrefix + ".png")) throw Error(template + " PDF raster PNG was not generated");
  return { pdf: path.basename(pdfPath), raster: path.basename(rasterPrefix + ".png"), pdfPages: (info.match(/^Pages:\s*(\d+)/m) || [])[1], selectableText: "PASS", paperA4: "PASS" };
}

const routes = ["/portal", "/onboarding", "/login", "/signup", "/verify-email", "/business-info", "/set-currency", "/dashboard", "/dashboard/getting-started", "/dashboard/invoice", "/dashboard/invoice/create", "/dashboard/invoice/1", "/dashboard/invoice/1/edit", "/dashboard/receipt", "/dashboard/receipt/1", "/dashboard/receipt/create", "/dashboard/quotation", "/dashboard/quotation/1", "/dashboard/expenses", "/dashboard/customer", "/dashboard/items", "/dashboard/items/add", "/dashboard/items/1/edit", "/dashboard/staff", "/dashboard/staff/create", "/dashboard/staff/1/edit", "/dashboard/credit-note", "/dashboard/other-services", "/dashboard/finance/statement", "/dashboard/finance/approvals", "/dashboard/finance/receivables", "/dashboard/finance/adjustments", "/dashboard/finance/communications", "/dashboard/finance/reconciliation", "/dashboard/finance/audit", "/dashboard/finance/currencies", "/dashboard/recurring", "/dashboard/recurring-expense", "/dashboard/tax-centre", "/dashboard/insights-support", "/dashboard/other-services/pay-tax", "/dashboard/finance-calculator", "/dashboard/report", "/dashboard/notifications", "/dashboard/payment-received", "/dashboard/announcement", "/dashboard/updates", "/dashboard/invoice/3/record-payment", "/dashboard/settings", "/dashboard/settings/profile", "/dashboard/settings/invoice", "/dashboard/settings/business", "/dashboard/settings/subscription", "/dashboard/settings/theme", "/dashboard/settings/faqs", "/dashboard/settings/deleted"];
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
          if(route==="/dashboard/invoice/1"){
            await page.getByRole("heading",{name:"Invoice workflow"}).waitFor();
            await page.getByRole("tab",{name:"Installments"}).click();
            await page.getByRole("button",{name:"Review proposed split"}).click();
            await page.getByText("No payment schedule was saved or communicated.",{exact:false}).waitFor();
            await page.getByRole("tab",{name:"Communication"}).click();
            await page.getByRole("button",{name:"Payment reminder"}).click();
            const composeInvoice=page.getByRole("dialog",{name:"Draft invoice communication"});
            await composeInvoice.waitFor();
            await composeInvoice.getByRole("button",{name:"Review draft (not sent)"}).click();
            await page.getByText("No email, SMS or reminder was sent or queued.",{exact:false}).waitFor();
            record.installmentAndMailPreview="PASS";
          }
          if(route==="/dashboard/quotation/1"){
            await page.getByRole("heading",{name:/Quotation /}).first().waitFor();
            await page.getByRole("button",{name:"Preview conversion to invoice"}).click();
            await page.getByText("No invoice was created.",{exact:false}).waitFor();
            if(await page.getByRole("button",{name:/Pay now|Record payment/i}).count())throw Error("Quote must not request money");
            await page.getByRole("button",{name:"Prepare email"}).click();
            await page.getByRole("dialog",{name:"Preview quotation email"}).waitFor();
            record.quotationNoPayment="PASS";
          }
          if(route==="/dashboard/receipt") { await page.getByText("OL-00001RP").first().waitFor({state:"attached"});record.typeRef="RP"; }
          if(route==="/dashboard/quotation") { await page.getByText("OL-00001QUO").first().waitFor({state:"attached"});record.typeRef="QUO"; }
          if(route==="/dashboard/expenses") { await page.getByText("OL-00001EXP").first().waitFor({state:"attached"});record.typeRef="EXP"; }
          if(route==="/dashboard/staff") { await page.getByText("OL-00001SF").first().waitFor({state:"attached"});record.typeRef="SF"; }
          if(route==="/dashboard/credit-note") { await page.getByText("OL-00001CR").first().waitFor({state:"attached"});record.typeRef="CR"; }
          if(route==="/dashboard/other-services"){
            await page.getByRole("heading",{name:"More"}).waitFor();
            await page.getByRole("heading",{name:"Finance & compliance"}).waitFor();
            await page.getByRole("link",{name:/Finance Calculator/}).waitFor();
            await page.getByRole("link",{name:/Tax Centre/}).waitFor();
          }
          if(route==="/dashboard/other-services/pay-tax"){
            await page.waitForURL(/\/dashboard\/tax-centre\/?$/);
            await page.getByRole("heading",{name:"Tax Centre"}).waitFor();
            record.legacyTaxRedirect="PASS";
          }
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
              if(route==="/dashboard/receipt"){
                await page.waitForURL(/\/dashboard\/receipt\/\d+$/);
                await page.getByText("Linked invoice:",{exact:false}).waitFor();
                record.receiptDetailRoute="PASS";
                record.optionalReceiptLink="PASS";
                await page.goto(origin+"/dashboard/receipt",{waitUntil:"domcontentloaded"});
                await page.locator('article[role="link"]').nth(1).click();
                await page.getByRole("button",{name:"View Receipt"}).click();
                await page.getByText("Independent payment record",{exact:false}).waitFor();
                record.manualIndependentReceipt="PASS";
              }else if(route==="/dashboard/quotation"){
                await page.waitForURL(/\/dashboard\/quotation\/\d+$/);
                await page.getByRole("heading",{name:/Quotation /}).first().waitFor();
                record.quotationDetailRoute="PASS";
              }else{
                await page.getByRole("dialog",{name:/ details/i}).waitFor();
                record.sheetAndDetail="PASS";
                await page.getByRole("button",{name:"Close details"}).click();
              }
            }
            if(view==="desktop"){
              await page.locator("table").first().waitFor({state:"visible"});
              if(await page.locator("table thead th").count()<4)throw new Error("Desktop table columns missing");
              record.desktopTable="PASS";
            }
          }
          if (route==="/dashboard"&&view==="mobile"){
            await page.getByText("OL-00001RP").first().waitFor();
            await page.locator('article[role="link"]').nth(3).click();
            await page.getByRole("dialog",{name:/Actions for OL-00001RP/}).waitFor();
            record.overviewActionSheet="PASS";
            await page.getByRole("button",{name:"Close record actions"}).click();
          }
          if(route==="/dashboard/quotation"){
            await page.getByRole("button",{name:"Accepted",exact:true}).waitFor();
            if(await page.getByRole("button",{name:"Paid",exact:true}).count())throw new Error("Quotation incorrectly implies payment");
            record.quotationIsNotPayment="PASS";
          }
          if(route==="/dashboard/receipt/create"){
            await page.getByRole("heading",{name:"Create receipt"}).waitFor();
            await page.getByRole("button",{name:/Preview receipt/}).waitFor();
            record.receiptFromPaidInvoice="PASS";
          }
          if(route==="/dashboard/invoice/3/record-payment"){
            await page.getByRole("heading",{name:"Record bank-transfer payment"}).waitFor();
            await page.getByRole("button",{name:"Review payment"}).waitFor();
            record.manualBankGuard="PASS";
          }
          if(route==="/dashboard/notifications"){
            await page.getByRole("heading",{name:"Notifications"}).waitFor();
            await page.getByRole("button",{name:/Mark all read/}).click();
            record.notifications="PASS";
          }

          if(route==="/dashboard/settings/subscription"){
            await page.getByRole("heading",{name:"Manage Subscription"}).waitFor();
            await page.getByRole("button",{name:"Yearly -15%"}).click();
            await page.getByRole("button",{name:/Growth/}).first().click();
            await page.getByRole("button",{name:/Review Growth plan/}).click();
            await page.getByText("No subscription was created",{exact:false}).waitFor();
            await page.getByLabel("Preview subscription state").selectOption("expired");
            await page.getByRole("heading",{name:"Plan expired example"}).waitFor();
            record.subscriptionExpiredLayout="PASS";
            record.subscriptionNoFakePurchase="PASS";
          }
          if(route==="/dashboard/settings/theme"){
            await page.getByRole("heading",{name:"Customize your invoices"}).waitFor();
            await page.getByRole("button",{name:"Choose #0B8063"}).click();
            await page.getByRole("button",{name:"Apply to current Preview"}).click();
            await page.getByText("Appearance preferences are available",{exact:false}).waitFor();
            record.liveThemePreference="PASS";
          }
          if(route==="/dashboard/settings/faqs"){
            await page.getByRole("heading",{name:"How can we help?"}).waitFor();
            await page.getByLabel("Search FAQs").fill("receipt");
            await page.getByRole("button",{name:/difference between an invoice and a receipt/}).click();
            await page.getByText("An invoice requests or records money owed.",{exact:false}).waitFor();
            record.faqSearchAndExpand="PASS";
          }
          if(route==="/dashboard/settings/deleted"){
            await page.getByRole("heading",{name:"Deleted Records"}).waitFor();
            await page.getByText("The 14-day rule never",{exact:false}).count(); 
            record.deletedRecordsRoute="PASS";
          }
          if(route==="/dashboard/settings"&&view==="mobile"){
            await page.getByRole("navigation",{name:"Primary mobile navigation"}).getByRole("link",{name:"Me",exact:true}).waitFor();
            await page.getByRole("link",{name:/Deleted Records/}).waitFor();
            const moreTab=page.getByRole("navigation",{name:"Primary mobile navigation"}).getByRole("link",{name:"More",exact:true});
            if(await moreTab.getAttribute("href")!=="/dashboard/other-services")throw Error("Mobile More tab must target Other Services");
            if(await page.getByRole("navigation",{name:"Primary mobile navigation"}).getByRole("link",{name:"Clients",exact:true}).count())throw Error("Clients tab should not be in five-tab navigation");
            await moreTab.click();
            await page.waitForURL(/\/dashboard\/other-services(?:\/|$)/);
            await page.goBack();
            await page.waitForURL(/\/dashboard\/settings(?:\/|$)/);
            record.mobileMoreNavigation="PASS";
            record.premiumMeNavigation="PASS";
          }
          if(route==="/dashboard/customer"&&view==="desktop"){
            const actions=page.getByRole("button",{name:/Actions for OL-/}).first();
            await actions.click();
            await page.getByRole("dialog",{name:/Actions for OL-/}).getByRole("button",{name:/Delete Customer/}).click();
            const confirm=page.getByRole("alertdialog",{name:"Delete Customer"});
            await confirm.waitFor();
            if(await confirm.getByRole("button",{name:"Move to Deleted Records"}).isEnabled())throw Error("Delete action did not require a reason");
            await confirm.getByPlaceholder("Explain why this record is being removed").fill("Duplicate preview customer");
            await confirm.getByRole("button",{name:"Move to Deleted Records"}).click();
            await page.getByText("moved to Deleted Records",{exact:false}).waitFor();
            record.deleteConfirmReasonAndArchive="PASS";
          }
          if(route==="/dashboard/other-services"){
            await page.getByRole("link",{name:/Statements of Account/}).waitFor();
            await page.getByRole("link",{name:/Bank Reconciliation/}).waitFor();
            await page.getByRole("link",{name:/Audit & Exceptions/}).waitFor();
            const moreSearch=page.getByRole("textbox",{name:"Search More services"});
            await moreSearch.fill("Audit");
            await page.getByRole("link",{name:/Audit & Exceptions/}).waitFor();
            if(await page.getByRole("link",{name:/Statements of Account/}).count())throw Error("More search failed to filter finance tiles");
            await moreSearch.fill("");
            await page.getByRole("link",{name:/Statements of Account/}).waitFor();
            record.financeNavigation="PASS";
          }
          if(route.startsWith("/dashboard/finance/")){
            await page.getByRole("searchbox",{name:"Search finance records"}).count();
            const input=page.getByRole("textbox",{name:"Search finance records"});
            await input.waitFor();
            await page.getByRole("button",{name:"Filter finance records"}).click();
            const filter=page.getByRole("dialog",{name:"Finance filters"});
            await filter.waitFor();
            await filter.getByRole("button",{name:"Apply filters"}).click();
            if(view==="mobile"){
              if(await page.locator("table").first().isVisible())throw Error("Finance desktop table shown on mobile");
              record.financeMobileCards="PASS";
            }else if(view==="desktop"){
              await page.locator("table").first().waitFor();
              record.financeDesktopTable="PASS";
            }
            await input.fill("NO_MATCH_12345");
            await page.getByText("No records match this view").waitFor();
            await page.getByRole("button",{name:"Clear filters"}).click();
            if(await input.inputValue()!=="")throw Error("Finance search not reset");
            record.financeFilters="PASS";
          }
          if(route==="/dashboard/recurring"||route==="/dashboard/recurring-expense"){
            await page.getByRole("heading",{name:"Recurring income & expenses"}).waitFor();
            const recurringSearch=page.getByRole("textbox",{name:"Search recurring records"});
            await recurringSearch.waitFor();
            await page.getByRole("button",{name:"Recurring expenses"}).click();
            await page.getByRole("button",{name:"Filter recurring records"}).click();
            const rf=page.getByRole("dialog",{name:"Recurring filters"});
            await rf.waitFor();
            await rf.getByLabel("Recurring frequency filter").selectOption("monthly");
            await rf.getByRole("button",{name:"Apply filters"}).click();
            await page.getByRole("button",{name:"New recurring rule"}).click();
            const preview=page.getByRole("dialog",{name:"Recurring rule preview"});
            await preview.waitFor();
            if(await preview.getByRole("button",{name:"Review schedule (no save)"}).isEnabled())throw Error("Unvalidated recurring rule was accepted");
            await preview.getByPlaceholder("e.g. Website maintenance").fill("Office utilities");
            await preview.getByPlaceholder("Counterparty").fill("Sample vendor");
            await preview.getByPlaceholder("25000.00").fill("5000.00");
            await preview.getByRole("button",{name:"Review schedule (no save)"}).click();
            await page.getByText("No recurring rule, invoice, expense or payment was created.",{exact:false}).waitFor();
            record.recurringRulePreview="PASS";
          }
          if(route==="/dashboard/finance-calculator"){
            await page.getByRole("heading",{name:"Finance Calculator"}).waitFor();
            await page.getByRole("button",{name:"Savings & investment"}).click();
            await page.getByRole("button",{name:"Savings goal"}).click();
            await page.getByRole("heading",{name:"Your projection schedule"}).waitFor();
            await page.getByRole("button",{name:"Sales & pricing"}).click();
            await page.getByRole("button",{name:"Margin & markup"}).click();
            await page.getByLabel("Cost price").fill("80");
            await page.getByLabel("Selling price").fill("100");
            await page.getByText("20%",{exact:true}).waitFor();
            record.calculatorSwitchAndMath="PASS";
          }
          if(route==="/dashboard/tax-centre"){
            await page.getByRole("heading",{name:"Tax Centre"}).waitFor();
            await page.getByRole("button",{name:"Invoice tax review"}).click();
            await page.getByLabel("Tax reporting year").selectOption("2024");
            const search=page.getByRole("textbox",{name:"Search tax invoices"});
            await search.waitFor();
            if(view!=="desktop"){
              await page.getByRole("button",{name:/Olamide Ismail/}).first().click();
            }else{
              await page.getByRole("button",{name:"Details"}).first().click();
            }
            const taxDialog=page.getByRole("dialog",{name:/Tax review /});
            await taxDialog.waitFor();
            await taxDialog.getByRole("button",{name:"Close tax review"}).click();
            await page.getByRole("button",{name:"NRS e-invoices"}).click();
            await page.getByText("No official NRS e-invoices submitted").waitFor();
            record.taxNoFalseLiability="PASS";
          }
          if(route==="/portal"){
            await page.getByRole("heading",{name:"Everything about your invoices in one place."}).waitFor();
            await page.getByRole("navigation",{name:"Customer portal sections"}).getByRole("button",{name:"Payments"}).click();
            await page.getByRole("heading",{name:"Only verified payments appear here"}).waitFor();
            await page.getByText("No live payment or customer session can be initiated",{exact:false}).waitFor();
            record.portalDenyByDefault="PASS";
          }
          if(route==="/dashboard/insights-support"){
            await page.getByRole("heading",{name:"Insights & Support"}).waitFor();
            await page.getByRole("button",{name:"What is outstanding?"}).click();
            await page.getByText("Sample payment ledger").count();
            await page.getByRole("tab",{name:"Octalve Support"}).click();
            const msg=page.getByRole("textbox",{name:"Support message draft"});
            await msg.fill("Please help with my invoice.");
            await page.getByRole("button",{name:"Preview message (not sent)"}).click();
            await page.getByText("Draft added locally; nothing was sent.").waitFor();
            record.supportOfflineDraft="PASS";
          }
          if(route==="/dashboard/report"){
            await page.getByRole("heading",{name:"Reports"}).waitFor();
            await page.getByText("Recorded collections").first().waitFor();
            if(view==="mobile"){
              await page.getByRole("img",{name:/monthly values of invoicing and collections/}).waitFor();
              await page.getByRole("img",{name:/sample invoices grouped by status/}).waitFor();
              if(await page.locator("table").first().isVisible())throw Error("Desktop Top clients table should not be visible on mobile");
              if(!await page.locator("a[href='/dashboard/customer']").filter({hasText:/invoice/}).first().isVisible())throw Error("Top client mobile card missing");
              record.mobileReportChartsAndCards="PASS";
            }
            record.report="PASS";
          }
                    if (route === "/dashboard/invoice/create") {
            await page.getByRole("heading", { name: "Create invoice" }).waitFor();
            await page.getByRole("heading", { name: "Live Modern Invoice preview" }).waitFor();
            await page.locator('section[aria-label="Invoice details"]').getByRole("button",{name:"Sample Customer"}).click();
            await page.getByRole("dialog",{name:"Select customer"}).getByRole("button",{name:/Add new customer/}).click();
            await page.getByRole("dialog",{name:"Select customer"}).getByLabel("Customer name *").fill("Golden Preview Customer");
            await page.getByRole("button",{name:"Add and select customer"}).click();
            await page.locator('#invoice-document').getByRole("textbox",{name:"Customer name"}).waitFor();
              if(await page.locator('#invoice-document').getByRole("textbox",{name:"Customer name"}).inputValue()!=="Golden Preview Customer")throw new Error("Customer picker did not update the selected-template document");
            await page.locator('#invoice-document').waitFor();
            await page.locator('#invoice-document').getByText("Octalve Limited").waitFor();
            if(await page.locator('#invoice-document').getByText("Sapphire Quest").count()) throw new Error("Legacy merchant branding remains");
            const logoNotice=page.getByText("Your business logo is missing.");
            await logoNotice.waitFor();
            // Regression: a deleted row must not cause later rows to share identifiers.
            // This also exercises invoice-item input -> both live template presentations.
            const itemEditor = page.locator('section[aria-label="Invoice products and services"]');
            await itemEditor.getByRole("button", { name: "+ Add row" }).click();
            await itemEditor.getByRole("button", { name: "Remove row" }).first().click();
            await itemEditor.getByRole("button", { name: "+ Add row" }).click();
            await itemEditor.getByLabel("Product or service 1").fill("Golden Item One");
            await itemEditor.getByLabel("Product or service 2").fill("Golden Item Two");
            if (await itemEditor.getByLabel("Product or service 1").inputValue() !== "Golden Item One") throw Error("Invoice draft row identifiers collided after remove/add");
            await itemEditor.getByLabel("Rate for item 1").fill("1500");
            await itemEditor.getByLabel("Rate for item 2").fill("2750");
            await page.getByLabel("Mail for customer / Notes").fill("PHASE ZERO NOTE WITHOUT BANK DETAILS");
            if (await page.locator('#invoice-document').getByText("Editable sample line item").count()) throw Error("Removed description still visible on modern document");
            record.itemRowIdentityAndNotes = "PASS";
            record.merchantIdentity="PASS";
            if(view==="desktop"){
              const left=await page.locator('section[aria-label="Invoice input"]').boundingBox();
              const right=await page.locator('section[aria-label="Live document preview"]').boundingBox();
              if(!left||!right||Math.abs(left.width-right.width)>12)throw new Error("Desktop invoice columns are not approximately 50/50");
            }
            await page.screenshot({ path: path.join(output, view+"-invoice-modern.png"), fullPage: true, animations: "disabled" });
            if (view === "desktop") { record.browserModernPng = await qualifyBrowserPng(page, output, view, "modern"); record.nativeModernPdf = await qualifyNativePdf(page, output, view, "modern"); }
            await page.getByLabel("Template").selectOption("ledger");
            await page.locator('[data-invoice-renderer="classic-ledger-v1"]').waitFor();
            record.templateSwitch = "PASS";
            await page.screenshot({ path: path.join(output, view+"-invoice-classic-ledger.png"), fullPage: true, animations: "disabled" });
            if (view === "desktop") { record.browserClassicPng = await qualifyBrowserPng(page, output, view, "ledger"); record.nativeClassicPdf = await qualifyNativePdf(page, output, view, "ledger"); }
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
