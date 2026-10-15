import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("source shell and primary invoice screens are present", () => {
  for (const file of [
    "app/(dashboard)/dashboard/page.tsx",
    "app/(dashboard)/dashboard/invoice/page.tsx",
    "app/(auth)/login/page.tsx",
    "components/dashboard/Sidebar.tsx",
    "components/dashboard/modals/CreateInvoiceModal.tsx",
    "public/loginBg.jpg",
    "public/signupBg.jpg"
  ]) assert.ok(fs.existsSync(file), file);
});
