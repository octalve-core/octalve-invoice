"use client";
import {useState} from "react";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
import CreateQuotationModal from "@/components/dashboard/modals/CreateQuotationModal";
import {MerchantPageHeading} from "@/components/dashboard/ui/MerchantPageHeading";
export default function QuotationPage(){
 const [creating,setCreating]=useState(false);
 const [notice,setNotice]=useState("");
 return <div className="min-w-0 space-y-5">
  <MerchantPageHeading title="Quotation" description="Prepare and manage estimates — not payment records" hideOnMobile/>
  {notice?<p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>:null}
  <RecordDirectory kind="quotation" showDesktopHeader={false} onCreate={()=>setCreating(true)}/>
  <CreateQuotationModal isOpen={creating} onClose={()=>setCreating(false)} onSubmit={()=>{setCreating(false);setNotice("Quotation not saved or sent.");}}/>
 </div>;
}
