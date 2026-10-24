/**
 * Z04: proposed server-authorization decision matrix, tested in isolation.
 *
 * This is a PURE SPECIFICATION for future server implementation. Never use
 * this function as production middleware, authentication, route protection,
 * permissions, an access-token generator or a live source of identity.
 */
export type AccessAction=
 "merchant.invoice.read"|"customer.document.read"|
 "platform.support.case.read"|"platform.support.merchant.read"|
 "platform.billing.read"|"platform.compliance.read"|
 "financial.mark-paid"|"financial.refund"|"fiscal.submit"|"platform.grant-role";
export type MerchantRole="owner"|"staff";
export type PlatformRole="support"|"billing"|"compliance";
export type ProposedSession=Readonly<{
 userId:string;authenticated:boolean;emailVerified:boolean;expiresAt:number;
}>;
export type MerchantMembership=Readonly<{
 userId:string;organizationId:string;role:MerchantRole;active:boolean;
 invoiceRead:boolean;
}>;
export type CustomerAccessGrant=Readonly<{
 userId:string;organizationId:string;customerPartyId:string;
 documentIds:readonly string[];accepted:boolean;revokedAt:number|null;expiresAt:number;
}>;
export type PlatformStaffMembership=Readonly<{
 userId:string;role:PlatformRole;approved:boolean;mfaVerified:boolean;
}>;
export type ScopedSupportGrant=Readonly<{
 staffUserId:string;organizationId:string;caseId:string;
 recordIds:readonly string[];approved:boolean;revokedAt:number|null;expiresAt:number;
}>;
export type ProposedAccessRequest=Readonly<{
 action:AccessAction;now:number;session:ProposedSession|null;
 organizationId?:string;customerPartyId?:string;documentId?:string;caseId?:string;
 /** Future server-resolved record ownership. Must NOT come from a browser claim. */
 recordOrganizationId?:string;recordCustomerPartyId?:string;
 merchantMemberships?:readonly MerchantMembership[];
 customerGrants?:readonly CustomerAccessGrant[];
 platformMemberships?:readonly PlatformStaffMembership[];
 supportGrants?:readonly ScopedSupportGrant[];
}>;
export type ProposedDecision=Readonly<{allowed:boolean;reason:string}>;
const deny=(reason:string):ProposedDecision=>({allowed:false,reason});
const allow=(reason:string):ProposedDecision=>({allowed:true,reason});
const current=(expiration:number,now:number)=>Number.isFinite(expiration)&&expiration>now;
const activeGrant=(expiresAt:number,revokedAt:number|null,now:number)=>
 current(expiresAt,now)&&(revokedAt===null||revokedAt>now);

/**
 * Hypothetical positive READ-only cases use exact organization and record scope;
 * cross-context roles, matching emails and browser navigation never grant access.
 * All financial/fiscal/staff mutations are denied regardless of hypothetical role.
 */
export function evaluateProposedAccess(x:ProposedAccessRequest):ProposedDecision{
 const s=x.session;
 if(!s||!s.authenticated||!s.emailVerified||!s.userId.trim()||!current(s.expiresAt,x.now))
  return deny("A current verified server session is required.");
 if(!x.organizationId?.trim())
  return deny("A verified organization context is required.");
 if(x.action==="financial.mark-paid"||x.action==="financial.refund"||x.action==="fiscal.submit"||x.action==="platform.grant-role")
  return deny("Financial, fiscal and privilege mutations require separate source authority, MFA, audit and server approval.");
 const userId=s.userId,organizationId=x.organizationId;
 if(x.action==="merchant.invoice.read"){
  if(!x.documentId?.trim()||!x.recordOrganizationId||x.recordOrganizationId!==organizationId)
   return deny("Record ownership must match the requested organization.");
  const matched=x.merchantMemberships?.some(m=>m.active&&m.invoiceRead&&m.userId===userId&&m.organizationId===organizationId);
  return matched?allow("Exact active merchant membership with invoice-read scope (proposed)."):deny("No active scoped merchant membership.");
 }
 if(x.action==="customer.document.read"){
  if(!x.documentId?.trim()||!x.customerPartyId?.trim()||x.recordOrganizationId!==organizationId||x.recordCustomerPartyId!==x.customerPartyId)
   return deny("The record must match the granted organization and customer party.");
  const matched=x.customerGrants?.some(g=>
   g.userId===userId&&g.organizationId===organizationId&&
   g.customerPartyId===x.customerPartyId&&g.documentIds.includes(x.documentId!)&&
   g.accepted&&activeGrant(g.expiresAt,g.revokedAt,x.now));
  return matched?allow("Exact accepted customer-document grant (proposed)."):deny("No current accepted customer-document grant.");
 }
 const role=x.action==="platform.billing.read"?"billing":x.action==="platform.compliance.read"?"compliance":"support";
 const staff=x.platformMemberships?.some(m=>m.userId===userId&&m.role===role&&m.approved&&m.mfaVerified);
 if(!staff)return deny("An approved platform role and fresh MFA are required.");
 if(x.action==="platform.billing.read"||x.action==="platform.compliance.read")
  return allow("Approved role-specific platform access (proposed).");
 if(!x.caseId?.trim())return deny("A scoped, assigned support case is required.");
 const caseGrant=x.supportGrants?.some(g=>g.staffUserId===userId&&g.organizationId===organizationId&&
  g.caseId===x.caseId&&g.approved&&activeGrant(g.expiresAt,g.revokedAt,x.now));
 if(!caseGrant)return deny("No active case-bound support grant.");
 if(x.action==="platform.support.case.read")return allow("Assigned case-only read (proposed).");
 if(!x.documentId?.trim()||x.recordOrganizationId!==organizationId)
  return deny("A case-approved record in the exact organization is required.");
 const recordGrant=x.supportGrants?.some(g=>g.staffUserId===userId&&g.organizationId===organizationId&&
  g.caseId===x.caseId&&g.recordIds.includes(x.documentId!)&&g.approved&&activeGrant(g.expiresAt,g.revokedAt,x.now));
 return recordGrant?allow("Case-bound minimum-necessary merchant record read (proposed)."):deny("The record is outside the approved case.");
}
export const z04IsOperational=false as const;
export const z04ReadinessChecklist=[
 "Verified identity and email ownership, rotating/revocable sessions",
 "Active merchant memberships per organization with least-privilege scopes",
 "Accepted, expiring customer access grants tied to exact document IDs",
 "Octalve staff appointment, scoped role approval and step-up MFA",
 "Case-bound support access: purpose, approval, expiry and merchant transparency",
 "Server-side enforcement on every read, mutation, search, export and file",
 "Cross-tenant, forged-ID, account-linking and revocation regression",
 "Idempotency, payments/receipts source authority, append-only audit and NDPA controls"
] as const;
