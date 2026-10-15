"use client";

import { useState } from "react";
import StatCard from "@/components/dashboard/cards/StatCard";
import InvoiceTable from "@/components/dashboard/tables/InvoiceTable";
import CreateInvoiceModal from "@/components/dashboard/modals/CreateInvoiceModal";
import InvoicePreviewModal from "@/components/dashboard/modals/InvoicePreviewModal";

const statsData = [
  {
    title: "Total sales generated",
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

interface SelectedInvoice {
  reference: string;
  customer: string;
  amount: string;
  date: string;
  status: string;
}

export default function InvoicePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<SelectedInvoice | null>(null);

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsPreviewModalOpen(true);
  };

  const handleCreateInvoice = (data: any) => {
    console.log("Creating invoice:", data);
    // Handle invoice creation
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Invoice</h1>
        <p className="text-gray-500 mt-1">Create and manage your invoices</p>
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

      {/* Invoice Table */}
      <InvoiceTable
        onCreateClick={() => setIsCreateModalOpen(true)}
        onViewClick={handleViewInvoice}
      />

      {/* Create Invoice Modal */}
      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        invoice={selectedInvoice || undefined}
      />
    </div>
  );
}
