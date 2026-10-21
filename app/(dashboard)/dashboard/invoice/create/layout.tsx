import type {ReactNode} from "react";
import {InvoiceComposer} from "@/src/features/invoices/sections/InvoiceComposer";
export default function CreateInvoiceLayout({children}:{children:ReactNode}){
 return <><InvoiceComposer mode="create"/>{children}</>;
}
