"use client";

import {
  Eye,
  Edit,
  Copy,
  Trash2,
  RefreshCw,
  ChevronRight,
  Receipt,
} from "lucide-react";

interface ExpenseActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: {
    reference: string;
    vendor?: string;
    amount?: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onMarkRecurring?: () => void;
}

export default function ExpenseActionsModal({
  isOpen,
  onClose,
  expense,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onMarkRecurring,
}: ExpenseActionsModalProps) {
  if (!isOpen) return null;

  const actions = [
    { icon: Eye, label: "View Expense", onClick: onView },
    { icon: Edit, label: "Edit Expense", onClick: onEdit },
    { icon: Copy, label: "Duplicate Expense", onClick: onDuplicate },
    { icon: RefreshCw, label: "Set as Recurring", onClick: onMarkRecurring },
    { icon: Trash2, label: "Delete Expense", onClick: onDelete, danger: true },
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
          <div>
            <span className="font-semibold text-gray-900 block">
              {expense?.reference || "EXP-001"}
            </span>
            <span className="text-sm text-gray-500">
              {expense?.vendor || "Vendor"}
            </span>
          </div>
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
