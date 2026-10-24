"use client";
import {RecordDirectory} from "@/src/features/records/components/RecordDirectory";
import Link from "next/link";
export default function StaffPage(){
 return <div className="min-w-0 space-y-3"><div className="flex justify-end"><Link href="/dashboard/staff/access" className="inline-flex min-h-10 items-center rounded-full border border-[#0064E0] px-4 text-xs font-medium text-[#0064E0]">Staff access readiness</Link></div><RecordDirectory kind="staff"/></div>;
}
