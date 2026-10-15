"use client";

import { useState } from "react";
import {
  Search,
  Download,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Send,
  Copy,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import QuotationFilterModal, {
  FilterState,
} from "@/components/dashboard/modals/QuotationFilterModal";

interface Quotation {
  id: string;
  reference: string;
  clientName: string;
  amount: string;
  dateCreated: string;
  dateDue: string;
  email: string;
  status: "paid" | "pending" | "draft" | "overdue" | "sent" | "declined";
}

const quotations: Quotation[] = [
  {
    id: "1",
    reference: "FZ-000HYV",
    clientName: "Olamide Israel",
    amount: "₦255,090.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "pending",
  },
  {
    id: "2",
    reference: "FZ-000HVV",
    clientName: "Olamide Israel",
    amount: "₦125,000.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "sent",
  },
  {
    id: "3",
    reference: "FZ-000HRV",
    clientName: "Olamide Israel",
    amount: "₦500,090.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "paid",
  },
  {
    id: "4",
    reference: "FZ-000H11",
    clientName: "Olamide Israel",
    amount: "₦352,090.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "pending",
  },
  {
    id: "5",
    reference: "FZ-000H44",
    clientName: "Olamide Israel",
    amount: "₦125,000.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "draft",
  },
  {
    id: "6",
    reference: "FZ-000H55",
    clientName: "Olamide Israel",
    amount: "₦452,000.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "declined",
  },
  {
    id: "7",
    reference: "FZ-000H66",
    clientName: "Olamide Israel",
    amount: "₦103,090.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "paid",
  },
  {
    id: "8",
    reference: "FZ-000H77",
    clientName: "Olamide Israel",
    amount: "₦452,000.00",
    dateCreated: "21/6/2024",
    dateDue: "21/7/2024",
    email: "samuelayodade@gmail.com",
    status: "sent",
  },
];

interface QuotationTableProps {
  onCreateClick?: () => void;
  onViewClick?: (quotation: Quotation) => void;
}

export default function QuotationTable({
  onCreateClick,
  onViewClick,
}: QuotationTableProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-06",
    status: "All",
  });

  const filters = ["All", "Paid", "Overdue", "Draft", "Sent", "Declined"];

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    if (newFilters.status !== "All") {
      setActiveFilter(newFilters.status);
    }
  };

  const filteredQuotations = quotations.filter((quotation) => {
    const matchesFilter =
      activeFilter === "All" ||
      quotation.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      quotation.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-5 pt-5 pb-4 border-b border-gray-100">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
              activeFilter === filter
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {filteredQuotations.length} Quotation
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Query k"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-4 h-4" />
            Create quotation
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredQuotations.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID Number
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Client Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Created
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date Due
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuotations.map((quotation) => (
                <tr key={quotation.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[#41B63E]">
                      {quotation.reference}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-900">
                      {quotation.clientName}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[#41B63E]">
                      {quotation.amount}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {quotation.dateCreated}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {quotation.dateDue}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {quotation.email}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={quotation.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === quotation.id ? null : quotation.id
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {openMenuId === quotation.id && (
                        <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                          <button
                            onClick={() => {
                              onViewClick?.(quotation);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                            View Quotation
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Edit className="w-4 h-4" />
                            Edit Quotation
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Send className="w-4 h-4" />
                            Send Quotation
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#41B63E]"
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
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Quotation Yet
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            There&apos;s no quotation for you.
            <br />
            Add a quotation to help you keep track of your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Quotation
          </button>
        </div>
      )}

      {/* Filter Modal */}
      <QuotationFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
}
