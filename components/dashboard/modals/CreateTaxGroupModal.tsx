"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface CreateTaxGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaxGroupData) => void;
}

interface TaxGroupData {
  name: string;
  taxes: string[];
}

const availableTaxes = [
  { id: "1", name: "VAT (7.5%)", rate: 7.5 },
  { id: "2", name: "Service Tax (5%)", rate: 5 },
  { id: "3", name: "GST Tax (5.5%)", rate: 5.5 },
  { id: "4", name: "WHT Tax (7.6%)", rate: 7.6 },
];

export default function CreateTaxGroupModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateTaxGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedTaxes, setSelectedTaxes] = useState<string[]>([]);

  const toggleTax = (taxId: string) => {
    setSelectedTaxes((prev) =>
      prev.includes(taxId)
        ? prev.filter((id) => id !== taxId)
        : [...prev, taxId]
    );
  };

  const handleSubmit = () => {
    onSubmit({ name: groupName, taxes: selectedTaxes });
    setGroupName("");
    setSelectedTaxes([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Tax Group</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Tax
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Tax Combination <span className="text-red-500">*</span>
            </p>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. Standard VAT + Service"
              className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>

          {/* Select Taxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Taxes to Include
            </label>
            <div className="space-y-2">
              {availableTaxes.map((tax) => (
                <label
                  key={tax.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedTaxes.includes(tax.id)
                      ? "border-[#41B63E] bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedTaxes.includes(tax.id)}
                      onChange={() => toggleTax(tax.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {tax.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Selected Summary */}
          {selectedTaxes.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                Total Combined Rate:{" "}
                <span className="font-semibold text-gray-900">
                  {availableTaxes
                    .filter((t) => selectedTaxes.includes(t.id))
                    .reduce((sum, t) => sum + t.rate, 0)
                    .toFixed(1)}
                  %
                </span>
              </p>
            </div>
          )}
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
            disabled={!groupName || selectedTaxes.length === 0}
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
