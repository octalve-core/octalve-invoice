"use client";

import { FileText, Users, Wallet, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import {useRouter} from "next/navigation";
import Tabs from "@/components/dashboard/ui/Tabs";
import StatCard from "@/components/dashboard/cards/StatCard";
import QuickAction from "@/components/dashboard/cards/QuickAction";
import ReceivableChart from "@/components/dashboard/charts/ReceivableChart";
import TransactionTable from "@/components/dashboard/tables/TransactionTable";
import CreateInvoiceModal from "@/components/dashboard/modals/CreateInvoiceModal";
import AddCustomerModal from "@/components/dashboard/modals/AddCustomerModal";
import CreateExpenseModal from "@/components/dashboard/modals/CreateExpenseModal";
import CreateQuotationModal from "@/components/dashboard/modals/CreateQuotationModal";

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Announcement", href: "/dashboard/announcement" },
  { label: "Recent Update", href: "/dashboard/updates" },
];

const quickActions = [
  { icon: FileText, label: "New Invoice", action: "invoice", tone: "blue" as const },
  { icon: Users, label: "New Customer", action: "customer", tone: "green" as const },
  { icon: Wallet, label: "New Expenses", action: "expense", tone: "red" as const },
  { icon: FileSpreadsheet, label: "New Quotation", action: "quotation", tone: "orange" as const },
];

const statsData = [
  {
    title: "Total Sales",
    value: "2,420",
    change: 40,
    chartData: [30, 40, 25, 50, 49, 60, 70, 91, 85, 95],
    chartColor: "#0064E0",
  },
  {
    title: "Total Invoice",
    value: "1,210",
    change: -8,
    chartData: [50, 45, 60, 55, 40, 35, 45, 40, 35, 30],
    chartColor: "#EF4444",
  },
  {
    title: "Total Orders",
    value: "316",
    change: 23,
    chartData: [20, 35, 40, 50, 55, 60, 65, 70, 80, 85],
    chartColor: "#0064E0",
  },
];

export default function DashboardPage() {
  const router=useRouter();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModals = () => setActiveModal(null);

  const handleCreate = (type: string, data: any) => {
    console.log(`Creating ${type}:`, data);
    closeModals();
  };

  return (
    <div className="min-w-0 space-y-5">
      {/* Tabs */}
      <div className="hidden lg:block"><Tabs tabs={tabs} /></div>

      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Abdulsamad
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s your business overview.
        </p>
      </div>

      {/* Quick Create */}
      <div className="rounded-xl bg-white p-3 sm:p-5">
        <h2 className="mb-3 text-lg font-medium text-gray-700">
          ⚡ Quick Create
        </h2>
        <div className="grid grid-cols-4 gap-2 min-w-0">
          {quickActions.map((action) => (
            <QuickAction
              key={action.label}
              icon={action.icon}
              label={action.label}
              tone={action.tone}
              onClick={() => action.action==="invoice"?router.push("/dashboard/invoice/create"):setActiveModal(action.action)}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-500">Sample financial figures — UI Preview only</p>
      {/* Small-screen financial card grouping from the approved Flutter reference. */}
      <section aria-label="Mobile receivables" className="md:hidden grid grid-cols-2 gap-2">
        {[["Current invoice","₦506,000.00"],["Total inflow","₦506,000.00"],["Overdue invoice","₦0.00"],["Total outflow","₦240,000.00"]].map(([label,value])=>(
          <div key={label} className="min-w-0 rounded-lg border border-gray-100 bg-white px-3 py-3">
            <p className="text-[11px] text-gray-600">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold text-[#172f4d]">{value}</p>
          </div>
        ))}
      </section>
      {/* Stats Cards */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            chartData={stat.chartData}
            chartColor={stat.chartColor}
          />
        ))}
      </div>

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

      {/* Quick Action Modals */}
      <CreateInvoiceModal
        isOpen={activeModal === "invoice"}
        onClose={closeModals}
        onSubmit={(data) => handleCreate("invoice", data)}
      />
      <AddCustomerModal
        isOpen={activeModal === "customer"}
        onClose={closeModals}
        onSubmit={(data) => handleCreate("customer", data)}
      />
      <CreateExpenseModal
        isOpen={activeModal === "expense"}
        onClose={closeModals}
        onSubmit={(data) => handleCreate("expense", data)}
      />
      <CreateQuotationModal
        isOpen={activeModal === "quotation"}
        onClose={closeModals}
        onSubmit={(data) => handleCreate("quotation", data)}
      />
    </div>
  );
}
