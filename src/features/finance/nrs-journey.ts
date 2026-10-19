/** Phase 0I / Batch T: proposed journey only. No NRS or bank API calls. */
export type JourneyStage={
 id:string;title:string;actor:"Merchant"|"Octalve"|"Customer"|"Provider"|"NRS";
 summary:string;dependency:string;mode:"preview"|"specified"|"external";
};
export const financeJourney:readonly JourneyStage[]=[
 {id:"onboard",title:"Business identity",actor:"Merchant",summary:"Business, taxpayer and ownership details",dependency:"Server KYB, roles and verified taxpayer consent",mode:"preview"},
 {id:"connect",title:"Connect collections",actor:"Octalve",summary:"Company bank, gateway or Dynamic Account",dependency:"Authenticated provider credentials and partner approval",mode:"preview"},
 {id:"compose",title:"Compose invoice",actor:"Merchant",summary:"Items, tax category, dates and flexible milestones",dependency:"Authoritative financial amounts and immutable issue snapshot",mode:"preview"},
 {id:"validate",title:"Validate / fiscalize",actor:"NRS",summary:"Applicability, structured document, IRN and official response",dependency:"Accredited/authorised NRS connection and response",mode:"external"},
 {id:"deliver",title:"Deliver customer view",actor:"Customer",summary:"Same issued invoice with correct payment instructions",dependency:"Signed customer access, issued PDF and real communication",mode:"specified"},
 {id:"verify",title:"Confirm payment",actor:"Provider",summary:"Transfer or gateway evidence; pending / partial / paid",dependency:"Verified event, unique reference, amount and currency",mode:"specified"},
 {id:"reconcile",title:"Reconcile exceptions",actor:"Octalve",summary:"Late transfer, unmatched funds, payout and refund",dependency:"Audited allocation, provider requery and exception actions",mode:"preview"},
 {id:"report",title:"Report / retain audit",actor:"Octalve",summary:"Optional receipts and required fiscal status updates",dependency:"NRS payment update acceptance and lawful retention",mode:"specified"}
];
export const nrsAuthorityBoundaries=[
 {id:"document",title:"Invoice number",detail:"Merchant document series (e.g., OL-00001-INV). Not an IRN."},
 {id:"fiscal",title:"Official IRN and QR",detail:"Only valid after the required official NRS route and authenticated response."},
 {id:"payment",title:"Payment verification",detail:"Only trusted bank/provider confirmation establishes collection; never an NRS QR."},
 {id:"filing",title:"Tax filing and remittance",detail:"Separate legal obligations; not satisfied by issuing an invoice or receiving payment."}
] as const;
export const nrsPaymentStatusReference=["PENDING","PARTIAL","PAID","REJECTED"] as const;
export const nrsReferenceLinks=[
 {name:"Official NRS onboarding",url:"https://einvoice.nrs.gov.ng/docs/introduction/getting-started"},
 {name:"SI invoice schema (v1.1)",url:"https://einvoice.nrs.gov.ng/docs/system-integrator/invoice-schema"},
 {name:"NRS API changelog",url:"https://einvoice.nrs.gov.ng/changelog"},
 {name:"SI and APP roles",url:"https://einvoice.nrs.gov.ng/serivce-providers/introduction"}
] as const;
/** Audit state is separate from profile entry. No input UI state can grant authority. */
export function officialNrsReadiness(evidence:{
 taxpayerAuthorised:boolean;
 approvedIntegration:boolean;
 serverBusinessVerified:boolean;
 liveNrsResponse:boolean;
}){
 const complete=Object.values(evidence).every(x=>x===true);
 return {status:complete?"Server evidence required for authenticated status":"Not connected",
   canIssueOfficialInvoice:false,
   canShowOfficialIrnQr:false};
}
