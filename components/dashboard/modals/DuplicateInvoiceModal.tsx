"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface DuplicateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  invoiceRef?: string;
}

export default function DuplicateInvoiceModal({
  isOpen,
  onClose,
  onConfirm,
  invoiceRef,
}: DuplicateInvoiceModalProps) {
  const [step, setStep] = useState<"confirm" | "success">("confirm");

  const handleDuplicate = () => {
    onConfirm();
    setStep("success");
  };

  const handleClose = () => {
    setStep("confirm");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {step === "confirm" ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Duplicate Invoice
              </h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Copy className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Duplicate this invoice?
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {invoiceRef
                  ? `A copy of invoice ${invoiceRef} will be created as a draft.`
                  : "A copy will be created as a new draft invoice."}
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDuplicate}
                  className="flex-1 px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
                >
                  Duplicate
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
              Invoice Duplicated
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              The invoice has been duplicated as a new draft.
            </p>
            <button
              onClick={handleClose}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
            >
              View Duplicate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
