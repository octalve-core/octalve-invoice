"use client";

import { useState } from "react";
import { X, RotateCcw, Check } from "lucide-react";

interface RefundInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  invoiceRef?: string;
  amount?: string;
}

export default function RefundInvoiceModal({
  isOpen,
  onClose,
  onConfirm,
  invoiceRef,
  amount = "₦20,000.00",
}: RefundInvoiceModalProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [reason, setReason] = useState("");

  const handleRefund = () => {
    onConfirm(reason);
    setStep("success");
  };

  const handleClose = () => {
    setStep("form");
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {step === "form" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Mark as Refunded
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-orange-600" />
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Refund {invoiceRef}
                </h3>
                <p className="text-2xl font-bold text-gray-900">{amount}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for refund (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter the reason for this refund..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRefund}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                >
                  Mark as Refunded
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Invoice Refunded
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              The invoice has been marked as refunded.
            </p>
            <button
              onClick={handleClose}
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
