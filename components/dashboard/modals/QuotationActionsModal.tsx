"use client";

import { X, Eye, Edit, Send, Copy, Trash2, Volume2 } from "lucide-react";

interface QuotationActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotation?: {
    reference: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onSend?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export default function QuotationActionsModal({
  isOpen,
  onClose,
  quotation,
  onView,
  onEdit,
  onSend,
  onDuplicate,
  onDelete,
}: QuotationActionsModalProps) {
  if (!isOpen) return null;

  const handleAction = (action?: () => void) => {
    action?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full lg:max-w-sm lg:mx-4 rounded-t-2xl lg:rounded-xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {quotation?.reference || "FZ-001KF"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg -mr-2"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Actions */}
        <div className="py-2">
          <button
            onClick={() => handleAction(onView)}
            className="flex items-center gap-3 w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            <Eye className="w-5 h-5 text-gray-500" />
            <span className="text-sm">View Quotation</span>
          </button>

          <button
            onClick={() => handleAction(onEdit)}
            className="flex items-center gap-3 w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            <Edit className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Edit Quotation</span>
          </button>

          <button
            onClick={() => handleAction(onSend)}
            className="flex items-center gap-3 w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            <Send className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Send Quotation</span>
          </button>

          <button
            onClick={() => handleAction(onDuplicate)}
            className="flex items-center gap-3 w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-50"
          >
            <Copy className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Duplicate</span>
          </button>

          <button className="flex items-center gap-3 w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-50">
            <Volume2 className="w-5 h-5 text-gray-500" />
            <span className="text-sm">AudoVoiceOver</span>
          </button>

          <button
            onClick={() => handleAction(onDelete)}
            className="flex items-center gap-3 w-full px-6 py-3 text-left text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-sm">Delete</span>
          </button>
        </div>

        {/* Safe area padding for mobile */}
        <div className="h-6 lg:hidden" />
      </div>
    </div>
  );
}
