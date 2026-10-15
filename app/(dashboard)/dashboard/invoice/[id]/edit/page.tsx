"use client";
import {useParams} from "next/navigation";
import {InvoiceComposer} from "@/src/features/invoices/sections/InvoiceComposer";
export default function EditInvoicePage(){
 const {id}=useParams<{id:string}>();
 return <InvoiceComposer mode="edit" invoiceId={id}/>;
}
