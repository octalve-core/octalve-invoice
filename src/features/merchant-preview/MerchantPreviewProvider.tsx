"use client";
import {createContext,useContext,useMemo,useState,type Dispatch,type ReactNode,type SetStateAction} from "react";
export interface MerchantPreviewSettings {
 businessName:string;businessAddress:string;businessPhone:string;businessDescription:string;
 rcNumber:string;taxId:string;bankName:string;accountNumber:string;email:string;website:string;
}
export type PaymentMode="manual"|"monnify"|"flutterwave"|"paystack";
type ContextValue={
 settings:MerchantPreviewSettings;
 setSettings:Dispatch<SetStateAction<MerchantPreviewSettings>>;
 logoPreview:string|null;setLogoPreview:Dispatch<SetStateAction<string|null>>;
 paymentMode:PaymentMode;setPaymentMode:Dispatch<SetStateAction<PaymentMode>>;
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
 const value=useMemo(()=>({settings,setSettings,logoPreview,setLogoPreview,paymentMode,setPaymentMode}),[settings,logoPreview,paymentMode]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useMerchantPreview(){const ctx=useContext(C);if(!ctx)throw new Error("Merchant preview provider missing");return ctx;}
