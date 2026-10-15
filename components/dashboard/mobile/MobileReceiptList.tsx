"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Receipt,
  FileText,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import ReceiptFilterModal, {
  FilterState,
} from "@/components/dashboard/modals/ReceiptFilterModal";
import ReceiptActionsModal from "@/components/dashboard/modals/ReceiptActionsModal";

interface ReceiptItem {
  id: string;
  reference: string;
  customerTo: string;
  amount: string;
  date: string;
  status: "paid" | "pending" | "draft" | "overdue" | "refunded" | "sent";
}

const receipts: ReceiptItem[] = [
  {
    id: "1",
    reference: "FZ-000HYV",
    customerTo: "Olamide Israel",
    amount: "₦20,000.00",
    date: "21-22347",
    status: "pending",
  },
  {
    id: "2",
    reference: "FZ-000HVV",
    customerTo: "Abdulsamad Ojedokun",
    amount: "₦120,000.00",
    date: "21-22347",
    status: "paid",
  },
  {
    id: "3",
    reference: "FZ-000HRV",
    customerTo: "Weypoint Energy",
    amount: "₦430,000.00",
    date: "21-22347",
    status: "refunded",
  },
  {
    id: "4",
    reference: "FZ-000H11",
    customerTo: "Rhocwoods Ltd",
    amount: "₦450,000.00",
    date: "21-22347",
    status: "draft",
  },
  {
    id: "5",
    reference: "FZ-000H44",
    customerTo: "Lavicwoods",
    amount: "₦200,000.00",
    date: "21-22347",
    status: "sent",
  },
  {
    id: "6",
    reference: "FZ-000H55",
    customerTo: "Abdulsamad Ojedokun",
    amount: "₦350,000.00",
    date: "21-22347",
    status: "paid",
  },
  {
    id: "7",
    reference: "FZ-000H66",
    customerTo: "Weypoint Energy",
    amount: "₦175,000.00",
    date: "21-22347",
    status: "pending",
  },
];

interface MobileReceiptListProps {
  onCreateClick?: () => void;
  onReceiptClick?: (receipt: ReceiptItem) => void;
}

export default function MobileReceiptList({
  onCreateClick,
  onReceiptClick,
}: MobileReceiptListProps) {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(
    null
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-06",
    status: "All",
  });

  const filters = ["All", "Paid", "Draft", "Sent", "Refunded", "Pending"];

  const filteredReceipts = receipts.filter((r) => {
    // Apply status from filter modal if not "All"
    const statusToMatch =
      appliedFilters.status !== "All" ? appliedFilters.status : filter;
    const matchesFilter =
      statusToMatch === "All" ||
      r.status.toLowerCase() === statusToMatch.toLowerCase();
    const matchesSearch =
      r.customerTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    if (newFilters.status !== "All") {
      setFilter(newFilters.status);
    }
  };

  const handleReceiptMenuClick = (
    receipt: ReceiptItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedReceipt(receipt);
    setIsActionsModalOpen(true);
  };

  // Empty state
  if (receipts.length === 0) {
    return (
      <div className="lg:hidden min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-semibold text-gray-900">Receipt</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="w-12 h-12 text-[#41B63E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Receipt Yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            There&apos;s no receipt for you. Add a receipt to help you keep
            track of your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Receipt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-semibold text-gray-900">Receipt</h1>
          </div>
        </div>

        {/* Search Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-sm bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20"
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
        >
          <Plus className="w-5 h-5" />
          Create Receipt
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-[#41B63E] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Receipt List */}
      <div className="px-4 py-4 space-y-3">
        {filteredReceipts.length > 0 ? (
          filteredReceipts.map((receipt) => (
            <div
              key={receipt.id}
              onClick={() => onReceiptClick?.(receipt)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-[#41B63E]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {receipt.customerTo}
                    </p>
                    <p className="text-xs text-gray-500">{receipt.reference}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleReceiptMenuClick(receipt, e)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">{receipt.amount}</p>
                <StatusBadge status={receipt.status} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No receipts found</p>
          </div>
        )}
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-20"></div>

      {/* Filter Modal */}
      <ReceiptFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />

      {/* Actions Modal */}
      <ReceiptActionsModal
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        receipt={
          selectedReceipt ? { reference: selectedReceipt.reference } : undefined
        }
        onView={() => selectedReceipt && onReceiptClick?.(selectedReceipt)}
        onEdit={() => console.log("Edit receipt")}
        onSend={() => console.log("Send receipt")}
        onDuplicate={() => console.log("Duplicate receipt")}
        onDelete={() => console.log("Delete receipt")}
        onMarkRefunded={() => console.log("Mark as refunded")}
      />
    </div>
  );
}
