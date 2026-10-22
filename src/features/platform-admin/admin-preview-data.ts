/** Synthetic operational examples only, not authoritative staff, merchant or payment records. */
export type AdminRecordKind="merchants"|"customers"|"subscriptions"|"verifications"|"support"|"staff";
export type AdminPreviewRecord={id:string;name:string;detail:string;status:string;category:string;kind:AdminRecordKind;merchantId?:string;ownerLabel?:string};
export const adminPreviewRecords:readonly AdminPreviewRecord[]=[
 {id:"OM-001",name:"Bluehaven Ventures",detail:"Business account · Growth",status:"Review required",category:"Merchant",kind:"merchants"},
 {id:"OM-002",name:"Atlas Supply Co.",detail:"Business account · Starter",status:"Pending",category:"Merchant",kind:"merchants"},
 {id:"OM-003",name:"Cedar Works",detail:"Business account · Business",status:"Sample active",category:"Merchant",kind:"merchants"},
 {id:"AC-001",name:"Customer access enquiry",detail:"Bluehaven Ventures · scoped support request",status:"Open",category:"Customer",kind:"customers",merchantId:"OM-001"},
 {id:"AC-002",name:"Document access question",detail:"Atlas Supply Co. · permission pending",status:"Pending",category:"Customer",kind:"customers",merchantId:"OM-002"},
 {id:"SUB-001",name:"Growth plan example",detail:"Bluehaven Ventures",status:"Sample",category:"Subscription",kind:"subscriptions",merchantId:"OM-001"},
 {id:"SUB-002",name:"Starter plan example",detail:"Atlas Supply Co.",status:"Sample",category:"Subscription",kind:"subscriptions",merchantId:"OM-002"},
 {id:"VER-001",name:"Business identity review",detail:"Bluehaven Ventures · ownership evidence needed",status:"Pending",category:"Verification",kind:"verifications",merchantId:"OM-001"},
 {id:"VER-002",name:"Bank ownership review",detail:"Atlas Supply Co. · independent check required",status:"Pending",category:"Verification",kind:"verifications",merchantId:"OM-002"},
 {id:"SUP-001",name:"Update company information",detail:"Bluehaven Ventures",status:"Open",category:"Merchant case",kind:"support",merchantId:"OM-001"},
 {id:"SUP-002",name:"Subscription question",detail:"Atlas Supply Co.",status:"Pending",category:"Billing case",kind:"support",merchantId:"OM-002"},
 {id:"SUP-003",name:"Invoice presentation enquiry",detail:"Cedar Works",status:"Open",category:"Merchant case",kind:"support",merchantId:"OM-003"},
 {id:"CSP-101",name:"Invoice access question",detail:"Sample customer · Weyport Energy",status:"Open",category:"Customer case",kind:"support",ownerLabel:"Sample customer"},
 {id:"ST-001",name:"Support specialist",detail:"Case-scoped merchant support",status:"Role example",category:"Support",kind:"staff"},
 {id:"ST-002",name:"Billing operations",detail:"Subscription and entitlement reviews",status:"Role example",category:"Billing",kind:"staff"},
 {id:"ST-003",name:"Compliance reviewer",detail:"Evidence verification; dual review where required",status:"Role example",category:"Compliance",kind:"staff"}
];
export function adminPreviewRecord(kind:AdminRecordKind,id:string){return adminPreviewRecords.find(r=>r.kind===kind&&r.id===id);}
