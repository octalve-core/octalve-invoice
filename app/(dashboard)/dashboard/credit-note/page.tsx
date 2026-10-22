"use client";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
import {RecordMetricsSection} from "@/src/features/records/components/RecordMetricsSection";
import {MerchantPageHeading} from "@/components/dashboard/ui/MerchantPageHeading";
export default function CreditNotePage(){
 return <div className="min-w-0 space-y-5"><MerchantPageHeading title="Credit Note" description="Track customer credits, allocations and refunds" hideOnMobile/>
  <RecordMetricsSection kind="creditNote"/>
  <RecordDirectory kind="creditNote" showDesktopHeader={false}/></div>;
}
