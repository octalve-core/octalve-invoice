"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
import {RecordMetricsSection} from "@/src/features/records/components/RecordMetricsSection";
import CreateReceiptModal from "@/components/dashboard/modals/CreateReceiptModal";
export default function ReceiptPage(){
 const router=useRouter();
 const [creating,setCreating]=useState(false);
 const [notice,setNotice]=useState("");
 return <div className="min-w-0 space-y-5">
  {notice?<p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>:null}
  <div className="hidden lg:block"><h1 className="text-2xl font-bold text-[#1d2838]">Receipt</h1><p className="mt-1 text-sm text-gray-500">Create and manage payment receipts</p></div>
  <RecordMetricsSection kind="receipt"/>
  <RecordDirectory kind="receipt" showDesktopHeader={false} onCreate={()=>router.push("/dashboard/receipt/create")}/>
  <CreateReceiptModal isOpen={creating} onClose={()=>setCreating(false)} onSubmit={()=>{setCreating(false);setNotice("Receipt not issued. No payment was recorded.");}}/>
 </div>;
}
