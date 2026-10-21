"use client";

import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import Tabs from "@/components/dashboard/ui/Tabs";
import {MerchantPageHeading} from "@/components/dashboard/ui/MerchantPageHeading";
import {OverviewMetrics} from "@/src/features/dashboard/OverviewMetrics";
import {QuickCreatePanel} from "@/src/features/dashboard/QuickCreatePanel";
import ReceivableChart from "@/components/dashboard/charts/ReceivableChart";
import TransactionTable from "@/components/dashboard/tables/TransactionTable";
const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Announcement", href: "/dashboard/announcement" },
  { label: "Recent Update", href: "/dashboard/updates" },
];

export default function DashboardPage() {
  const {user}=useMerchantPreview();

  return (
    <div className="min-w-0 space-y-5">
      {/* Tabs */}
      <div className="hidden lg:block"><Tabs tabs={tabs} /></div>

      <MerchantPageHeading title={user.fullName?`Welcome back, ${user.fullName}`:"Welcome to your dashboard"} description="Here’s your business overview."/>

      <QuickCreatePanel/>

      <OverviewMetrics />

      {/* Receivable Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Summary Cards - Mobile Only */}
        <div className="hidden">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Current</p>
            <p className="text-xl font-bold text-gray-900">₦506,000.00</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-lg font-bold text-gray-900">₦506,000.00</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-500">Outstanding</p>
              <p className="text-lg font-bold text-gray-900">₦0.00</p>
              <p className="text-xs text-gray-400">₦240,000.00</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-3">
          <ReceivableChart />
        </div>
      </div>

      {/* Recent Transactions */}
      <TransactionTable />

    </div>
  );
}
