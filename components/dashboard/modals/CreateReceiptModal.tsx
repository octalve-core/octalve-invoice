"use client";

import { useState } from "react";
import { X, Plus, Trash2, ChevronDown } from "lucide-react";

interface CreateReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReceiptData) => void;
}

interface LineItem {
  id: string;
  description: string;
  index: string;
  quantity: number;
  rate: number;
  tax: number;
  amount: number;
}

interface ReceiptData {
  receiptNumber: string;
  vendor: string;
  paymentMethod: string;
  isRecurring: boolean;
  recurringPeriod: string;
  invoiceNumber: string;
  invoiceSection: string;
  currency: string;
  editedDocument: string;
  lineItems: LineItem[];
  note: string;
}

export default function CreateReceiptModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateReceiptModalProps) {
  const [formData, setFormData] = useState<ReceiptData>({
    receiptNumber: "FZ-0001HV",
    vendor: "",
    paymentMethod: "",
    isRecurring: false,
    recurringPeriod: "Weekly",
    invoiceNumber: "",
    invoiceSection: "",
    currency: "NGN",
    editedDocument: "",
    lineItems: [
      {
        id: "1",
        description: "Web design or product item",
        index: "VALU 1345",
        quantity: 1,
        rate: 10000,
        tax: 10,
        amount: 120000,
      },
      {
        id: "2",
        description: "Web design or product item",
        index: "VALU 1345",
        quantity: 1,
        rate: 10000,
        tax: 0,
        amount: 10000,
      },
    ],
    note: "",
  });

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      index: "",
      quantity: 1,
      rate: 0,
      tax: 0,
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
            updated.quantity * updated.rate * (1 + updated.tax / 100);
          return updated;
        }
        return item;
      }),
    });
  };

  const subtotal = formData.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const taxTotal = formData.lineItems.reduce(
    (sum, item) => sum + (item.quantity * item.rate * item.tax) / 100,
    0
  );
  const total = subtotal + taxTotal;

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
              Create receipt
            </h2>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Receipt Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Number
                </label>
                <input
                  type="text"
                  value={formData.receiptNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, receiptNumber: e.target.value })
                  }
                  className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                />
              </div>

              {/* Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <div className="relative">
                  <select
                    value={formData.vendor}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor: e.target.value })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  >
                    <option value="">Select Vendor</option>
                    <option value="vendor1">Olamide Israel</option>
                    <option value="vendor2">Abdulsamad Ojedokun</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {["Cash", "Transfer", "Cash Transfer", "Banking"].map(
                    (method) => (
                      <label
                        key={method}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method}
                          checked={formData.paymentMethod === method}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMethod: e.target.value,
                            })
                          }
                          className="w-4 h-4 text-[#41B63E] focus:ring-[#41B63E]"
                        />
                        <span className="text-sm text-gray-700">{method}</span>
                      </label>
                    )
                  )}
                </div>
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

              {/* Edit Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edit Contact
                </label>
                <input
                  type="text"
                  placeholder="09012045..."
                  className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Bill payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  #Bill payment
                </label>
                <div className="relative">
                  <select className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]">
                    <option>Select a bill payment method</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Recurring Duration Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recurring Duration Period
                </label>
                <div className="relative">
                  <select
                    value={formData.recurringPeriod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurringPeriod: e.target.value,
                      })
                    }
                    className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Invoice Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="What is the invoice for?"
                  className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                />
              </div>

              {/* Sales Kinter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sales Kinter
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <select className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]">
                      <option>Select or Add Statement</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <button className="h-11 px-4 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]">
                    Generate
                  </button>
                </div>
              </div>

              {/* Note to customer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note for customer
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  placeholder="Customer note"
                  rows={2}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Add product
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 text-left font-medium text-gray-500">
                      PRODUCT NOTES
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500">
                      Index
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500">
                      Quantity
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500">
                      Rate unit
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500">
                      Tax
                    </th>
                    <th className="py-2 text-left font-medium text-gray-500">
                      AMOUNT
                    </th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formData.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Type or click to search for item"
                          className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#41B63E]"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="text"
                          value={item.index}
                          onChange={(e) =>
                            updateLineItem(item.id, "index", e.target.value)
                          }
                          className="w-24 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#41B63E]"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "quantity",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#41B63E]"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) =>
                            updateLineItem(
                              item.id,
                              "rate",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-28 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#41B63E]"
                        />
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={item.tax}
                            onChange={(e) =>
                              updateLineItem(
                                item.id,
                                "tax",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-16 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#41B63E]"
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-medium text-gray-900">
                          ₦{item.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={addLineItem}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Plus className="w-4 h-4" />
                Add item
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Plus className="w-4 h-4" />
                Add tax line
              </button>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-6">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ₦{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">add (Tax)</span>
                  <span className="font-medium text-gray-900">
                    ₦{taxTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">
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
            className="px-8 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            Save Draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2.5 text-sm font-medium text-[#41B63E] bg-green-50 border border-[#41B63E] rounded-lg hover:bg-green-100"
          >
            Finalize and Send
          </button>
        </div>
      </div>
    </div>
  );
}
