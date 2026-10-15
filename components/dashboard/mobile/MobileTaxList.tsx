"use client";

import { useState } from "react";
import { ArrowLeft, Plus, ChevronRight, Percent, FileText } from "lucide-react";
import Link from "next/link";

interface Tax {
  id: string;
  name: string;
  rate: number;
}

const taxes: Tax[] = [
  { id: "1", name: "VAT", rate: 7.5 },
  { id: "2", name: "Service Tax", rate: 5 },
  { id: "3", name: "GST Tax", rate: 5.5 },
  { id: "4", name: "WHT Tax", rate: 7.6 },
];

interface MobileTaxListProps {
  onCreateClick?: () => void;
  onTaxClick?: (tax: Tax) => void;
  onViewRatesClick?: () => void;
  onSettingsClick?: () => void;
}

export default function MobileTaxList({
  onCreateClick,
  onTaxClick,
  onViewRatesClick,
  onSettingsClick,
}: MobileTaxListProps) {
  const [isEmpty] = useState(taxes.length === 0);

  if (isEmpty) {
    return (
      <div className="lg:hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-semibold text-gray-900">Taxes</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <FileText className="w-12 h-12 text-[#41B63E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            There are no entries on your list
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            Add tax rates to apply them automatically to your invoices and
            quotes
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Tax
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="font-semibold text-gray-900">Taxes</h1>
        </div>
        <span className="text-sm text-gray-500">Taxes Rate</span>
      </div>

      {/* Taxes Section */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Taxes</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          <button
            onClick={onViewRatesClick}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Percent className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Tax Rates</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={onSettingsClick}
            className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">Tax Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* All Taxes List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700">All Taxes</h2>
          <span className="text-sm text-gray-500">Tax Rates</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {taxes.map((tax) => (
            <button
              key={tax.id}
              onClick={() => onTaxClick?.(tax)}
              className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{tax.name}</span>
              <span className="text-sm text-gray-600">{tax.rate} %</span>
            </button>
          ))}
        </div>
      </div>

      {/* Create Button */}
      <button
        onClick={onCreateClick}
        className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-[#41B63E] bg-green-50 rounded-lg hover:bg-green-100"
      >
        <Plus className="w-5 h-5" />
        Create Tax
      </button>
    </div>
  );
}
