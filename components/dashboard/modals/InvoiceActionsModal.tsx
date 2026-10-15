"use client";

import { useState } from "react";
import {
  X,
  Eye,
  Edit,
  Send,
  Copy,
  Trash2,
  Printer,
  Download,
  Share2,
  Check,
} from "lucide-react";

interface InvoiceActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: {
    reference: string;
    customer: string;
    amount: string;
    status: string;
  };
  onView?: () => void;
  onEdit?: () => void;
}

export default function InvoiceActionsModal({
  isOpen,
  onClose,
  invoice,
  onView,
  onEdit,
}: InvoiceActionsModalProps) {
  const [step, setStep] = useState<"actions" | "options" | "success">(
    "actions"
  );

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto safe-area-bottom">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {step === "actions" && (
          <div className="px-5 pb-6">
            {/* Invoice Info */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">
                  {invoice.reference}
                </p>
                <p className="text-sm text-gray-500">{invoice.customer}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{invoice.amount}</p>
                <span
                  className={`text-xs font-medium ${
                    invoice.status === "paid"
                      ? "text-green-600"
                      : invoice.status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onView?.();
                  onClose();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Eye className="w-5 h-5" />
                View Invoice
              </button>
              <button
                onClick={() => {
                  onEdit?.();
                  onClose();
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                <Edit className="w-5 h-5" />
                Edit Invoice
              </button>
              <button
                onClick={() => setStep("options")}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
              >
                <Send className="w-5 h-5" />
                Send Invoice
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Copy className="w-5 h-5" />
                Duplicate Invoice
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Printer className="w-5 h-5" />
                Print Invoice
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
                <Trash2 className="w-5 h-5" />
                Delete Invoice
              </button>
            </div>
          </div>
        )}

        {step === "options" && (
          <div className="px-5 pb-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setStep("actions")}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h3 className="font-semibold text-gray-900">Send Invoice</h3>
            </div>

            {/* Send Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#41B63E]">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Email Invoice</p>
                  <p className="text-sm text-gray-500">
                    Send to customer's email
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#41B63E]">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Send Reminder</p>
                  <p className="text-sm text-gray-500">
                    Schedule payment reminder
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#41B63E]">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Send via WhatsApp</p>
                  <p className="text-sm text-gray-500">
                    Share invoice link on WhatsApp
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#41B63E]">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-gray-300 text-[#41B63E] focus:ring-[#41B63E]"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Mark as collected</p>
                  <p className="text-sm text-gray-500">
                    Payment will be collected offline
                  </p>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep("actions")}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep("success")}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="px-5 pb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-[#41B63E]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invoice Sent!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Your invoice has been sent to {invoice.customer}
            </p>
            <button
              onClick={onClose}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
