"use client";
import { InvoiceListSection } from "@/src/features/invoices/sections/InvoiceListSection";
import { InvoiceMetricsSection } from "@/src/features/invoices/sections/InvoiceMetricsSection";
import {MerchantPageHeading} from "@/components/dashboard/ui/MerchantPageHeading";
export default function InvoicePage(){
 return <div className="min-w-0 space-y-5">
  <MerchantPageHeading title="Invoice" description="Create, review and manage invoices" hideOnMobile/>
  <InvoiceMetricsSection/>
  <InvoiceListSection/>
 </div>;
}
