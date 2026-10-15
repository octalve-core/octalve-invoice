"use client";

import { useState } from "react";
import { Plus, ChevronRight, Settings, Percent } from "lucide-react";
import CreateTaxModal from "@/components/dashboard/modals/CreateTaxModal";
import CreateTaxGroupModal from "@/components/dashboard/modals/CreateTaxGroupModal";

interface Tax {
  id: string;
  name: string;
  rate: number;
  type: "percentage" | "fixed";
}

const taxes: Tax[] = [
  { id: "1", name: "VAT", rate: 7.5, type: "percentage" },
  { id: "2", name: "Service Tax", rate: 5, type: "percentage" },
  { id: "3", name: "GST Tax", rate: 5.5, type: "percentage" },
  { id: "4", name: "WHT Tax", rate: 7.6, type: "percentage" },
];

export default function TaxesPage() {
  const [isCreateTaxOpen, setIsCreateTaxOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Taxes</h1>
          <p className="text-gray-500 mt-1">Manage your tax rates and groups</p>
        </div>
        <button
          onClick={() => setIsCreateTaxOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Tax
        </button>
      </div>

      {/* Tax Rates Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Taxes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">All Taxes</h2>
            <span className="text-sm text-gray-500">Tax Rates</span>
          </div>
          <div className="divide-y divide-gray-100">
            {taxes.map((tax) => (
              <div
                key={tax.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Percent className="w-5 h-5 text-[#41B63E]" />
                  </div>
                  <span className="font-medium text-gray-900">{tax.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {tax.rate} %
                </span>
              </div>
            ))}
          </div>
          <div className="p-4">
            <button
              onClick={() => setIsCreateTaxOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-[#41B63E] bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Tax
            </button>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Taxes</h2>
          </div>
          <div className="divide-y divide-gray-100">
            <button className="flex items-center justify-between w-full px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Percent className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">Tax Rates</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="flex items-center justify-between w-full px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">Tax Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* New Tax Group */}
          <div className="p-5 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-3">New Tax</h3>
            <button
              onClick={() => setIsCreateGroupOpen(true)}
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-[#41B63E] bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Tax
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaxModal
        isOpen={isCreateTaxOpen}
        onClose={() => setIsCreateTaxOpen(false)}
        onSubmit={(data) => {
          console.log("Creating tax:", data);
          setIsCreateTaxOpen(false);
        }}
      />

      <CreateTaxGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onSubmit={(data) => {
          console.log("Creating tax group:", data);
          setIsCreateGroupOpen(false);
        }}
      />
    </div>
  );
}
