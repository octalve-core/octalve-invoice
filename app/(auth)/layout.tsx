import React from "react";
import {AuthHeader} from "./components/AuthHeader";
import {Toaster} from "@/components/ui/sonner";
export const metadata={title:"Octalve Finance · Account",description:"Manage your Octalve Finance workspace"};
export default function AuthLayout({children}:{children:React.ReactNode}){
 return <main className="auth-container auth-layout min-h-screen bg-white">
   <div className="smallScreen">
     <div className="header flex items-center justify-between p-4"><AuthHeader/></div>
   </div>
   <div className="min-w-0 w-full max-lg:px-4 max-lg:py-2">{children}</div>
   <Toaster/>
 </main>;
}
