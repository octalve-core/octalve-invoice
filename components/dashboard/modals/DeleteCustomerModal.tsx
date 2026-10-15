"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customerName?: string;
}

export default function DeleteCustomerModal({
  isOpen,
  onClose,
  onConfirm,
  customerName,
}: DeleteCustomerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Customer
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Are you sure you want to delete this Customer?
            {customerName && (
              <span className="block font-medium text-gray-700 mt-1">
                {customerName}
              </span>
            )}
          </p>

          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full py-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
