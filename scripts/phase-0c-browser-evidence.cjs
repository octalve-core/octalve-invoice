/* eslint-disable @typescript-eslint/no-require-imports -- isolated CommonJS Playwright runner */
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
async function qualifyBrowserPng(page) {
  const preview = page.locator('section[aria-label="Live document preview"]');
  await preview.getByTestId("draft-preview-watermark").waitFor();
  if(await preview.getByRole("button",{name:/Download preview PNG/}).count())throw Error("Unissued invoice exposed PNG download");
  if(!await preview.getByText("Download available after issue").isVisible())throw Error("Missing draft export lock explanation");
  return { draftExportBlocked:"PASS",watermark:"PASS" };
}
async function qualifyNativePdf(page) {
  const preview = page.locator('section[aria-label="Live document preview"]');
  await preview.getByTestId("draft-preview-watermark").waitFor();
  if(await preview.getByRole("button",{name:/Download preview PDF/}).count())throw Error("Unissued invoice exposed PDF download");
  if(await page.getByRole("dialog",{name:"Complete invoice details"}).count())throw Error("Draft PDF download dialog remains available");
  return { draftExportBlocked:"PASS",watermark:"PASS" };
}

const routes = ["/portal", "/onboarding", "/login", "/signup", "/forgot-password", "/check-email", "/enter-otp", "/set-new-password", "/password-success", "/email-verified", "/verify-email", "/business-info", "/set-currency", "/dashboard", "/dashboard/getting-started", "/dashboard/invoice", "/dashboard/invoice/create", "/dashboard/invoice/create/details", "/dashboard/invoice/create/items", "/dashboard/invoice/create/charges", "/dashboard/invoice/create/workflow", "/dashboard/invoice/create/preview", "/dashboard/invoice/1", "/dashboard/invoice/1/edit", "/dashboard/invoice/1/edit/details", "/dashboard/invoice/1/edit/items", "/dashboard/invoice/1/edit/charges", "/dashboard/invoice/1/edit/workflow", "/dashboard/invoice/1/edit/preview", "/dashboard/receipt", "/dashboard/receipt/1", "/dashboard/receipt/create", "/dashboard/quotation", "/dashboard/quotation/1", "/dashboard/expenses", "/dashboard/customer", "/dashboard/items", "/dashboard/items/add", "/dashboard/items/1/edit", "/dashboard/staff", "/dashboard/staff/create", "/dashboard/staff/1/edit", "/dashboard/credit-note", "/dashboard/other-services", "/dashboard/finance/statement", "/dashboard/finance/approvals", "/dashboard/finance/receivables", "/dashboard/finance/adjustments", "/dashboard/finance/communications", "/dashboard/finance/reconciliation", "/dashboard/finance/audit", "/dashboard/finance/currencies", "/dashboard/recurring", "/dashboard/recurring-expense", "/dashboard/tax-centre", "/dashboard/taxes", "/dashboard/insights-support", "/dashboard/other-services/pay-tax", "/dashboard/finance-calculator", "/dashboard/report", "/dashboard/notifications", "/dashboard/payment-received", "/dashboard/announcement", "/dashboard/updates", "/dashboard/invoice/3/record-payment", "/dashboard/settings", "/dashboard/settings/profile", "/dashboard/settings/invoice", "/dashboard/settings/business", "/dashboard/settings/subscription", "/dashboard/settings/theme", "/dashboard/settings/faqs", "/dashboard/settings/deleted"];
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
          // Audit actual rendered copy; Preview language must remain truthful until an operation is live.
          const visibleText=await page.locator("body").innerText();
          const disallowed=visibleText.match(/\b(?:sandbox|development)\b/i);
          if(disallowed)throw Error("Customer-facing technical label exposed: "+disallowed[0]+" on "+route);
          record.customerFacingLanguage="PASS";
          if(route==="/login"||route==="/signup"){
            const count=await page.locator("form").count();
            if(count!==1)throw Error("Authentication must have exactly one form, got "+count);
            await page.getByRole("textbox",{name:"Email address"}).fill("review@example.com");
            await page.locator("#octalve-password").fill("LongRandomPassword123!");
            if(route==="/signup"){
              await page.getByRole("textbox",{name:"First name"}).fill("Example");
              await page.getByRole("textbox",{name:"Last name"}).fill("Merchant");
              await page.getByRole("textbox",{name:"Phone number"}).fill("08012345678");
            }
            await page.locator('form button[type="submit"]').click();
            await page.getByText("Account access will be available after secure sign-in is connected.").waitFor();
            if(new URL(page.url()).pathname!==route)throw Error("Unverified auth navigated to a session");
            record.authSingleFormNoFakeLogin="PASS";
          }
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
            if(await page.getByRole("heading",{name:"Invoice workflow"}).count())throw Error("Issued invoice must not expose draft installment planner");
            await page.getByRole("heading",{name:/Invoice OL-00001INV/}).waitFor();
            record.issuedInvoiceReadOnlyPlan="PASS";
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
          if(route==="/dashboard/other-services"){
            const services=page.getByRole("region",{name:"Other services"});
            await services.getByRole("link",{name:/Staff/}).waitFor();
            await services.getByRole("link",{name:/Report/}).waitFor();
            record.staffReportInMore="PASS";
          }
          if(route==="/dashboard"&&view==="desktop"){
            const side=page.getByRole("complementary",{name:"Desktop workspace sidebar"});
            if(await side.getByRole("link",{name:"Staff",exact:true}).count()||await side.getByRole("link",{name:"Report",exact:true}).count())throw Error("Duplicate Staff/Report menu links remain on desktop sidebar");
            if(!await page.getByRole("region",{name:"Business overview summary"}).getByText("vs last month").count())throw Error("Unified finance trend comparison missing");
            record.unifiedDesktopOverview="PASS";
          }
          if(route==="/dashboard"&&view==="mobile"){
            const summary=page.getByRole("region",{name:"Business overview summary"});
            if(await summary.locator("article").count()!==4)throw Error("Mobile overview should have four common finance cards");
            await summary.getByRole("button",{name:"About Example figures"}).click();
            await page.getByRole("dialog",{name:"Example figures"}).waitFor();
            await page.getByRole("button",{name:"Got it"}).click();
            record.unifiedMobileOverview="PASS";
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
          if(route==="/dashboard/quotation"&&view!=="mobile"){
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

          if(route==="/dashboard"&&view==="desktop"){
            const sidebar=page.getByRole("complementary",{name:"Desktop workspace sidebar"});
            await sidebar.getByRole("navigation",{name:"Desktop main navigation"}).getByRole("link",{name:"Overview"}).waitFor();
            if(await sidebar.getByRole("navigation",{name:"Desktop main navigation"}).getByRole("link",{name:"Overview"}).getAttribute("aria-current")!=="page")throw Error("Overview not marked as active sidebar route");
            const subs=sidebar.getByRole("link",{name:/Subscription/});
            await subs.waitFor();
            if((await subs.getAttribute("href"))!=="/dashboard/settings/subscription")throw Error("Subscription footer is not linked");
            const layout=await page.evaluate(()=>{
              const sidebar=document.querySelector('aside[aria-label="Desktop workspace sidebar"]');
              const panel=sidebar?.nextElementSibling;
              const content=panel?.querySelector('main[data-merchant-scroll-region]');
              const header=panel?.querySelector('header input[aria-label="Find a workspace page"]')?.closest("header");
              const logo=sidebar?.querySelector("div.h-16");
              const nav=sidebar?.querySelector('nav[aria-label="Desktop main navigation"]');
              const footer=sidebar?.querySelector('footer[aria-label="Sidebar account and billing"]');
              if(!(sidebar instanceof HTMLElement)||!(panel instanceof HTMLElement)||!(content instanceof HTMLElement)||!(header instanceof HTMLElement)||!(logo instanceof HTMLElement)||!(nav instanceof HTMLElement)||!(footer instanceof HTMLElement))return {ok:false};
              const start=sidebar.getBoundingClientRect(),top=header.getBoundingClientRect(),logoTop=logo.getBoundingClientRect();
              content.scrollTop=content.scrollHeight;
              nav.scrollTop=nav.scrollHeight;
              const end=sidebar.getBoundingClientRect(),endHeader=header.getBoundingClientRect(),bottom=footer.getBoundingClientRect();
              const bg=getComputedStyle(sidebar).backgroundColor;
              const aligned=Math.abs(top.bottom-logoTop.bottom)<1&&Math.abs(top.height-64)<1&&Math.abs(logoTop.height-64)<1;
              const result={ok:Math.abs(start.top-end.top)<1&&Math.abs(start.left-end.left)<1&&Math.abs(top.top-endHeader.top)<1&&Math.abs(top.bottom-endHeader.bottom)<1&&bottom.bottom<=innerHeight+1&&bottom.bottom>innerHeight-100&&aligned,
                bg,scroller:content.scrollHeight>content.clientHeight,navScrollable:nav.scrollHeight>nav.clientHeight,navScrolled:nav.scrollTop,
                panelScrollable:panel.scrollHeight>panel.clientHeight,headerHeight:top.height,logoHeight:logoTop.height};
              content.scrollTop=0;nav.scrollTop=0;return result;
            });
            if(!layout.ok||layout.bg!=="rgb(0, 10, 22)"||!layout.scroller||layout.panelScrollable)throw Error("Desktop sidebar must be fixed at #000A16 and have an independent scrolling page: "+JSON.stringify(layout));
            record.desktopSidebarAnchored="PASS";
            record.sidebarSubscriptionFooter="PASS";
          }
          if(route==="/dashboard"&&view==="mobile"){
            if(await page.getByRole("complementary",{name:"Desktop workspace sidebar"}).isVisible())throw Error("Desktop sidebar leaked into mobile");
            record.mobileNavigationPreserved="PASS";
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
          if(route==="/dashboard/settings/invoice"){
            await page.getByRole("heading",{name:"Customize your invoices"}).waitFor();
            await page.getByRole("button",{name:"Choose #0B8063"}).click();
            await page.getByTestId("theme-draft-watermark").getByText("DRAFT · NOT ISSUED").first().waitFor();
            await page.getByText("Changes preview instantly. Select Save when ready.").waitFor();
            await page.getByRole("button",{name:"Save preferences"}).waitFor();
            await page.getByLabel("Default currency").selectOption("GBP");
            if(!await page.getByText("£250,000").first().isVisible())throw Error("Combined invoice settings did not update appearance preview currency");
            await page.getByRole("button",{name:/Classic Ledger/}).first().click();
            record.consolidatedInvoiceTheme="PASS";
          }
          if(route==="/dashboard/settings/theme"){
            await page.waitForURL("**/dashboard/settings/invoice");
            await page.getByRole("heading",{name:"Customize your invoices"}).waitFor();
            record.themeRedirectCanonical="PASS";
          }
          if(route==="/dashboard/settings/business"){
            await page.waitForURL("**/dashboard/getting-started/business");
            await page.getByRole("heading",{name:"Business Identity",level:1}).waitFor();
            record.businessRedirectCanonical="PASS";
          }
          if(route==="/dashboard/getting-started"){
            await page.getByRole("heading",{name:"Your setup checklist"}).waitFor();
            if(await page.getByRole("main").getByRole("link",{name:"Dashboard",exact:true}).count())throw Error("Redundant dashboard link in Getting Started");
            if(await page.getByRole("link",{name:/Open full workspace setup/}).count())throw Error("Legacy workspace link remains");
            await page.getByRole("region",{name:"Quick Create"}).getByRole("button",{name:/New Customer/}).waitFor();
            await page.getByRole("link",{name:/Add business information/}).click();
            await page.getByRole("heading",{name:"Business Identity",level:1}).waitFor();
            await page.getByRole("textbox",{name:/Business or trading name/}).fill("Octalve Trial Ltd");
            await page.getByRole("link",{name:"Back to checklist"}).click();
            await page.getByRole("heading",{name:"Your setup checklist"}).waitFor();
            await page.getByRole("link",{name:/Customize invoice template/}).click();
            await page.waitForURL("**/dashboard/settings/invoice?from=getting-started");
            await page.getByRole("link",{name:"Back to Getting Started"}).click();
            await page.waitForURL("**/dashboard/getting-started");
            await page.getByRole("link",{name:/Set up payments and banks/}).click();
            await page.getByRole("heading",{name:"Online Payments & Banks"}).waitFor();
            await page.locator('a[href="/dashboard/getting-started/payments/bank-transfer"]').click();
            await page.getByRole("heading",{name:"Bank Transfer"}).waitFor();
            await page.getByRole("combobox",{name:"Bank name"}).fill("Guaranty");
            await page.getByRole("option",{name:"Guaranty Trust Bank (GTBank)"}).click();
            if(await page.getByRole("combobox",{name:"Bank name"}).inputValue()!=="Guaranty Trust Bank (GTBank)")throw Error("Searchable bank selection did not persist");
            if(!await page.getByRole("button",{name:"Add Account"}).isDisabled())throw Error("Bank added without trusted server verification");
            record.setupNavigationSaveAndBankSearch="PASS";
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
            const workflows={
              statement:["Prepare statement","Prepare customer statement"],
              approvals:["Request approval","Prepare an approval request"],
              receivables:["Review receivables","Plan receivables follow-up"],
              adjustments:["Prepare adjustment","Prepare credit or debit note"],
              reconciliation:["Import statement","Plan statement reconciliation"],
              audit:["Review exceptions","Prepare exception investigation"],
              currencies:["Review currencies","Preview foreign-currency setup"]
            };
            const segment=route.split("/").at(-1),workflow=workflows[segment];
            if(workflow){
              const launch=page.getByRole("button",{name:workflow[0],exact:true});
              await launch.click();
              const sheet=page.getByRole("dialog",{name:workflow[1]});
              await sheet.waitFor({state:"visible"});
              if(await sheet.getByRole("button",{name:"Review details (no submission)"}).isEnabled())throw Error("Unvalidated finance action review accepted");
              await page.keyboard.press("Escape");
              await sheet.waitFor({state:"hidden"});
              record.financeSafeActionSheet="PASS";
            }
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
          if(route==="/dashboard/taxes"){
            await page.waitForURL(/\/dashboard\/tax-centre\/?$/);
            if(await page.getByText("GST Tax").count())throw Error("Unverified GST tax rate was exposed");
            record.legacyTaxRouteSafe="PASS";
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
            await page.getByText("No NRS e-invoices submitted").waitFor();
            await page.getByRole("region",{name:"NRS connection readiness"}).getByText("Not connected").waitFor();
            if(await page.getByRole("region",{name:"NRS connection readiness"}).getByText("Add details",{exact:true}).count()<1)throw Error("NRS readiness needs business identifiers");
            record.nrsReadinessOnly="PASS";
            record.taxNoFalseLiability="PASS";
          }
          if(route==="/portal"){
            await page.getByRole("heading",{name:"Everything about your invoices in one place."}).waitFor();
            await page.getByRole("navigation",{name:"Customer portal sections"}).getByRole("button",{name:"Payments"}).click();
            await page.getByRole("heading",{name:"Only verified payments appear here"}).waitFor();
            await page.getByText("Payments and sign-in are not available on this page.",{exact:false}).waitFor();
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
            await page.getByRole("heading",{name:"Create invoice"}).waitFor();
            const nav=page.getByRole("navigation",{name:"Invoice steps"});
            const activeStep=async label=>{
              const link=nav.getByRole("link",{name:new RegExp(label)});
              // Next.js client transitions complete asynchronously after the click.
              // Test the rendered active step after the router updates, not the previous paint.
              await page.waitForFunction(expected=>{
                const links=document.querySelectorAll('nav[aria-label="Invoice steps"] a');
                return [...links].some(a=>a.textContent?.includes(expected)&&a.getAttribute("aria-current")==="step");
              },label,{timeout:15000});
              if(await link.getAttribute("aria-current")!=="step")throw Error("Invoice step did not show the active state: "+label);
              return link;
            };
            await activeStep("Details");
            if(await page.getByRole("heading",{name:"Invoice & customer details"}).count()!==1)throw Error("Invoice details page missing");
            await page.locator('section[aria-label="Invoice details"]').getByRole("button",{name:"Sample Customer"}).click();
            await page.getByRole("dialog",{name:"Select customer"}).getByRole("button",{name:/Add new customer/}).click();
            await page.getByRole("dialog",{name:"Select customer"}).getByLabel("Customer name *").fill("Golden Preview Customer");
            await page.getByRole("dialog",{name:"Select customer"}).getByLabel("taxId",{exact:true}).fill("DEMO-TAX-ID");
            await page.getByRole("dialog",{name:"Select customer"}).getByLabel("city",{exact:true}).fill("Akure");
            await page.getByRole("dialog",{name:"Select customer"}).getByLabel("country",{exact:true}).fill("Nigeria");
            await page.getByRole("button",{name:"Add and select customer"}).click();
            if(await page.getByRole("textbox",{name:"Customer Tax ID"}).inputValue()!=="DEMO-TAX-ID")throw Error("Selected customer Tax ID missing");
            if(await page.getByRole("textbox",{name:"Customer city"}).inputValue()!=="Akure")throw Error("Selected customer city missing");
            if(await page.getByRole("textbox",{name:"Customer country"}).inputValue()!=="Nigeria")throw Error("Selected customer country missing");
            record.customerBillingAutoFill="PASS";

            await nav.getByRole("link",{name:/Items/}).click();
            await activeStep("Items");
            if(!await page.getByRole("heading",{name:"Products & services"}).isVisible())throw Error("Items did not receive its own page");
            const itemEditor=page.locator('section[aria-label="Invoice products and services"]');
            await itemEditor.getByRole("button",{name:"+ Add row"}).click();
            await itemEditor.getByRole("button",{name:"Edit item 1"}).click();
            await itemEditor.getByRole("button",{name:"Remove row"}).click();
            await itemEditor.getByRole("button",{name:"+ Add row"}).click();
            await itemEditor.getByRole("button",{name:"Expand items"}).click();
            await itemEditor.getByLabel("Product or service 1").fill("Golden Item One");
            await itemEditor.getByLabel("Product or service 2").fill("Golden Item Two");
            await itemEditor.getByLabel("Rate for item 1").fill("1500");
            await itemEditor.getByLabel("Rate for item 2").fill("2750");
            if(await itemEditor.getByLabel("Product or service 1").inputValue()!=="Golden Item One")throw Error("Row identities collided");

            await nav.getByRole("link",{name:/Totals/}).click();
            await activeStep("Totals");
            await page.getByLabel("Mail for customer / Notes").fill("PHASE ZERO NOTE WITHOUT BANK DETAILS");
            if(await itemEditor.isVisible())throw Error("Items should be hidden on the totals page");
            await nav.getByRole("link",{name:/Items/}).click();
            await activeStep("Items");
            if(await itemEditor.getByLabel("Product or service 1").inputValue()!=="Golden Item One")throw Error("Invoice item lost between pages");
            await nav.getByRole("link",{name:/Totals/}).click();
            await activeStep("Totals");
            if(await page.getByLabel("Mail for customer / Notes").inputValue()!=="PHASE ZERO NOTE WITHOUT BANK DETAILS")throw Error("Invoice notes lost between pages");
            record.invoicePageNavigation="PASS";

            await nav.getByRole("link",{name:/Payments/}).click();
            await activeStep("Payments");
            await page.getByRole("heading",{name:"Invoice workflow"}).waitFor();
            await page.getByRole("tab",{name:"Installments"}).click();
            await page.getByRole("button",{name:"Review proposed split"}).click();
            await page.getByText("No payment schedule was saved or communicated.",{exact:false}).waitFor();
            await page.getByRole("button",{name:"Custom milestones"}).click();
            await page.getByRole("button",{name:"Add milestone"}).click();
            if(await page.getByRole("button",{name:"Review proposed split"}).isEnabled())throw Error("Unbalanced plan was accepted");
            await page.getByRole("spinbutton",{name:"Milestone 1 percentage"}).fill("40");
            await page.getByRole("spinbutton",{name:"Milestone 4 percentage"}).fill("10");
            await page.getByText("Total allocation: 100%",{exact:false}).waitFor();
            if(!await page.getByRole("button",{name:"Review proposed split"}).isEnabled())throw Error("Balanced plan rejected");
            await page.getByRole("button",{name:"Review proposed split"}).click();
            record.customMilestoneValidation="PASS";
            await nav.getByRole("link",{name:/Totals/}).click();
            await activeStep("Totals");
            if(await page.getByRole("spinbutton",{name:"Milestone 1 percentage"}).isVisible())throw Error("Payment panel stayed visible on totals page");
            await nav.getByRole("link",{name:/Payments/}).click();
            await activeStep("Payments");
            if(await page.getByRole("spinbutton",{name:"Milestone 1 percentage"}).inputValue()!=="40")throw Error("Payment milestones lost when moving between pages");
            record.invoiceWorkflowStateRetained="PASS";
            await page.getByRole("tab",{name:"Communication"}).click();
            await page.getByRole("button",{name:"Payment reminder"}).click();
            const composeInvoice=page.getByRole("dialog",{name:"Draft invoice communication"});
            await composeInvoice.waitFor();
            await composeInvoice.getByRole("button",{name:"Review draft (not sent)"}).click();
            await page.getByText("No email, SMS or reminder was sent or queued.",{exact:false}).waitFor();
            record.installmentAndMailPreview="PASS";

            await nav.getByRole("link",{name:/Preview/}).click();
            await activeStep("Preview");
            await page.getByRole("heading",{name:"Invoice preview"}).waitFor();
            await page.locator('#invoice-document').waitFor();
            if(await page.locator('#invoice-document').getByRole("textbox",{name:"Customer name"}).inputValue()!=="Golden Preview Customer")throw Error("Invoice lost customer details");
            await page.locator('#invoice-document').getByText("Octalve Limited").waitFor();
            if(await page.locator('#invoice-document').getByText("Sapphire Quest").count())throw Error("Wrong merchant brand");
            if(await page.locator('#invoice-document').getByText("Editable sample line item").count())throw Error("Old sample row remains");
            await page.getByText("No business logo yet.").waitFor();
            const watermark=page.getByTestId("draft-preview-watermark");
            if(await watermark.count()!==1||await watermark.locator("span").count()!==1)throw Error("Draft watermark must appear once");
            if(await watermark.getByText("DRAFT — NOT ISSUED").count()!==1)throw Error("Single diagonal watermark missing");
            record.draftWatermark="PASS";
            await page.screenshot({path:path.join(output,view+"-invoice-modern.png"),fullPage:true,animations:"disabled"});
            if(view==="desktop"){record.browserModernPng=await qualifyBrowserPng(page,output,view,"modern");record.nativeModernPdf=await qualifyNativePdf(page,output,view,"modern");}
            await page.getByLabel("Template").selectOption("ledger");
            await page.locator('[data-invoice-renderer="classic-ledger-v1"]').waitFor();
            record.templateSwitch="PASS";
            await page.screenshot({path:path.join(output,view+"-invoice-classic-ledger.png"),fullPage:true,animations:"disabled"});
            if(view==="desktop"){record.browserClassicPng=await qualifyBrowserPng(page,output,view,"ledger");record.nativeClassicPdf=await qualifyNativePdf(page,output,view,"ledger");}
            record.itemRowIdentityAndNotes="PASS";
            record.merchantIdentity="PASS";
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
