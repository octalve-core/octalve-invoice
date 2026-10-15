"use client";
import {createContext,useContext,useMemo,useState,type Dispatch,type ReactNode,type SetStateAction} from "react";
export interface MerchantPreviewSettings {
 businessName:string;businessAddress:string;businessPhone:string;businessDescription:string;
 rcNumber:string;taxId:string;bankName:string;accountNumber:string;email:string;website:string;
}
export interface PreviewUser {
 fullName:string; email:string; phone:string;address:string;country:string;state:string;postalCode:string;
}
export function getInitials(value:string){const parts=value.trim().split(/\s+/).filter(Boolean);return parts.length?((parts[0]?.[0]||"")+(parts.length>1?(parts[parts.length-1]?.[0]||""):"")).toUpperCase():"?";}
export const defaultPreviewUser:PreviewUser={
 fullName:"",email:"",phone:"",address:"",country:"nigeria",state:"",postalCode:""
};
export type PaymentMode="manual"|"monnify"|"flutterwave"|"paystack";
export type ReceiptAutoMode="off"|"generate"|"generate_and_email";
export interface CatalogCustomer {id:string;name:string;email:string;phone:string;address:string;company:string;}
export interface CatalogItem {id:string;name:string;description:string;rate:string;taxPercent:string;discountPercent:string;category:string;type:"goods"|"service";}
export interface CatalogStaff {id:string;name:string;email:string;role:string;phone:string;}
export const starterCustomers:CatalogCustomer[]=[
 {id:"1",name:"Olamide Ismail",email:"olamide@example.invalid",phone:"",address:"",company:"Bi Creativity"},
 {id:"2",name:"Weyport Energy",email:"weyport@example.invalid",phone:"",address:"",company:"Weyport Energy Ltd"},
 {id:"3",name:"Sample Customer",email:"customer@example.invalid",phone:"",address:"",company:"Sample Enterprises"}
];
export const starterItems:CatalogItem[]=[
 {id:"1",name:"Dell 512SSD Laptop",description:"",rate:"550000",taxPercent:"0",discountPercent:"1",category:"Electronics",type:"goods"},
 {id:"2",name:"Consulting services",description:"",rate:"120000",taxPercent:"0",discountPercent:"0",category:"Services",type:"service"},
 {id:"3",name:"Laptop charger",description:"",rate:"6250",taxPercent:"0",discountPercent:"0",category:"Accessories",type:"goods"}
];
export const starterStaff:CatalogStaff[]=[
 {id:"1",name:"Idris Jamiu",email:"staff1@example.invalid",role:"Salesperson",phone:""},
 {id:"2",name:"Sample Accountant",email:"staff2@example.invalid",role:"Accountant",phone:""}
];
type ContextValue={
 settings:MerchantPreviewSettings;
 setSettings:Dispatch<SetStateAction<MerchantPreviewSettings>>;
 logoPreview:string|null;setLogoPreview:Dispatch<SetStateAction<string|null>>;
 paymentMode:PaymentMode;setPaymentMode:Dispatch<SetStateAction<PaymentMode>>;
 customers:CatalogCustomer[];setCustomers:Dispatch<SetStateAction<CatalogCustomer[]>>;
 items:CatalogItem[];setItems:Dispatch<SetStateAction<CatalogItem[]>>;
 staff:CatalogStaff[];setStaff:Dispatch<SetStateAction<CatalogStaff[]>>;
 receiptAutoMode:ReceiptAutoMode;setReceiptAutoMode:Dispatch<SetStateAction<ReceiptAutoMode>>;
 readNotificationIds:string[];setReadNotificationIds:Dispatch<SetStateAction<string[]>>;
 user:PreviewUser;setUser:Dispatch<SetStateAction<PreviewUser>>;
 userImage:string|null;setUserImage:Dispatch<SetStateAction<string|null>>;
 resetPreview:()=>void;
};
const defaults:MerchantPreviewSettings={
 businessName:"Octalve Limited",businessAddress:"",businessPhone:"",businessDescription:"",
 rcNumber:"",taxId:"",bankName:"",accountNumber:"",email:"",website:""
};
const C=createContext<ContextValue|null>(null);
/** Ephemeral cross-route demo context. No persistence, cookies, network or billing credentials. */
export function MerchantPreviewProvider({children}:{children:ReactNode}){
 const [settings,setSettings]=useState<MerchantPreviewSettings>(defaults);
 const [logoPreview,setLogoPreview]=useState<string|null>(null);
 const [paymentMode,setPaymentMode]=useState<PaymentMode>("manual");
 const [user,setUser]=useState<PreviewUser>(defaultPreviewUser);
 const [customers,setCustomers]=useState<CatalogCustomer[]>(starterCustomers);
 const [items,setItems]=useState<CatalogItem[]>(starterItems);
 const [staff,setStaff]=useState<CatalogStaff[]>(starterStaff);
 const [receiptAutoMode,setReceiptAutoMode]=useState<ReceiptAutoMode>("off");
 const [readNotificationIds,setReadNotificationIds]=useState<string[]>([]);
 const [userImage,setUserImage]=useState<string|null>(null);
 const resetPreview=()=>{setSettings(defaults);setLogoPreview(null);setPaymentMode("manual");setUser(defaultPreviewUser);setUserImage(null);setCustomers(starterCustomers);setItems(starterItems);setStaff(starterStaff);setReceiptAutoMode("off");setReadNotificationIds([]);};
 const value=useMemo(()=>({settings,setSettings,logoPreview,setLogoPreview,paymentMode,setPaymentMode,customers,setCustomers,items,setItems,staff,setStaff,receiptAutoMode,setReceiptAutoMode,readNotificationIds,setReadNotificationIds,user,setUser,userImage,setUserImage,resetPreview}),[settings,logoPreview,paymentMode,customers,items,staff,receiptAutoMode,readNotificationIds,user,userImage]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useMerchantPreview(){const ctx=useContext(C);if(!ctx)throw new Error("Merchant preview provider missing");return ctx;}
