"use client";

import { useState } from "react";
import { X, Calendar } from "lucide-react";

interface CustomerFilterModalProps {
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

export default function CustomerFilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}: CustomerFilterModalProps) {
  const [dateFrom, setDateFrom] = useState(
    currentFilters?.dateFrom || "2024-01-01"
  );
  const [dateTo, setDateTo] = useState(currentFilters?.dateTo || "2024-12-06");
  const [status, setStatus] = useState(currentFilters?.status || "All");

  const statusOptions = ["All", "Active", "Inactive"];

  const handleApply = () => {
    onApply({ dateFrom, dateTo, status });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[440px] min-w-0 max-h-[min(85dvh,650px)] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="min-w-0 overflow-y-auto p-4 sm:p-6">
          {/* Filter by Date */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 text-center mb-4">
              Filter by date
            </h3>
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-end">
              <div className="min-w-0">
                <label className="block text-sm text-gray-500 mb-1">From</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="min-w-0 w-full h-11 px-3 pr-8 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0]"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <span className="hidden text-gray-400 sm:block">—</span>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">To</label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20 focus:border-[#0064E0]"
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
                  <span className="text-sm font-medium text-gray-900">
                    {option}
                  </span>
                  <input
                    type="radio"
                    name="status"
                    value={option}
                    checked={status === option}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-5 h-5 text-[#0064E0] focus:ring-[#0064E0] accent-[#0064E0]"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-sm font-medium text-[#0064E0] bg-white border border-[#0064E0] rounded-lg hover:bg-blue-50"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3 text-sm font-medium text-white bg-[#0064E0] rounded-lg hover:bg-[#0052B8]"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
