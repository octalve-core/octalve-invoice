"use client";

import { useState } from "react";
import { X, MoreVertical, Edit, Trash2 } from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface CustomerDetailsPanelProps {
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdDate: string;
  };
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

interface HistoryItem {
  id: string;
  reference: string;
  customer: string;
  amount: string;
  createdDate: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue" | "draft";
  type: string;
}

const historyItems: HistoryItem[] = [
  {
    id: "1",
    reference: "FZ-001INV",
    customer: "Abdulsamad Opabode",
    amount: "₦120,000.00",
    createdDate: "12/6/2024",
    dueDate: "21/6/2024",
    status: "pending",
    type: "invoice",
  },
  {
    id: "2",
    reference: "FZ-001EXP",
    customer: "Weypoint Energy",
    amount: "₦120,000.00",
    createdDate: "12/6/2024",
    dueDate: "21/6/2024",
    status: "overdue",
    type: "expense",
  },
  {
    id: "3",
    reference: "FZ-001QOU",
    customer: "Olamide Ismail",
    amount: "₦120,000.00",
    createdDate: "12/6/2024",
    dueDate: "21/6/2024",
    status: "paid",
    type: "quotation",
  },
  {
    id: "4",
    reference: "FZ-001QOU",
    customer: "Olamide Ismail",
    amount: "₦120,000.00",
    createdDate: "12/6/2024",
    dueDate: "21/6/2024",
    status: "draft",
    type: "quotation",
  },
];

export default function CustomerDetailsPanel({
  customer,
  onClose,
  onEdit,
  onDelete,
}: CustomerDetailsPanelProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const filters = [
    "All",
    "Invoice",
    "Expense",
    "Receipt",
    "Quotation",
    "Refund Receipt",
  ];

  const filteredHistory = historyItems.filter((item) => {
    if (activeFilter === "All") return true;
    return item.type.toLowerCase() === activeFilter.toLowerCase();
  });

  if (!customer) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p className="text-sm">Select a customer to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full overflow-hidden flex flex-col">
      {/* Customer Info */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {customer.name}
            </h2>
            <p className="text-sm text-gray-500">{customer.email}</p>
            <p className="text-sm text-gray-500">{customer.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              Created: {customer.createdDate}
            </span>

            {/* Action Menu */}
            <div className="relative">
              <button
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {isActionMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                  <button
                    onClick={() => {
                      onEdit?.();
                      setIsActionMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Customer
                  </button>
                  <button
                    onClick={() => {
                      onDelete?.();
                      setIsActionMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Customer
                  </button>
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
            <p className="text-sm font-semibold text-gray-900">₦1,220,000</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <p className="text-xs text-yellow-600 mb-1">Total Pending</p>
            <p className="text-sm font-semibold text-yellow-700">₦20,600</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600 mb-1">Total Paid</p>
            <p className="text-sm font-semibold text-green-700">₦1,200,000</p>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="px-6 py-4 flex-1 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">History</h3>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 flex-shrink-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-[#41B63E] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-[#41B63E]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 text-sm">
                      {item.reference}
                    </span>
                    <span className="font-semibold text-gray-900 text-sm">
                      {item.amount}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    CUS: {item.customer}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      Created: {item.createdDate}
                    </span>
                    <span className="text-xs text-gray-400">
                      Due: {item.dueDate}
                    </span>
                  </div>
                </div>
                <StatusBadge status={item.status} />
                <button className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No history found for this filter
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
