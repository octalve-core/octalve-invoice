"use client";

import {
  X,
  Eye,
  Edit,
  Send,
  Copy,
  Trash2,
  RotateCcw,
  ChevronRight,
  Receipt,
} from "lucide-react";

interface ReceiptActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt?: {
    reference: string;
    customerTo?: string;
    amount?: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onSend?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onMarkRefunded?: () => void;
}

export default function ReceiptActionsModal({
  isOpen,
  onClose,
  receipt,
  onView,
  onEdit,
  onSend,
  onDuplicate,
  onDelete,
  onMarkRefunded,
}: ReceiptActionsModalProps) {
  if (!isOpen) return null;

  const actions = [
    { icon: Eye, label: "View Receipt", onClick: onView },
    { icon: Edit, label: "Edit Receipt", onClick: onEdit },
    { icon: Send, label: "Send Receipt", onClick: onSend },
    { icon: Copy, label: "Duplicate Receipt", onClick: onDuplicate },
    { icon: Trash2, label: "Delete Receipt", onClick: onDelete, danger: true },
    { icon: RotateCcw, label: "Mark as refunded", onClick: onMarkRefunded },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden"
      onClick={onClose}
    >
      <div
        className="bg-white w-full rounded-t-2xl shadow-xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Receipt className="w-5 h-5 text-[#41B63E]" />
          </div>
          <span className="font-semibold text-gray-900">
            {receipt?.reference || "FZ-001IRP"}
          </span>
        </div>

        {/* Actions List */}
        <div className="py-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick?.();
                onClose();
              }}
              className={`flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50 ${
                action.danger ? "text-red-600" : "text-gray-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <action.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{action.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 text-sm font-medium text-[#41B63E] bg-white border border-[#41B63E] rounded-lg hover:bg-green-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
