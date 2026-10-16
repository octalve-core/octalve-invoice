"use client";

import Image from "next/image";
import Link from "next/link";
import {usePathname,useRouter} from "next/navigation";
import {BrandWordmark} from "@/src/shared/ui/BrandWordmark";

export const AuthHeader=()=>{
 const router=useRouter(),pathname=usePathname();
 const isIdentityScreen=pathname==="/login"||pathname==="/signup";
 return <div className="flex w-full min-w-0 items-center justify-between gap-3">
   <button type="button" onClick={()=>router.back()} aria-label="Go back" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl hover:bg-[#F3F7FD] focus-visible:outline-2 focus-visible:outline-[#0064E0]">
    <Image src="/backArrow.svg" alt="" width={16} height={25}/>
   </button>
   {isIdentityScreen?<Link href="/onboarding" aria-label="Octalve Invoice welcome" className="flex min-w-0 flex-1 items-center justify-center"><BrandWordmark width={155}/></Link>:<span className="flex-1"/>}
   <span aria-hidden className="w-10 shrink-0"/>
  </div>;
};

export const GoBackText=()=>{
 const router=useRouter();
 return <button type="button" onClick={()=>router.back()} className="mb-8 flex cursor-pointer items-center text-sm text-gray-500">← Back</button>;
};
