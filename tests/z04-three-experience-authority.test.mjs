import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {evaluateProposedAccess,z04IsOperational,z04ReadinessChecklist} from "../src/features/experience-preview/z04-proposed-authorization.ts";
const now=100000;
const session={userId:"user-a",authenticated:true,emailVerified:true,expiresAt:now+10000};
const merchant={userId:"user-a",organizationId:"org-a",role:"staff",active:true,invoiceRead:true};
const customer={userId:"user-a",organizationId:"org-a",customerPartyId:"party-a",documentIds:["inv-a"],accepted:true,expiresAt:now+10000,revokedAt:null};
const staff={userId:"user-a",role:"support",approved:true,mfaVerified:true};
const grant={staffUserId:"user-a",organizationId:"org-a",caseId:"CASE-a",recordIds:["inv-a"],approved:true,expiresAt:now+10000,revokedAt:null};
const base={session,now,organizationId:"org-a",documentId:"inv-a",recordOrganizationId:"org-a",customerPartyId:"party-a",recordCustomerPartyId:"party-a",caseId:"CASE-a",
 merchantMemberships:[merchant],customerGrants:[customer],platformMemberships:[staff],supportGrants:[grant]};
const check=(action,patch={})=>evaluateProposedAccess({...base,...patch,action});

test("preview matrix itself is not an operational authorization API",()=>{
 assert.equal(z04IsOperational,false);
 assert.ok(z04ReadinessChecklist.length>=8);
 for(const p of ["app/(customer)/customer/access/page.tsx","app/(platform)/admin/access/page.tsx","app/(dashboard)/dashboard/staff/access/page.tsx"]){
  const s=readFileSync(new URL("../"+p,import.meta.url),"utf8");
  assert.match(s,/AccessReadiness/);
  assert.doesNotMatch(s,/fetch\(|localStorage|sessionStorage|credentials|grantRole/);
 }
});
test("no session, unverified email, expired session, forged org or empty ID deny",()=>{
 assert.equal(check("merchant.invoice.read",{session:null}).allowed,false);
 assert.equal(check("customer.document.read",{session:{...session,emailVerified:false}}).allowed,false);
 assert.equal(check("platform.support.case.read",{session:{...session,expiresAt:now}}).allowed,false);
 assert.equal(check("merchant.invoice.read",{session:{...session,userId:"attacker"}}).allowed,false);
 assert.equal(check("merchant.invoice.read",{organizationId:""}).allowed,false);
});
test("merchant membership requires exact owner organization, active membership and read scope",()=>{
 assert.equal(check("merchant.invoice.read").allowed,true);
 assert.equal(check("merchant.invoice.read",{organizationId:"org-b"}).allowed,false);
 assert.equal(check("merchant.invoice.read",{recordOrganizationId:"org-b"}).allowed,false);
 assert.equal(check("merchant.invoice.read",{merchantMemberships:[{...merchant,active:false}]}).allowed,false);
 assert.equal(check("merchant.invoice.read",{merchantMemberships:[{...merchant,invoiceRead:false}]}).allowed,false);
 assert.equal(check("merchant.invoice.read",{merchantMemberships:[],platformMemberships:[staff]}).allowed,false);
});
test("customer grants are accepted, scoped to exact tenant, party, record and live expiry",()=>{
 assert.equal(check("customer.document.read").allowed,true);
 assert.equal(check("customer.document.read",{organizationId:"org-b",recordOrganizationId:"org-b"}).allowed,false);
 assert.equal(check("customer.document.read",{customerPartyId:"party-b",recordCustomerPartyId:"party-b"}).allowed,false);
 assert.equal(check("customer.document.read",{documentId:"inv-b"}).allowed,false);
 assert.equal(check("customer.document.read",{recordOrganizationId:"org-b"}).allowed,false);
 assert.equal(check("customer.document.read",{recordCustomerPartyId:"party-b"}).allowed,false);
 assert.equal(check("customer.document.read",{customerGrants:[{...customer,accepted:false}]}).allowed,false);
 assert.equal(check("customer.document.read",{customerGrants:[{...customer,expiresAt:now}]}).allowed,false);
 assert.equal(check("customer.document.read",{customerGrants:[{...customer,revokedAt:now-1}]}).allowed,false);
 assert.equal(check("customer.document.read",{customerGrants:[],merchantMemberships:[merchant]}).allowed,false);
});
test("Octalve support requires distinct approved platform role, MFA and scoped live case",()=>{
 assert.equal(check("platform.support.case.read").allowed,true);
 assert.equal(check("platform.support.merchant.read").allowed,true);
 assert.equal(check("platform.support.merchant.read",{documentId:"inv-b"}).allowed,false);
 assert.equal(check("platform.support.merchant.read",{recordOrganizationId:"org-b"}).allowed,false);
 assert.equal(check("platform.support.case.read",{caseId:"CASE-forged"}).allowed,false);
 assert.equal(check("platform.support.case.read",{supportGrants:[{...grant,revokedAt:now}]}).allowed,false);
 assert.equal(check("platform.support.case.read",{supportGrants:[{...grant,expiresAt:now}]}).allowed,false);
 assert.equal(check("platform.support.case.read",{supportGrants:[{...grant,approved:false}]}).allowed,false);
 assert.equal(check("platform.support.case.read",{platformMemberships:[{...staff,mfaVerified:false}]}).allowed,false);
 assert.equal(check("platform.support.case.read",{platformMemberships:[{...staff,approved:false}]}).allowed,false);
 assert.equal(check("platform.support.case.read",{platformMemberships:[],merchantMemberships:[merchant]}).allowed,false);
});
test("billing and compliance are distinct operational roles, not global superuser",()=>{
 assert.equal(check("platform.billing.read").allowed,false);
 assert.equal(check("platform.compliance.read").allowed,false);
 assert.equal(check("platform.billing.read",{platformMemberships:[{...staff,role:"billing"}]}).allowed,true);
 assert.equal(check("platform.compliance.read",{platformMemberships:[{...staff,role:"compliance"}]}).allowed,true);
});
test("no hypothetical role can bypass financial, refund, fiscal or privilege authority",()=>{
 for(const action of ["financial.mark-paid","financial.refund","fiscal.submit","platform.grant-role"]){
  assert.equal(check(action).allowed,false,action);
 }
});
test("the access view remains an explicit preview; no live role state",()=>{
 const s=readFileSync(new URL("../src/features/experience-preview/AccessReadiness.tsx",import.meta.url),"utf8");
 for(const phrase of ["No live authentication","These pages do not enforce authorization","Not activated"]){
  assert.ok(s.includes(phrase),phrase);
 }
 assert.doesNotMatch(s,/useState|fetch\(|onClick|localStorage|document\.cookie/);
});
