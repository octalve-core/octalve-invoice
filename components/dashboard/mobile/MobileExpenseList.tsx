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
import ExpensesFilterModal, {
  FilterState,
} from "@/components/dashboard/modals/ExpensesFilterModal";
import ExpenseActionsModal from "@/components/dashboard/modals/ExpenseActionsModal";

interface ExpenseItem {
  id: string;
  reference: string;
  vendor: string;
  category: string;
  amount: string;
  date: string;
  status: "paid" | "pending" | "draft" | "overdue" | "refunded";
}

const expenses: ExpenseItem[] = [
  {
    id: "1",
    reference: "EXP-001HYV",
    vendor: "Office Supplies Ltd",
    category: "Office Supplies",
    amount: "₦25,000.00",
    date: "21/6/2024",
    status: "paid",
  },
  {
    id: "2",
    reference: "EXP-002HVV",
    vendor: "MTN Nigeria",
    category: "Utilities",
    amount: "₦15,000.00",
    date: "21/6/2024",
    status: "paid",
  },
  {
    id: "3",
    reference: "EXP-003HRV",
    vendor: "Lagos Electricity",
    category: "Utilities",
    amount: "₦50,000.00",
    date: "21/6/2024",
    status: "pending",
  },
  {
    id: "4",
    reference: "EXP-004H11",
    vendor: "Uber for Business",
    category: "Transportation",
    amount: "₦35,000.00",
    date: "21/6/2024",
    status: "paid",
  },
  {
    id: "5",
    reference: "EXP-005H44",
    vendor: "Amazon Web Services",
    category: "Software",
    amount: "₦125,000.00",
    date: "21/6/2024",
    status: "draft",
  },
  {
    id: "6",
    reference: "EXP-006H55",
    vendor: "Rent - Victoria Island",
    category: "Rent",
    amount: "₦450,000.00",
    date: "21/6/2024",
    status: "overdue",
  },
];

interface MobileExpenseListProps {
  onCreateClick?: () => void;
  onExpenseClick?: (expense: ExpenseItem) => void;
  showEmptyState?: boolean;
}

export default function MobileExpenseList({
  onCreateClick,
  onExpenseClick,
  showEmptyState = false,
}: MobileExpenseListProps) {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(
    null
  );
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-06",
    status: "All",
  });

  const filters = ["All", "Paid", "Draft", "Pending", "Overdue", "Recurring"];

  const dataToShow = showEmptyState ? [] : expenses;

  const filteredExpenses = dataToShow.filter((e) => {
    const statusToMatch =
      appliedFilters.status !== "All" ? appliedFilters.status : filter;
    const matchesFilter =
      statusToMatch === "All" ||
      e.status.toLowerCase() === statusToMatch.toLowerCase();
    const matchesSearch =
      e.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
    if (newFilters.status !== "All") {
      setFilter(newFilters.status);
    }
  };

  const handleExpenseMenuClick = (
    expense: ExpenseItem,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedExpense(expense);
    setIsActionsModalOpen(true);
  };

  // Empty state
  if (dataToShow.length === 0) {
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
            <h1 className="font-semibold text-gray-900">Expenses</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="w-12 h-12 text-[#41B63E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Expenses Yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            There&apos;s no expense for you. Add an expense to help you keep
            track of your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Expenses
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
            <h1 className="font-semibold text-gray-900">Expenses</h1>
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
          Create Expenses
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

      {/* Expense List */}
      <div className="px-4 py-4 space-y-3">
        {filteredExpenses.length > 0 ? (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              onClick={() => onExpenseClick?.(expense)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Receipt className="w-5 h-5 text-[#41B63E]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {expense.vendor}
                    </p>
                    <p className="text-xs text-gray-500">
                      {expense.reference} • {expense.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleExpenseMenuClick(expense, e)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-900">{expense.amount}</p>
                <StatusBadge status={expense.status} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No expenses found</p>
          </div>
        )}
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-20"></div>

      {/* Filter Modal */}
      <ExpensesFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />

      {/* Actions Modal */}
      <ExpenseActionsModal
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        expense={
          selectedExpense
            ? {
                reference: selectedExpense.reference,
                vendor: selectedExpense.vendor,
              }
            : undefined
        }
        onView={() => selectedExpense && onExpenseClick?.(selectedExpense)}
        onEdit={() => console.log("Edit expense")}
        onDuplicate={() => console.log("Duplicate expense")}
        onDelete={() => console.log("Delete expense")}
        onMarkRecurring={() => console.log("Set as recurring")}
      />
    </div>
  );
}
