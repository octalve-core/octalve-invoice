"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  ChevronDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Send,
  Copy,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface CreditNote {
  id: string;
  reference: string;
  customer: string;
  amount: string;
  amountPaid: string;
  dateDue: string;
  status: "paid" | "overdue" | "draft" | "refunded" | "recurring" | "sent";
  email: string;
}

const creditNotes: CreditNote[] = [
  {
    id: "1",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    email: "samadopo...gmail.com",
    amount: "₦20,000.00",
    amountPaid: "₦20,000.00",
    dateDue: "21/01/2024\n05:30 PM",
    status: "overdue",
  },
  {
    id: "2",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    email: "samadopo...gmail.com",
    amount: "₦200,000.00",
    amountPaid: "₦20,000.00",
    dateDue: "21/01/2024\n05:30 PM",
    status: "refunded",
  },
  {
    id: "3",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    email: "samadopo...gmail.com",
    amount: "₦120,500.00",
    amountPaid: "₦20,000.00",
    dateDue: "21/01/2024\n05:30 PM",
    status: "recurring",
  },
  {
    id: "4",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    email: "samadopo...gmail.com",
    amount: "₦100,000.00",
    amountPaid: "₦22,000.00",
    dateDue: "21/01/2024\n05:30 PM",
    status: "draft",
  },
  {
    id: "5",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    email: "samadopo...gmail.com",
    amount: "₦120,000.00",
    amountPaid: "₦22,000.00",
    dateDue: "21/01/2024\n05:30 PM",
    status: "sent",
  },
  {
    id: "6",
    reference: "RPP0081",
    customer: "Idris Jamiu",
    email: "samadopo...gmail.com",
    amount: "₦120,000.00",
    amountPaid: "₦22,000.00",
    dateDue: "21/01/2024\n05:30 PM",
    status: "paid", // Assuming empty status means regular/paid or just no specific badge in design, but typically 'Sent' or 'Paid'
  },
];

type FilterType =
  | "all"
  | "paid"
  | "overdue"
  | "draft"
  | "refunded"
  | "recurring";

interface CreditNoteTableProps {
  onCreateClick?: () => void;
  onViewClick?: (note: CreditNote) => void;
}

export default function CreditNoteTable({
  onCreateClick,
  onViewClick,
}: CreditNoteTableProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Paid", value: "paid" },
    { label: "Overdue", value: "overdue" },
    { label: "Draft", value: "draft" },
    { label: "Refunded", value: "refunded" },
    { label: "Reoccuring", value: "recurring" },
  ];

  const filteredNotes = creditNotes.filter((note) => {
    const matchesFilter =
      filter === "all" || note.status.toLowerCase() === filter;
    const matchesSearch =
      note.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          {filteredNotes.length} credit note
        </h3>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 h-9 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>

          {/* Export (Placeholder) */}
          <button className="flex items-center gap-2 h-9 px-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            <Send className="w-4 h-4" />{" "}
            {/* Using Send icon as a placeholder for Export/Share/Download if needed, design says Export */}
            <span>Export</span>
          </button>

          {/* Filter Button (Design shows separate filter button in header, but we have tabs too) */}
          <button className="flex items-center gap-2 h-9 px-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            <Calendar className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Create Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create credit note</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
              filter === f.value
                ? "bg-[#41B63E] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Ref no
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Customer Name
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                Email
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Amount due
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Amount paid
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                Date due
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredNotes.map((note) => (
              <tr
                key={note.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {note.reference}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-700">{note.customer}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm text-gray-500">{note.email}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {note.amount}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {note.amountPaid}
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">
                      {note.dateDue.split("\n")[0]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {note.dateDue.split("\n")[1]}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={note.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === note.id ? null : note.id)
                      }
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {activeMenu === note.id && (
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => {
                            onViewClick?.(note);
                            setActiveMenu(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Send className="w-4 h-4" />
                          Send
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (Stub based on design) */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
        <button className="px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
          Previous
        </button>
        <div className="flex gap-1">
          <span className="px-2 py-1 text-sm bg-[#41B63E] text-white rounded">
            1
          </span>
          <span className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
            2
          </span>
          <span className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
            3
          </span>
          <span className="px-2 py-1 text-sm text-gray-600">...</span>
          <span className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
            8
          </span>
          <span className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
            9
          </span>
          <span className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded">
            10
          </span>
        </div>
        <button className="px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded hover:bg-gray-50">
          Next
        </button>
      </div>
    </div>
  );
}
