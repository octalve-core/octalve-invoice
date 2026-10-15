"use client";

import { useState } from "react";
import PaymentReceivedTable from "@/components/dashboard/tables/PaymentReceivedTable";

export default function PaymentReceivedPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (data: any) => {
    console.log("Create payment", data);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment received</h1>
        <p className="text-gray-500 mt-1">Record and manage incoming payments</p>
      </div>

      <PaymentReceivedTable onCreateClick={() => setIsCreateModalOpen(true)} />

      {/* TODO: create payment modal */}
    </div>
  );
}
