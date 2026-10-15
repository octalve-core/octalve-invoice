"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {LogOut,X} from "lucide-react";
import {useMerchantPreview} from "./MerchantPreviewProvider";
export function PreviewLogoutButton({className=""}:{className?:string}){
 const router=useRouter(),[ask,setAsk]=useState(false);
 const {resetPreview}=useMerchantPreview();
 return <>
  <button type="button" onClick={()=>setAsk(true)} className={`inline-flex items-center gap-2 ${className}`}><LogOut size={17}/>Log out</button>
  {ask?<div className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={()=>setAsk(false)}>
   <section aria-label="Leave preview" role="dialog" aria-modal="true" className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl" onClick={e=>e.stopPropagation()}>
    <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Leave Preview?</h2><button aria-label="Cancel" onClick={()=>setAsk(false)}><X size={20}/></button></div>
    <p className="mt-3 text-sm text-gray-600">Authentication is not live yet. Leaving clears your temporary on-screen merchant and user details, then returns to the login preview. It does not sign out of a server account.</p>
    <div className="mt-5 flex gap-3"><button onClick={()=>setAsk(false)} className="flex-1 rounded-full border px-4 py-3 text-sm font-medium text-slate-700">Stay</button>
    <button onClick={()=>{resetPreview();setAsk(false);router.replace("/login?preview=exited");}} className="flex-1 rounded-full bg-[#0064E0] px-4 py-3 text-sm font-medium text-white">Log out of Preview</button></div>
   </section></div>:null}
 </>;
}
