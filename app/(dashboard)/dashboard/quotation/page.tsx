"use client";

import { useState } from "react";
import QuotationTable from "@/components/dashboard/tables/QuotationTable";
import CreateQuotationModal from "@/components/dashboard/modals/CreateQuotationModal";
import QuotationPreviewModal from "@/components/dashboard/modals/QuotationPreviewModal";
import MobileQuotationList from "@/components/dashboard/mobile/MobileQuotationList";

interface SelectedQuotation {
  id: string;
  reference: string;
  clientName: string;
  amount: string;
  dateCreated: string;
  dateDue: string;
  email: string;
  status: "paid" | "pending" | "draft" | "overdue" | "sent" | "declined";
}

export default function QuotationPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] =
    useState<SelectedQuotation | null>(null);

  const handleViewQuotation = (quotation: SelectedQuotation) => {
    setSelectedQuotation(quotation);
    setIsPreviewModalOpen(true);
  };

  const handleCreateQuotation = (data: any) => {
    console.log("Creating quotation:", data);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      {/* Mobile View */}
      <MobileQuotationList
        onCreateClick={() => setIsCreateModalOpen(true)}
        onQuotationClick={handleViewQuotation}
      />

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotation</h1>
          <p className="text-gray-500 mt-1">
            Create and manage your quotations
          </p>
        </div>

        {/* Quotation Table */}
        <QuotationTable
          onCreateClick={() => setIsCreateModalOpen(true)}
          onViewClick={handleViewQuotation}
        />
      </div>

      {/* Modals */}
      <CreateQuotationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateQuotation}
      />

      <QuotationPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        quotation={selectedQuotation || undefined}
      />
    </>
  );
}
