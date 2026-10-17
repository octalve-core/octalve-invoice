"use client";
import {FileText,Users,Wallet,FileSpreadsheet} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import QuickAction from "@/components/dashboard/cards/QuickAction";
import CreateInvoiceModal from "@/components/dashboard/modals/CreateInvoiceModal";
import AddCustomerModal from "@/components/dashboard/modals/AddCustomerModal";
import CreateExpenseModal from "@/components/dashboard/modals/CreateExpenseModal";
import CreateQuotationModal from "@/components/dashboard/modals/CreateQuotationModal";
const actions=[
 {icon:FileText,label:"New Invoice",action:"invoice",tone:"blue" as const},
 {icon:Users,label:"New Customer",action:"customer",tone:"green" as const},
 {icon:Wallet,label:"New Expenses",action:"expense",tone:"red" as const},
 {icon:FileSpreadsheet,label:"New Quotation",action:"quotation",tone:"orange" as const}
];
/** One quick-create UI and one action mapping, shared by Overview and Getting Started. */
export function QuickCreatePanel(){
 const router=useRouter();
 const [activeModal,setActiveModal]=useState<string|null>(null);
 const close=()=>setActiveModal(null);
 const onPreviewSubmit=()=>{close();toast.info("Preview only — no financial record was created.");};
 return <section className="rounded-xl bg-white p-3 sm:p-5" aria-label="Quick Create">
  <h2 className="mb-3 text-lg font-medium text-gray-700">⚡ Quick Create</h2>
  <div className="grid min-w-0 grid-cols-4 gap-1.5 sm:gap-2">
   {actions.map(a=><QuickAction key={a.label} icon={a.icon} label={a.label} tone={a.tone}
    onClick={()=>a.action==="invoice"?router.push("/dashboard/invoice/create"):setActiveModal(a.action)}/>)}
  </div>
  <CreateInvoiceModal isOpen={activeModal==="invoice"} onClose={close} onSubmit={onPreviewSubmit}/>
  <AddCustomerModal isOpen={activeModal==="customer"} onClose={close} onSubmit={onPreviewSubmit}/>
  <CreateExpenseModal isOpen={activeModal==="expense"} onClose={close} onSubmit={onPreviewSubmit}/>
  <CreateQuotationModal isOpen={activeModal==="quotation"} onClose={close} onSubmit={onPreviewSubmit}/>
 </section>;
}
