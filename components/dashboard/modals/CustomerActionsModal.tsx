"use client";

import { X, Edit, FileText, Trash2 } from "lucide-react";

interface CustomerActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
  onEdit?: () => void;
  onBill?: () => void;
  onDelete?: () => void;
}

export default function CustomerActionsModal({
  isOpen,
  onClose,
  customerName,
  onEdit,
  onBill,
  onDelete,
}: CustomerActionsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl lg:rounded-xl shadow-xl w-full max-w-sm lg:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">
            {customerName ? `Actions for ${customerName}` : "Customer Actions"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-2">
          <button
            onClick={() => {
              onEdit?.();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Edit Customer</p>
              <p className="text-xs text-gray-500">
                Update customer information
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onBill?.();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Bill Customer</p>
              <p className="text-xs text-gray-500">
                Create a new invoice for this customer
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              onDelete?.();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-left">
              <p className="font-medium">Delete Customer</p>
              <p className="text-xs text-red-400">
                Remove this customer permanently
              </p>
            </div>
          </button>
        </div>

        {/* Cancel Button (mobile) */}
        <div className="p-4 pt-0 lg:hidden">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
