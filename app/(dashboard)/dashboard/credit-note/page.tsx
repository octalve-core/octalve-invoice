"use client";

import { useState } from "react";
import StatCard from "@/components/dashboard/cards/StatCard";
import CreditNoteTable from "@/components/dashboard/tables/CreditNoteTable";
import MobileCreditNoteList from "@/components/dashboard/mobile/MobileCreditNoteList";

// Dummy stats data matching the design aesthetic or placeholder logic
const statsData = [
  {
    title: "Total sales generated",
    value: "2,420",
    change: 40,
    chartData: [30, 40, 25, 50, 49, 60, 70, 91, 85, 95],
    chartColor: "#41B63E",
  },
  {
    title: "Total Credit note", // Matching the context
    value: "1,210",
    change: -8,
    chartData: [50, 45, 60, 55, 40, 35, 45, 40, 35, 30],
    chartColor: "#EF4444",
  },
  {
    title: "Total Reoccuring",
    value: "316",
    change: 23,
    chartData: [20, 35, 40, 50, 55, 60, 65, 70, 80, 85],
    chartColor: "#41B63E",
  },
];

export default function CreditNotePage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
    // Logic to open create modal would go here
    console.log("Open Create Modal");
  };

  const handleViewClick = (note: any) => {
    setSelectedNote(note);
    // Logic to view note details/preview would go here
    console.log("View Note", note);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      {/* Use a common header component if available, or just standard markup. 
           Based on invoice page, usually just a title. 
           However, MobileHeader might handle mobile view title. 
           Desktop view usually has breadcrumbs or title. 
           Let's follow InvoicePage pattern. */}
      {/* <div>
        <h1 className="text-2xl font-bold text-gray-900">Credit note</h1>
      </div> */}
      {/* Actually InvoicePage had header in div. */}

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

      {/* Mobile View */}
      <MobileCreditNoteList
        onCreateClick={handleCreateClick}
        onItemClick={handleViewClick}
      />

      {/* Desktop View */}
      <div className="hidden lg:block">
        <CreditNoteTable
          onCreateClick={handleCreateClick}
          onViewClick={handleViewClick}
        />
      </div>

      {/* Modals would go here */}
      {/* <CreateCreditNoteModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} /> */}
    </div>
  );
}
