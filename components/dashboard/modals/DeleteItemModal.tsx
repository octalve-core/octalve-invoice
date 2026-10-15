"use client";

import { AlertTriangle } from "lucide-react";

interface DeleteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteItemModal({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: DeleteItemModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        {/* Content */}
        <div className="px-6 py-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Product / service
          </h3>
          <p className="text-sm text-gray-500">
            Are you sure want to delete this product / service
            {itemName ? ` "${itemName}"` : ""}?
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-medium text-[#41B63E] bg-white border border-[#41B63E] rounded-lg hover:bg-green-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
