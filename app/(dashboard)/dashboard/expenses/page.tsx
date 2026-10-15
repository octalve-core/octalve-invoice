"use client";

import { useState } from "react";
import ExpensesTable from "@/components/dashboard/tables/ExpensesTable";
import CreateExpenseModal from "@/components/dashboard/modals/CreateExpenseModal";
import ExpensePreviewModal from "@/components/dashboard/modals/ExpensePreviewModal";
import MobileExpenseList from "@/components/dashboard/mobile/MobileExpenseList";

interface SelectedExpense {
  id: string;
  reference: string;
  vendor: string;
  category: string;
  amount: string;
  date: string;
  paymentMethod?: string;
  description?: string;
  status: "paid" | "pending" | "draft" | "overdue" | "refunded";
}

export default function ExpensesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] =
    useState<SelectedExpense | null>(null);

  const handleViewExpense = (expense: any) => {
    setSelectedExpense({
      id: expense.id,
      reference: expense.reference,
      vendor: expense.vendor,
      category: expense.category,
      amount: expense.amount,
      date: expense.dateCreated || expense.date,
      paymentMethod: expense.paymentMethod,
      status: expense.status,
    });
    setIsPreviewModalOpen(true);
  };

  const handleCreateExpense = (data: any) => {
    console.log("Creating expense:", data);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      {/* Mobile View */}
      <MobileExpenseList
        onCreateClick={() => setIsCreateModalOpen(true)}
        onExpenseClick={handleViewExpense}
      />

      {/* Desktop View */}
      <div className="hidden lg:block space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-500 mt-1">
            Track and manage your business expenses
          </p>
        </div>

        {/* Expenses Table */}
        <ExpensesTable
          onCreateClick={() => setIsCreateModalOpen(true)}
          onViewClick={handleViewExpense}
        />
      </div>

      {/* Modals */}
      <CreateExpenseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateExpense}
      />

      <ExpensePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        expense={
          selectedExpense
            ? {
                reference: selectedExpense.reference,
                vendor: selectedExpense.vendor,
                category: selectedExpense.category,
                amount: selectedExpense.amount,
                date: selectedExpense.date,
                paymentMethod: selectedExpense.paymentMethod,
                status: selectedExpense.status,
              }
            : undefined
        }
      />
    </>
  );
}
