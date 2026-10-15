"use client";
import {useState} from "react";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
import CreateReceiptModal from "@/components/dashboard/modals/CreateReceiptModal";
export default function ReceiptPage(){
 const [creating,setCreating]=useState(false);
 const [notice,setNotice]=useState("");
 return <div className="min-w-0 space-y-5">
  {notice?<p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>:null}
  <RecordDirectory kind="receipt" onCreate={()=>setCreating(true)}/>
  <CreateReceiptModal isOpen={creating} onClose={()=>setCreating(false)} onSubmit={()=>{setCreating(false);setNotice("Receipt form Preview only. No receipt was issued, payment recorded or bank transfer confirmed.");}}/>
 </div>;
}
