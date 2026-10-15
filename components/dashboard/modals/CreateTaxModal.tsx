"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface CreateTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaxData) => void;
}

interface TaxData {
  name: string;
  rate: number;
  type: "percentage" | "fixed";
}

export default function CreateTaxModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaxModalProps) {
  const [formData, setFormData] = useState<TaxData>({
    name: "",
    rate: 0,
    type: "percentage",
  });

  const handleSubmit = () => {
    onSubmit(formData);
    setFormData({ name: "", rate: 0, type: "percentage" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Tax</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Tax Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Tax Name <span className="text-red-500">*</span>
            </p>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VAT"
              className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>

          {/* Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate (%) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="7.5"
                step="0.1"
                className="w-full h-11 px-4 pr-12 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || formData.rate <= 0}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
