"use client";

import { useState } from "react";
import { X, Calendar } from "lucide-react";

interface ExpensesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters?: FilterState;
}

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  status: string;
}

export default function ExpensesFilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}: ExpensesFilterModalProps) {
  const [dateFrom, setDateFrom] = useState(
    currentFilters?.dateFrom || "2024-01-01"
  );
  const [dateTo, setDateTo] = useState(currentFilters?.dateTo || "2024-12-06");
  const [status, setStatus] = useState(currentFilters?.status || "All");

  const statusOptions = ["All", "Draft", "Paid", "Refunded", "Overdue"];

  const handleApply = () => {
    onApply({ dateFrom, dateTo, status });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white w-full lg:w-96 lg:rounded-xl rounded-t-2xl shadow-xl animate-in slide-in-from-bottom lg:slide-in-from-bottom-0 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Desktop only */}
        <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Filter by Date */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 text-center mb-4">
              Filter by date
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">From</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <span className="text-gray-400 mt-6">—</span>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">To</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter by Status */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 text-center mb-4">
              Filter by Status
            </h3>
            <div className="space-y-3">
              {statusOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-md ${
                      option === "Draft"
                        ? "text-gray-600 bg-gray-100"
                        : option === "Paid"
                        ? "text-green-600 bg-green-50"
                        : option === "Refunded"
                        ? "text-red-600 bg-red-50"
                        : option === "Overdue"
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-900"
                    }`}
                  >
                    {option}
                  </span>
                  <input
                    type="radio"
                    name="status"
                    value={option}
                    checked={status === option}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-5 h-5 text-[#41B63E] focus:ring-[#41B63E] accent-[#41B63E]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm font-medium text-[#41B63E] bg-white border border-[#41B63E] rounded-lg hover:bg-green-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
