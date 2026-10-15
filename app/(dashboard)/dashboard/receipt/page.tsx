"use client";

import { useState } from "react";
import StatCard from "@/components/dashboard/cards/StatCard";
import ReceiptTable from "@/components/dashboard/tables/ReceiptTable";
import CreateReceiptModal from "@/components/dashboard/modals/CreateReceiptModal";
import ReceiptPreviewModal from "@/components/dashboard/modals/ReceiptPreviewModal";
import MobileReceiptList from "@/components/dashboard/mobile/MobileReceiptList";

const statsData = [
  {
    title: "Total outstanding receivable",
    value: "2,420",
    change: 40,
    chartData: [30, 40, 25, 50, 49, 60, 70, 91, 85, 95],
    chartColor: "#41B63E",
  },
  {
    title: "Due in 30 days",
    value: "1,210",
    change: -8,
    chartData: [50, 45, 60, 55, 40, 35, 45, 40, 35, 30],
    chartColor: "#EF4444",
  },
  {
    title: "Total refunded",
    value: "316",
    change: 23,
    chartData: [20, 35, 40, 50, 55, 60, 65, 70, 80, 85],
    chartColor: "#41B63E",
  },
];

interface SelectedReceipt {
  reference: string;
  customerTo: string;
  amount: string;
  date: string;
  status: string;
}

export default function ReceiptPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] =
    useState<SelectedReceipt | null>(null);

  const handleViewReceipt = (receipt: any) => {
    setSelectedReceipt({
      reference: receipt.reference,
      customerTo: receipt.customerTo,
      amount: receipt.amount,
      date: receipt.dateChannel || receipt.date,
      status: receipt.status,
    });
    setIsPreviewModalOpen(true);
  };

  const handleCreateReceipt = (data: any) => {
    console.log("Creating receipt:", data);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      {/* Mobile View */}
      <MobileReceiptList
        onCreateClick={() => setIsCreateModalOpen(true)}
        onReceiptClick={handleViewReceipt}
      />

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Receipt</h1>
          <p className="text-gray-500 mt-1">Create and manage your receipts</p>
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

        {/* Receipt Table */}
        <ReceiptTable
          onCreateClick={() => setIsCreateModalOpen(true)}
          onViewClick={handleViewReceipt}
        />
      </div>

      {/* Modals */}
      <CreateReceiptModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateReceipt}
      />

      <ReceiptPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        receipt={selectedReceipt || undefined}
      />
    </>
  );
}
