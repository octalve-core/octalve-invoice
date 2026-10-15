"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import QuotationFilterModal, {
  FilterState,
} from "@/components/dashboard/modals/QuotationFilterModal";
import QuotationActionsModal from "@/components/dashboard/modals/QuotationActionsModal";

interface QuotationItem {
  id: string;
  reference: string;
  clientName: string;
  amount: string;
  dateCreated: string;
  dateDue: string;
  email: string;
  status: "paid" | "pending" | "draft" | "overdue" | "sent" | "declined";
}

const quotations: QuotationItem[] = [
  {
    id: "1",
    reference: "FZ-000HYV",
    clientName: "Abdulsamad Ojedokun",
    amount: "₦920,000.00",
    dateCreated: "21-22347",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "pending",
  },
  {
    id: "2",
    reference: "FZ-000HVV",
    clientName: "Weypoint Energy",
    amount: "₦120,000.00",
    dateCreated: "21-22347",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "sent",
  },
  {
    id: "3",
    reference: "FZ-000HRV",
    clientName: "Rhocwoods Ltd",
    amount: "₦620,000.00",
    dateCreated: "21-22347",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "paid",
  },
  {
    id: "4",
    reference: "FZ-000H11",
    clientName: "Abdulsamad Ojedokun",
    amount: "₦920,649.00",
    dateCreated: "21-22347",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "pending",
  },
];

interface MobileQuotationListProps {
  onCreateClick?: () => void;
  onQuotationClick?: (quotation: QuotationItem) => void;
}

export default function MobileQuotationList({
  onCreateClick,
  onQuotationClick,
}: MobileQuotationListProps) {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] =
    useState<QuotationItem | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-06",
    status: "All",
  });

  const filters = ["All", "Paid", "Draft", "Sent", "Pending", "Declined"];

  const filteredQuotations = quotations.filter((q) => {
    const statusToMatch =
      appliedFilters.status !== "All" ? appliedFilters.status : filter;
    const matchesFilter =
      statusToMatch === "All" ||
      q.status.toLowerCase() === statusToMatch.toLowerCase();
    const matchesSearch =
      q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    if (newFilters.status !== "All") {
      setFilter(newFilters.status);
    }
  };

  const handleQuotationMenuClick = (
    quotation: QuotationItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedQuotation(quotation);
    setIsActionsModalOpen(true);
  };

  // Empty state
  if (quotations.length === 0) {
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
            <h1 className="font-semibold text-gray-900">Quotation</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FileSpreadsheet className="w-12 h-12 text-[#41B63E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Quotation Yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            There&apos;s no quotation for you. Add a quotation to help you keep
            track of your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Quotation
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
            <h1 className="font-semibold text-gray-900">Quotation</h1>
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
          Create quotation
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

      {/* Quotation List */}
      <div className="px-4 py-4 space-y-3">
        {filteredQuotations.length > 0 ? (
          filteredQuotations.map((quotation) => (
            <div
              key={quotation.id}
              onClick={() => onQuotationClick?.(quotation)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-[#41B63E]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {quotation.clientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {quotation.reference}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleQuotationMenuClick(quotation, e)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">
                  {quotation.amount}
                </p>
                <StatusBadge status={quotation.status} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No quotations found</p>
          </div>
        )}
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-20"></div>

      {/* Filter Modal */}
      <QuotationFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />

      {/* Actions Modal */}
      <QuotationActionsModal
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        quotation={
          selectedQuotation
            ? { reference: selectedQuotation.reference }
            : undefined
        }
        onView={() =>
          selectedQuotation && onQuotationClick?.(selectedQuotation)
        }
        onEdit={() => console.log("Edit quotation")}
        onSend={() => console.log("Send quotation")}
        onDuplicate={() => console.log("Duplicate quotation")}
        onDelete={() => console.log("Delete quotation")}
      />
    </div>
  );
}
