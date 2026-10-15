import { useState } from "react";
import {
  Plus,
  MoreVertical,
  FileMinus,
  Eye,
  Edit,
  Trash2,
  Send,
  Copy,
} from "lucide-react"; // Using FileMinus for Credit Note icon
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface CreditNote {
  id: string;
  reference: string;
  customer: string;
  amount: string;
  amountPaid: string;
  dateDue: string;
  status: "paid" | "overdue" | "draft" | "refunded" | "recurring" | "sent";
}

const creditNotes: CreditNote[] = [
  {
    id: "1",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    amount: "₦20,000.00",
    amountPaid: "₦20,000.00",
    dateDue: "21/01/2024",
    status: "overdue",
  },
  {
    id: "2",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    amount: "₦200,000.00",
    amountPaid: "₦20,000.00",
    dateDue: "21/01/2024",
    status: "refunded",
  },
  {
    id: "3",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    amount: "₦120,500.00",
    amountPaid: "₦20,000.00",
    dateDue: "21/01/2024",
    status: "recurring",
  },
  {
    id: "4",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    amount: "₦100,000.00",
    amountPaid: "₦22,000.00",
    dateDue: "21/01/2024",
    status: "draft",
  },
  {
    id: "5",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    amount: "₦120,000.00",
    amountPaid: "₦22,000.00",
    dateDue: "21/01/2024",
    status: "sent",
  },
];

interface MobileCreditNoteListProps {
  onCreateClick?: () => void;
  onItemClick?: (note: CreditNote) => void;
}

export default function MobileCreditNoteList({
  onCreateClick,
  onItemClick,
}: MobileCreditNoteListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filters = ["All", "Paid", "Overdue", "Draft", "Refunded", "Reoccuring"];

  const filteredNotes =
    filter === "all" || filter === "All"
      ? creditNotes
      : creditNotes.filter(
          (note) => note.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="lg:hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Credit note</h2>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
        >
          <Plus className="w-4 h-4" />
          Create credit note
        </button>
      </div>

      <div className="mb-4">
        <span className="text-sm text-gray-500">
          {filteredNotes.length} credit note
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              filter === f || (filter === "all" && f === "All")
                ? "bg-[#41B63E] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Credit Note List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <button
            key={note.id}
            onClick={() => onItemClick?.(note)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FileMinus className="w-5 h-5 text-[#41B63E]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{note.customer}</p>
                  <p className="text-xs text-gray-500">{note.reference}</p>
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === note.id ? null : note.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>

                {activeMenu === note.id && (
                  <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick?.(note);
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle edit
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle send
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle duplicate
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // handle delete
                        setActiveMenu(null);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div>
                <p className="font-semibold text-gray-900">{note.amount}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Paid: {note.amountPaid}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={note.status} />
                <span className="text-xs text-gray-500 mt-1">
                  {note.dateDue}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FileMinus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No credit notes found</p>
          <button
            onClick={onCreateClick}
            className="mt-4 px-6 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            Create your first credit note
          </button>
        </div>
      )}
    </div>
  );
}
