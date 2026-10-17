"use client";
import Image from "next/image";
import {BrandWordmark} from "@/src/shared/ui/BrandWordmark";
import {GoBackText} from "./AuthHeader";
import {SharedAuthForm} from "./SharedAuthForm";

/** Exactly one auth form is mounted. Responsive headings and the approved desktop
 * artwork never duplicate credentials, validation state or hidden form controls.
 */
export function UnifiedAuthScreen({mode}:{mode:"login"|"signup"}){
 const signup=mode==="signup";
 return <div className="grid min-h-[calc(100dvh-90px)] min-w-0 bg-white lg:min-h-screen lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)]">
   <section className="flex min-w-0 flex-col justify-center px-2 py-8 sm:px-6 lg:px-8 lg:py-12 xl:px-12">
    <div className="mx-auto w-full max-w-lg">
     <div className="smallScreen mb-7">
      <h1 className="text-[28px] font-bold tracking-tight text-[#233A52]">{signup?"Create an account":"Log in"}</h1>
      <p className="mt-1 text-sm text-[#7A8DA1]">{signup?"Start managing your business with Octalve Finance.":"Welcome back to your business workspace."}</p>
     </div>
     <div className="largeScreen mb-8"><GoBackText/><BrandWordmark className="mb-5 mt-6" width={190}/>
      <h1 className="text-2xl font-bold tracking-tight text-[#1D3550]">{signup?"Create an account":"Welcome to Octalve Finance"}</h1>
      <p className="mt-2 text-sm text-[#8797A9]">{signup?"The same simple, secure sign-up on every device.":"Sign in to manage invoices and business records."}</p>
     </div>
     <SharedAuthForm mode={mode}/>
    </div>
   </section>
   <aside className="relative hidden min-h-screen overflow-hidden lg:block" aria-label="Octalve Finance welcome artwork">
    <Image src={signup?"/signupBg.jpg":"/loginBg.jpg"} alt="" fill priority sizes="43vw" className="object-cover"/>
    <div className="absolute left-[15%] top-[12%] flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#173652] shadow-lg"><Image src="/invoiceIcon.svg" alt="" width={24} height={24}/>Invoice</div>
    <div className="absolute right-[10%] top-[8%] rounded-xl bg-[#F0EBFF] px-4 py-2 text-sm font-semibold text-[#6240B5] shadow-lg">Expenses</div>
    <div className="absolute right-[7%] top-[39%] rounded-xl bg-[#0064E0] px-4 py-2 text-sm font-semibold text-white shadow-lg">Receipt</div>
    <div className="absolute bottom-[35%] left-[15%] rounded-xl bg-[#F5C542] px-4 py-2 text-sm font-semibold text-[#1D3550] shadow-lg">Invoice</div>
    <div className="absolute bottom-[12%] right-[8%] rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0064E0] shadow-lg">Business growth</div>
   </aside>
  </div>;
}
