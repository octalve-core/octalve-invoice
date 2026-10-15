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
  Copy,
  Trash2,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";
import ExpensesFilterModal, {
  FilterState,
} from "@/components/dashboard/modals/ExpensesFilterModal";

interface Expense {
  id: string;
  reference: string;
  vendor: string;
  category: string;
  amount: string;
  dateCreated: string;
  paymentMethod: string;
  status: "paid" | "pending" | "draft" | "overdue" | "refunded";
}

const expenses: Expense[] = [
  {
    id: "1",
    reference: "EXP-001HYV",
    vendor: "Office Supplies Ltd",
    category: "Office Supplies",
    amount: "₦25,000.00",
    dateCreated: "21/6/2024",
    paymentMethod: "Bank Transfer",
    status: "paid",
  },
  {
    id: "2",
    reference: "EXP-002HVV",
    vendor: "MTN Nigeria",
    category: "Utilities",
    amount: "₦15,000.00",
    dateCreated: "21/6/2024",
    paymentMethod: "Card",
    status: "paid",
  },
  {
    id: "3",
    reference: "EXP-003HRV",
    vendor: "Lagos Electricity",
    category: "Utilities",
    amount: "₦50,000.00",
    dateCreated: "21/6/2024",
    paymentMethod: "Bank Transfer",
    status: "pending",
  },
  {
    id: "4",
    reference: "EXP-004H11",
    vendor: "Uber for Business",
    category: "Transportation",
    amount: "₦35,000.00",
    dateCreated: "21/6/2024",
    paymentMethod: "Card",
    status: "paid",
  },
  {
    id: "5",
    reference: "EXP-005H44",
    vendor: "Amazon Web Services",
    category: "Software",
    amount: "₦125,000.00",
    dateCreated: "21/6/2024",
    paymentMethod: "Card",
    status: "draft",
  },
  {
    id: "6",
    reference: "EXP-006H55",
    vendor: "Rent - Victoria Island",
    category: "Rent",
    amount: "₦450,000.00",
    dateCreated: "21/6/2024",
    paymentMethod: "Bank Transfer",
    status: "overdue",
  },
];

interface ExpensesTableProps {
  onCreateClick?: () => void;
  onViewClick?: (expense: Expense) => void;
  showEmptyState?: boolean;
}

export default function ExpensesTable({
  onCreateClick,
  onViewClick,
  showEmptyState = false,
}: ExpensesTableProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-06",
    status: "All",
  });

  const filters = ["All", "Paid", "Overdue", "Draft", "Refunded", "Recurring"];

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    if (newFilters.status !== "All") {
      setActiveFilter(newFilters.status);
    }
  };

  const dataToShow = showEmptyState ? [] : expenses;

  const filteredExpenses = dataToShow.filter((expense) => {
    const matchesFilter =
      activeFilter === "All" ||
      expense.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      expense.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
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
            {filteredExpenses.length} Expense
            {filteredExpenses.length !== 1 ? "s" : ""}
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
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
            Create Expenses
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredExpenses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reference
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Vendor
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Method
                </th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-[#41B63E]">
                      {expense.reference}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-900">
                      {expense.vendor}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {expense.amount}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {expense.dateCreated}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-600">
                      {expense.paymentMethod}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={expense.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId === expense.id ? null : expense.id
                          )
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      {openMenuId === expense.id && (
                        <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                          <button
                            onClick={() => {
                              onViewClick?.(expense);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Eye className="w-4 h-4" />
                            View Expense
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Edit className="w-4 h-4" />
                            Edit Expense
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
            No Expenses Yet
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            There&apos;s no expense for you.
            <br />
            Add an expense to help you keep track of your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Expenses
          </button>
        </div>
      )}

      {/* Filter Modal */}
      <ExpensesFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
}
