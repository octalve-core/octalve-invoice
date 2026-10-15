"use client";

import { X, Download, Printer, Edit, Trash2, Receipt } from "lucide-react";

interface ExpensePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: {
    reference?: string;
    vendor?: string;
    category?: string;
    amount?: string;
    date?: string;
    paymentMethod?: string;
    description?: string;
    status?: string;
  };
}

export default function ExpensePreviewModal({
  isOpen,
  onClose,
  expense,
}: ExpensePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-[#41B63E]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Expense Details
              </h2>
              <p className="text-sm text-gray-500">
                {expense?.reference || "EXP-001"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                expense?.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : expense?.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : expense?.status === "overdue"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {expense?.status
                ? expense.status.charAt(0).toUpperCase() +
                  expense.status.slice(1)
                : "Pending"}
            </span>
          </div>

          {/* Vendor */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Vendor</span>
            <span className="text-sm font-medium text-gray-900">
              {expense?.vendor || "Office Supplies Ltd"}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Category</span>
            <span className="text-sm font-medium text-gray-900">
              {expense?.category || "Office Supplies"}
            </span>
          </div>

          {/* Amount */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Amount</span>
            <span className="text-lg font-semibold text-[#41B63E]">
              {expense?.amount || "₦25,000.00"}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm font-medium text-gray-900">
              {expense?.date || "21/06/2024"}
            </span>
          </div>

          {/* Payment Method */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Payment Method</span>
            <span className="text-sm font-medium text-gray-900">
              {expense?.paymentMethod || "Bank Transfer"}
            </span>
          </div>

          {/* Description */}
          {expense?.description && (
            <div className="pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500 block mb-2">
                Description
              </span>
              <p className="text-sm text-gray-700">{expense.description}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="grid grid-cols-4 gap-2">
            <button className="flex flex-col items-center gap-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Edit className="w-5 h-5" />
              <span className="text-xs">Edit</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="w-5 h-5" />
              <span className="text-xs">Download</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Printer className="w-5 h-5" />
              <span className="text-xs">Print</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-5 h-5" />
              <span className="text-xs">Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
