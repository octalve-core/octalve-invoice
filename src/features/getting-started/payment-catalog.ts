export const PAYMENT_METHODS=[
 {id:"paystack",title:"Paystack",kind:"Gateway",brief:"Cards, checkout and short transfer payments.",hint:"Pay with Transfer lasts 15 minutes–8 hours."},
 {id:"flutterwave",title:"Flutterwave",kind:"Gateway + dynamic",brief:"Checkout and eligible virtual accounts.",hint:"Virtual account limits depend on API version."},
 {id:"monnify",title:"Monnify",kind:"Gateway + dynamic",brief:"Checkout and invoice-specific virtual accounts.",hint:"Dynamic invoices use a new single-use account."},
 {id:"dynamic-account",title:"Dynamic Account",kind:"Invoice-specific",brief:"Collect by transfer to an invoice-specific account.",hint:"Requires an eligible connected Monnify, Flutterwave or future approved bank."},
 {id:"bank-transfer",title:"Bank Transfer",kind:"Company account",brief:"Receive funds into your verified business bank account.",hint:"Manual payment evidence until a trusted bank feed exists."},
 {id:"paypal",title:"PayPal",kind:"International",brief:"PayPal checkout for eligible merchant businesses.",hint:"Availability and currency support depend on the merchant's country."}
] as const;
export type PaymentMethodId=(typeof PAYMENT_METHODS)[number]["id"];
export function isPaymentMethod(value:string):value is PaymentMethodId{
 return PAYMENT_METHODS.some(p=>p.id===value);
}
export const CONNECTION_FIELDS:{
 [K in Exclude<PaymentMethodId,"bank-transfer"|"dynamic-account">]:readonly {
  label:string;example:string;secret:boolean;optional?:boolean
 }[]
}={
 paystack:[
  {label:"Public key",example:"pk_test_••••••••",secret:false,optional:true},
  {label:"Secret key",example:"sk_test_••••••••",secret:true}
 ],
 flutterwave:[
  {label:"Public key (v3)",example:"FLWPUBK_TEST-••••",secret:false,optional:true},
  {label:"Secret key",example:"FLWSECK_TEST-••••",secret:true},
  {label:"Encryption key (direct card only)",example:"••••••••",secret:true,optional:true},
  {label:"Webhook verification secret",example:"••••••••",secret:true}
 ],
 monnify:[
  {label:"API key",example:"MK_TEST_••••••••",secret:false},
  {label:"Secret key",example:"••••••••",secret:true},
  {label:"Contract code",example:"••••••••",secret:false}
 ],
 paypal:[
  {label:"Client ID",example:"A••••••••",secret:false},
  {label:"Client secret",example:"••••••••",secret:true}
 ]
};
export const PAYMENT_FAQ="/dashboard/settings/faqs";
export const PAYMENT_ROUTE="/dashboard/getting-started/payments";
