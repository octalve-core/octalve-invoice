"use client";

import { FileText, Users, Wallet, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
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
  { icon: FileText, label: "New Invoice", action: "invoice" },
  { icon: Users, label: "New Customer", action: "customer" },
  { icon: Wallet, label: "New Expenses", action: "expense" },
  { icon: FileSpreadsheet, label: "New Quotation", action: "quotation" },
];

const statsData = [
  {
    title: "Total Sales",
    value: "2,420",
    change: 40,
    chartData: [30, 40, 25, 50, 49, 60, 70, 91, 85, 95],
    chartColor: "#41B63E",
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
    chartColor: "#41B63E",
  },
];

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModals = () => setActiveModal(null);

  const handleCreate = (type: string, data: any) => {
    console.log(`Creating ${type}:`, data);
    closeModals();
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs tabs={tabs} />

      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Lateef
        </h1>
        <p className="text-gray-500 mt-1">
          Track, manage and forecast your customers and orders.
        </p>
      </div>

      {/* Quick Create */}
      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-3">
          + Quick Create
        </h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <QuickAction
              key={action.label}
              icon={action.icon}
              label={action.label}
              onClick={() => setActiveModal(action.action)}
            />
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="lg:hidden space-y-4">
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
