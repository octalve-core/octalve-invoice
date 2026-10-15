"use client";

import { X, Eye, Edit, Trash2, Package } from "lucide-react";

interface ItemActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: {
    name: string;
    productId: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ItemActionsModal({
  isOpen,
  onClose,
  item,
  onView,
  onEdit,
  onDelete,
}: ItemActionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Item Info */}
        {item && (
          <div className="flex items-center gap-3 px-6 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 bg-[#41B63E] rounded-xl flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.productId}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="py-2">
          <button
            onClick={() => {
              onView?.();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-6 py-4 text-left hover:bg-gray-50"
          >
            <Eye className="w-5 h-5 text-gray-500" />
            <span className="text-gray-900">View Product/Service</span>
          </button>
          <button
            onClick={() => {
              onEdit?.();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-6 py-4 text-left hover:bg-gray-50"
          >
            <Edit className="w-5 h-5 text-gray-500" />
            <span className="text-gray-900">Edit Product/Service</span>
          </button>
          <button
            onClick={() => {
              onDelete?.();
              onClose();
            }}
            className="flex items-center gap-3 w-full px-6 py-4 text-left hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
            <span className="text-red-600">Delete Product/Service</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="px-6 pb-8">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-medium text-[#41B63E] bg-white border border-[#41B63E] rounded-lg hover:bg-green-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
