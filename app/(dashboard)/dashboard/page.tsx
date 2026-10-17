"use client";

import { FileText, Users, Wallet, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import {useRouter} from "next/navigation";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import Tabs from "@/components/dashboard/ui/Tabs";
import {OverviewMetrics} from "@/src/features/dashboard/OverviewMetrics";
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


export default function DashboardPage() {
  const router=useRouter();
  const {user}=useMerchantPreview();
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
          Welcome{user.fullName ? ` back, ${user.fullName}` : " to your dashboard"}
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
