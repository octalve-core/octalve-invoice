"use client";
import { InvoiceListSection } from "@/src/features/invoices/sections/InvoiceListSection";
import { InvoiceMetricsSection } from "@/src/features/invoices/sections/InvoiceMetricsSection";
export default function InvoicePage(){
 return <div className="min-w-0 space-y-5">
  <h1 className="text-xl font-bold text-[#1d2838] md:text-2xl">Invoice</h1>
  <InvoiceMetricsSection/>
  <InvoiceListSection/>
 </div>;
}
