"use client";

import { useState } from "react";
import { InvoiceMetricsSection } from "@/src/features/invoices/sections/InvoiceMetricsSection";
import InvoiceTable from "@/components/dashboard/tables/InvoiceTable";
import CreateInvoiceModal from "@/components/dashboard/modals/CreateInvoiceModal";
import InvoicePreviewModal from "@/components/dashboard/modals/InvoicePreviewModal";

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

      {/* Source-faithful UI; sample metrics until server financial queries exist. */}
      <InvoiceMetricsSection />

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
