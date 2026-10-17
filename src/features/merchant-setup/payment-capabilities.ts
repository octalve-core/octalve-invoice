/**
 * Published capability REFERENCES for a disconnected Phase 0I setup preview.
 * They are not merchant entitlements, verified expiry promises or live API values.
 * Actual eligibility / expiresAt must come from the chosen provider after Phase 1 approval.
 */
export const dynamicAccountCapabilities=[
 {id:"monnify-invoice",name:"Monnify Dynamic Invoice",duration:"Requested invoice expiry",detail:"Accepts an expiryDate. Maximum contract lifetime needs provider confirmation.",limitSeconds:null},
 {id:"flutterwave-v3",name:"Flutterwave v3 (NGN)",duration:"About two months",detail:"v3 expiry is version-specific; up to 5,270,401 seconds in the referenced API.",limitSeconds:5270401},
 {id:"flutterwave-v4",name:"Flutterwave v4",duration:"Up to 365 days",detail:"Documented upper bound is 31,536,000 seconds. Merchant capability must still be confirmed.",limitSeconds:31536000}
] as const;
export const gatewayCapabilities=[
 {id:"paystack",name:"Paystack",detail:"Online checkout; Pay with Transfer is short-lived (15 minutes–8 hours)."},
 {id:"flutterwave",name:"Flutterwave",detail:"Online checkout and payment links; separate from v3/v4 dynamic account products."},
 {id:"monnify",name:"Monnify",detail:"Hosted checkout and short transfer collection; different from Monnify Dynamic Invoice."}
] as const;
export const partnerBankAvailability="Unavailable until a regulated bank/PSP partnership and verified collection API are approved." as const;
