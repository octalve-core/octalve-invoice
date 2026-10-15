"use client";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
import {RecordMetricsSection} from "@/src/features/records/components/RecordMetricsSection";
export default function CreditNotePage(){
 return <div className="min-w-0 space-y-5"><div className="hidden lg:block"><h1 className="text-2xl font-bold text-[#1d2838]">Credit Note</h1><p className="mt-1 text-sm text-gray-500">Track customer credits, allocations and refunds</p></div>
  <RecordMetricsSection kind="creditNote"/>
  <RecordDirectory kind="creditNote" showDesktopHeader={false}/></div>;
}
