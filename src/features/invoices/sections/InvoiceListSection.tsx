"use client";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
/** Invoice history adopts the shared record list UI while retaining invoice-specific document routes. */
export function InvoiceListSection(){
 return <RecordDirectory kind="invoice" showDesktopHeader={false}/>;
}
