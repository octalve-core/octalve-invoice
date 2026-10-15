"use client";
import {useState} from "react";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
import CreateExpenseModal from "@/components/dashboard/modals/CreateExpenseModal";
export default function ExpensesPage(){
 const [creating,setCreating]=useState(false);
 const [notice,setNotice]=useState("");
 return <div className="min-w-0 space-y-5">
  {notice?<p role="status" className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">{notice}</p>:null}
  <RecordDirectory kind="expense" onCreate={()=>setCreating(true)}/>
  <CreateExpenseModal isOpen={creating} onClose={()=>setCreating(false)} onSubmit={()=>{setCreating(false);setNotice("Expense form Preview only. No expense was saved or paid.");}}/>
 </div>;
}
