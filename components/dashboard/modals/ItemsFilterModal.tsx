"use client";

import { X, ChevronDown } from "lucide-react";

export interface ItemFilterState {
  category: string;
  type: string;
  priceFrom: string;
  priceTo: string;
}

const categories = [
  "All",
  "Phone",
  "Accessories",
  "Laptop",
  "Hairphone",
  "Electronics",
  "Services",
  "Other",
];

const types = ["All", "Goods", "Service"];

interface ItemsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ItemFilterState) => void;
  currentFilters: ItemFilterState;
}

export default function ItemsFilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}: ItemsFilterModalProps) {
  const handleApply = () => {
    onApply(currentFilters);
    onClose();
  };

  const handleReset = () => {
    onApply({
      category: "All",
      type: "All",
      priceFrom: "",
      priceTo: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Filter Items</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <select
                value={currentFilters.category}
                onChange={(e) =>
                  onApply({ ...currentFilters, category: e.target.value })
                }
                className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="relative">
              <select
                value={currentFilters.type}
                onChange={(e) =>
                  onApply({ ...currentFilters, type: e.target.value })
                }
                className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="From"
                value={currentFilters.priceFrom}
                onChange={(e) =>
                  onApply({ ...currentFilters, priceFrom: e.target.value })
                }
                className="flex-1 h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
              />
              <span className="text-gray-400">-</span>
              <input
                type="text"
                placeholder="To"
                value={currentFilters.priceTo}
                onChange={(e) =>
                  onApply({ ...currentFilters, priceTo: e.target.value })
                }
                className="flex-1 h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}
