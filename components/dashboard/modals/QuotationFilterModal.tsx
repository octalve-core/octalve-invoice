"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  status: string;
}

interface QuotationFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
}

export default function QuotationFilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}: QuotationFilterModalProps) {
  const [filters, setFilters] = useState<FilterState>(currentFilters);
  const [statusFilters, setStatusFilters] = useState({
    paid: false,
    pending: false,
    declined: false,
    draft: false,
  });

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleApply = () => {
    // Determine status from checkboxes
    const activeStatuses = Object.entries(statusFilters)
      .filter(([, checked]) => checked)
      .map(([status]) => status);

    const status =
      activeStatuses.length === 1
        ? activeStatuses[0].charAt(0).toUpperCase() + activeStatuses[0].slice(1)
        : "All";

    onApply({ ...filters, status });
    onClose();
  };

  const handleReset = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      status: "All",
    });
    setStatusFilters({
      paid: false,
      pending: false,
      declined: false,
      draft: false,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center lg:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md mx-4 rounded-xl shadow-xl lg:mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg -mr-2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Time Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <div className="relative">
              <select className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]">
                <option>Last 30 days</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
                <option>Custom</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) =>
                  setFilters({ ...filters, dateFrom: e.target.value })
                }
                className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) =>
                  setFilters({ ...filters, dateTo: e.target.value })
                }
                className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
              />
            </div>
          </div>

          {/* Filter by Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Filter by Status
            </label>
            <div className="space-y-3">
              {[
                { key: "paid", label: "Paid" },
                { key: "pending", label: "Pending" },
                { key: "declined", label: "Declined" },
                { key: "draft", label: "Draft" },
              ].map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={statusFilters[key as keyof typeof statusFilters]}
                    onChange={(e) =>
                      setStatusFilters({
                        ...statusFilters,
                        [key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#41B63E] border-gray-300 rounded focus:ring-[#41B63E]"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleApply}
            className="w-full py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}
