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
type ContextValue={
 settings:MerchantPreviewSettings;
 setSettings:Dispatch<SetStateAction<MerchantPreviewSettings>>;
 logoPreview:string|null;setLogoPreview:Dispatch<SetStateAction<string|null>>;
 paymentMode:PaymentMode;setPaymentMode:Dispatch<SetStateAction<PaymentMode>>;
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
 const [userImage,setUserImage]=useState<string|null>(null);
 const resetPreview=()=>{setSettings(defaults);setLogoPreview(null);setPaymentMode("manual");setUser(defaultPreviewUser);setUserImage(null);};
 const value=useMemo(()=>({settings,setSettings,logoPreview,setLogoPreview,paymentMode,setPaymentMode,user,setUser,userImage,setUserImage,resetPreview}),[settings,logoPreview,paymentMode,user,userImage]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export function useMerchantPreview(){const ctx=useContext(C);if(!ctx)throw new Error("Merchant preview provider missing");return ctx;}
