import type {ReactNode} from "react";
import {InvoiceComposer} from "@/src/features/invoices/sections/InvoiceComposer";
export default function EditInvoiceLayout({children}:{children:ReactNode}){
 return <><InvoiceComposer mode="edit"/>{children}</>;
}
