/** Public, synthetic UI examples. No merchant, customer, invoice or payment authority. */
export type CustomerInvoice={
 id:string;reference:string;merchantId:string;merchant:string;title:string;
 amountMinor:number;paidMinor:number;currency:"NGN";status:"pending"|"partial"|"paid"|"overdue";
 issuedOn:string;dueOn:string;
};
export const sampleCustomerInvoices:readonly CustomerInvoice[]=[
 {id:"sample-1",reference:"WE-00001INV",merchantId:"m-we",merchant:"Weyport Energy",title:"Equipment servicing",amountMinor:18500000,paidMinor:0,currency:"NGN",status:"pending",issuedOn:"10 Oct 2026",dueOn:"30 Oct 2026"},
 {id:"sample-2",reference:"AS-00002INV",merchantId:"m-as",merchant:"Atlas Supplies",title:"Office materials",amountMinor:8200000,paidMinor:4100000,currency:"NGN",status:"partial",issuedOn:"02 Oct 2026",dueOn:"27 Oct 2026"},
 {id:"sample-3",reference:"CL-00003INV",merchantId:"m-cl",merchant:"Cedar Logistics",title:"Local delivery",amountMinor:3800000,paidMinor:3800000,currency:"NGN",status:"paid",issuedOn:"19 Sep 2026",dueOn:"05 Oct 2026"},
 {id:"sample-4",reference:"WE-00004INV",merchantId:"m-we",merchant:"Weyport Energy",title:"Parts and maintenance",amountMinor:12600000,paidMinor:0,currency:"NGN",status:"overdue",issuedOn:"17 Sep 2026",dueOn:"08 Oct 2026"}
];
export const sampleMerchants=[
 {id:"m-we",name:"Weyport Energy",initials:"WE",type:"Energy services"},
 {id:"m-as",name:"Atlas Supplies",initials:"AS",type:"Office supplies"},
 {id:"m-cl",name:"Cedar Logistics",initials:"CL",type:"Logistics"}
] as const;
export const sampleMessages=[
 {id:"msg-1",sender:"Weyport Energy",subject:"Your invoice is ready",date:"10 Oct 2026"},
 {id:"msg-2",sender:"Atlas Supplies",subject:"Your payment plan",date:"03 Oct 2026"}
] as const;
export const minorMoney=(value:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",minimumFractionDigits:2}).format(value/100);
export const sampleCustomerSummary=()=>{
 const invoices=sampleCustomerInvoices;
 return {outstandingMinor:invoices.reduce((n,x)=>n+x.amountMinor-x.paidMinor,0),
  paidMinor:invoices.reduce((n,x)=>n+x.paidMinor,0),
  merchantCount:new Set(invoices.map(i=>i.merchantId)).size,
  unpaidCount:invoices.filter(x=>x.status!=="paid").length};
};
