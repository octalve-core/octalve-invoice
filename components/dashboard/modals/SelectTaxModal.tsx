"use client";

import { useState } from "react";
import { X, Check, Info } from "lucide-react";

interface Tax {
  id: string;
  name: string;
  rate: number;
}

const availableTaxes: Tax[] = [
  { id: "1", name: "VAT", rate: 7.5 },
  { id: "2", name: "Service Tax", rate: 5 },
  { id: "3", name: "GST Tax", rate: 5.5 },
  { id: "4", name: "WHT Tax", rate: 7.6 },
];

interface SelectTaxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (taxes: Tax[]) => void;
  selectedTaxes?: Tax[];
}

export default function SelectTaxModal({
  isOpen,
  onClose,
  onSelect,
  selectedTaxes = [],
}: SelectTaxModalProps) {
  const [selected, setSelected] = useState<string[]>(
    selectedTaxes.map((t) => t.id)
  );

  const toggleTax = (taxId: string) => {
    setSelected((prev) =>
      prev.includes(taxId)
        ? prev.filter((id) => id !== taxId)
        : [...prev, taxId]
    );
  };

  const handleConfirm = () => {
    const taxes = availableTaxes.filter((t) => selected.includes(t.id));
    onSelect(taxes);
    onClose();
  };

  const totalRate = availableTaxes
    .filter((t) => selected.includes(t.id))
    .reduce((sum, t) => sum + t.rate, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Tax / Selection
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="mx-6 mt-4 p-3 bg-green-50 rounded-lg flex items-start gap-2">
          <Info className="w-5 h-5 text-[#41B63E] mt-0.5" />
          <p className="text-sm text-gray-600">
            Select one or more taxes to apply to this invoice
          </p>
        </div>

        {/* Tax List */}
        <div className="p-6 space-y-3">
          {availableTaxes.map((tax) => (
            <label
              key={tax.id}
              className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors ${
                selected.includes(tax.id)
                  ? "border-[#41B63E] bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selected.includes(tax.id)
                      ? "bg-[#41B63E] border-[#41B63E]"
                      : "border-gray-300"
                  }`}
                >
                  {selected.includes(tax.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="font-medium text-gray-900">{tax.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {tax.rate}%
              </span>
            </label>
          ))}
        </div>

        {/* Total */}
        {selected.length > 0 && (
          <div className="mx-6 mb-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Tax Rate</span>
              <span className="font-semibold text-gray-900">
                {totalRate.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
