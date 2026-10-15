"use client";

import { useState } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";

interface CreateQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuotationData) => void;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  amount: number;
}

interface QuotationData {
  quotationNumber: string;
  customer: string;
  quotationPeriod: string;
  validUntil: string;
  currency: string;
  address: string;
  lineItems: LineItem[];
  note: string;
}

export default function CreateQuotationModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateQuotationModalProps) {
  const [formData, setFormData] = useState<QuotationData>({
    quotationNumber: "FZ-0001HV",
    customer: "",
    quotationPeriod: "",
    validUntil: "",
    currency: "NGN",
    address: "",
    lineItems: [
      {
        id: "1",
        description: "Dell Express 512SSD Laptop",
        quantity: 1,
        rate: 400000,
        discount: 0,
        amount: 400000,
      },
      {
        id: "2",
        description: "iPhone 15 Pro Max",
        quantity: 1,
        rate: 970000,
        discount: 0,
        amount: 970000,
      },
    ],
    note: "",
  });

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      amount: 0,
    };
    setFormData({ ...formData, lineItems: [...formData.lineItems, newItem] });
  };

  const removeLineItem = (id: string) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.filter((item) => item.id !== id),
    });
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      lineItems: formData.lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.amount =
            updated.quantity * updated.rate * (1 - updated.discount / 100);
          return updated;
        }
        return item;
      }),
    });
  };

  const subtotal = formData.lineItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const discount = formData.lineItems.reduce(
    (sum, item) => sum + (item.quantity * item.rate * item.discount) / 100,
    0
  );
  const vat = subtotal * 0.075;
  const total = subtotal + vat;

  const handleSubmit = () => {
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Quotation
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Quotation for Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quotation for Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Bill to
                    </label>
                    <p className="text-sm font-medium text-gray-900">
                      Abdulsamad Quddus
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="text-sm text-gray-600">Ogunola@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer
                </label>
                <div className="relative">
                  <select
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({ ...formData, customer: e.target.value })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  >
                    <option value="">Select Customer</option>
                    <option value="customer1">Abdulsamad Ojedokun</option>
                    <option value="customer2">Weypoint Energy</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Quotation Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quotation period
                </label>
                <div className="relative">
                  <select
                    value={formData.quotationPeriod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quotationPeriod: e.target.value,
                      })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  >
                    <option value="">Select Period</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Valid Until */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) =>
                    setFormData({ ...formData, validUntil: e.target.value })
                  }
                  className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <div className="relative">
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  >
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Edit Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edit Address
                </label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                />
              </div>
            </div>

            {/* Right Column - Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-700">Items</h3>
                <button className="px-4 py-2 text-sm font-medium text-[#41B63E] bg-green-50 rounded-lg hover:bg-green-100">
                  + Add to project
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {formData.lineItems.map((item) => (
                  <div key={item.id} className="bg-[#E8F5E8] rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                          <span className="text-xs">📦</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Unit Price ₦{item.rate.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-sm font-semibold text-[#41B63E]">
                        ₦{item.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={addLineItem}
                className="flex items-center gap-2 text-sm text-[#41B63E] hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add another item
              </button>
            </div>
          </div>

          {/* Totals */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-gray-900">
                    -₦{discount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">VAT (7.5%)</span>
                  <span className="font-medium text-gray-900">
                    ₦{vat.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-[#41B63E]">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            Create Quotation
          </button>
        </div>
      </div>
    </div>
  );
}
