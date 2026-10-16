"use client";
import {BrandWordmark} from "@/src/shared/ui/BrandWordmark";
import {GoBackText} from "./AuthHeader";
import {SharedAuthForm} from "./SharedAuthForm";

/** Preserve Octalve's approved mobile form proportions and desktop image art while
 * reusing the same validation, fields and action contract on both breakpoints.
 */
export function UnifiedAuthScreen({mode}:{mode:"login"|"signup"}){
 const signup=mode==="signup";
 return <>
  <div className="smallScreen min-h-[calc(100dvh-130px)] px-3 py-7">
   <div className="mx-auto flex min-h-[65dvh] w-full max-w-md flex-col justify-center">
    <h1 className="mb-1 text-[28px] font-bold tracking-tight text-[#233A52]">{signup?"Create an account":"Log in"}</h1>
    <p className="mb-7 text-sm text-[#7A8DA1]">{signup?"Start managing your business with Octalve.":"Welcome back to your business workspace."}</p>
    <SharedAuthForm mode={mode}/>
   </div>
  </div>
  <div className="largeScreen">
   <div className="grid min-h-screen grid-cols-[minmax(0,4fr)_minmax(0,3fr)]">
    <section className="flex min-w-0 items-center justify-center overflow-y-auto bg-white px-6 py-10 xl:px-12">
     <div className="w-full max-w-lg"><GoBackText/><BrandWordmark className="mb-5 mt-7" width={190}/>
      <h1 className="text-2xl font-bold tracking-tight text-[#1D3550]">{signup?"Create an account":"Welcome to Octalve Invoice"}</h1>
      <p className="mb-8 mt-2 text-sm text-[#8797A9]">{signup?"The same simple, secure sign-up on every device.":"Sign in to manage invoices and business records."}</p>
      <SharedAuthForm mode={mode}/>
     </div>
    </section>
    <aside className="relative min-h-screen overflow-hidden" aria-label="Octalve Invoice welcome artwork">
     <img src={signup?"/signupBg.jpg":"/loginBg.jpg"} alt="" className="absolute inset-0 h-full w-full object-cover"/>
     <div className="absolute left-[15%] top-[12%] flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#173652] shadow-lg"><img src="/invoiceIcon.svg" alt="" className="h-6 w-6"/>Invoice</div>
     <div className="absolute right-[10%] top-[8%] rounded-xl bg-[#F0EBFF] px-4 py-2 text-sm font-semibold text-[#6240B5] shadow-lg">Expenses</div>
     <div className="absolute right-[7%] top-[39%] rounded-xl bg-[#0064E0] px-4 py-2 text-sm font-semibold text-white shadow-lg">Receipt</div>
     <div className="absolute bottom-[35%] left-[15%] rounded-xl bg-[#F5C542] px-4 py-2 text-sm font-semibold text-[#1D3550] shadow-lg">Invoice</div>
     <div className="absolute bottom-[12%] right-[8%] rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0064E0] shadow-lg">Business growth</div>
    </aside>
   </div>
  </div>
 </>;
}
