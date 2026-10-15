"use client";

import { useState } from "react";
import { ArrowLeft, MoreVertical, Edit, Trash2, FileText } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface MobileCustomerDetailsProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdDate: string;
    company?: string;
    amountDue?: string;
  };
  onBack: () => void;
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

export default function MobileCustomerDetails({
  customer,
  onBack,
  onEdit,
  onDelete,
}: MobileCustomerDetailsProps) {
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

  return (
    <div className="lg:hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="font-semibold text-gray-900">Customer Details</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
            {isActionMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                <button
                  onClick={() => {
                    onEdit?.();
                    setIsActionMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit Customer
                </button>
                <button
                  onClick={() => {
                    // Handle bill customer
                    setIsActionMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" />
                  Bill Customer
                </button>
                <button
                  onClick={() => {
                    onDelete?.();
                    setIsActionMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Customer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-xl">
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {customer.name}
            </h2>
            <p className="text-sm text-gray-500">{customer.email}</p>
            <p className="text-sm text-gray-500">{customer.phone}</p>
            {customer.company && (
              <p className="text-xs text-gray-400 mt-1">{customer.company}</p>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Created: {customer.createdDate}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 px-4 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 text-center">
          <p className="text-xs text-gray-500 mb-1">Total Amount</p>
          <p className="text-sm font-bold text-gray-900">₦1,220,000</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-100 p-3 text-center">
          <p className="text-xs text-yellow-600 mb-1">Total Pending</p>
          <p className="text-sm font-bold text-yellow-700">₦20,600</p>
        </div>
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-3 text-center">
          <p className="text-xs text-green-600 mb-1">Total Paid</p>
          <p className="text-sm font-bold text-green-700">₦1,200,000</p>
        </div>
      </div>

      {/* History Section */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">History</h3>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 -mx-4 px-4">
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
        <div className="space-y-3 pb-24">
          {filteredHistory.length > 0 ? (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-start gap-3">
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
                      <span className="font-bold text-gray-900">
                        {item.amount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      CUS: {item.customer}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>Created: {item.createdDate}</span>
                        <span>Due: {item.dueDate}</span>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm">
              No history found for this filter
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
