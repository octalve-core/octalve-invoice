"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Download,
  SlidersHorizontal,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Ban,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface RecurringExpense {
  id: string;
  name: string;
  customer: string;
  frequency: string;
  amount: string;
  nextDate: string;
  endDate: string;
  status: "active" | "paused";
}

const expenses: RecurringExpense[] = [
  {
    id: "Cut. cost 1001",
    name: "Bulk entry",
    customer: "James",
    frequency: "Once at end of every month",
    amount: "₦120,000",
    nextDate: "30/11/24",
    endDate: "30/11/25",
    status: "active",
  },
  {
    id: "Cut. cost 1002",
    name: "Bulk entry",
    customer: "Anna",
    frequency: "Once at end of every month",
    amount: "₦80,000",
    nextDate: "30/11/24",
    endDate: "30/05/25",
    status: "paused",
  },
];

interface TableProps {
  onCreateClick?: () => void;
  onViewClick?: (exp: RecurringExpense) => void;
}

export default function RecurringExpenseTable({
  onCreateClick,
  onViewClick,
}: TableProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filters = ["All", "Active", "Paused"];

  const filtered = expenses.filter((e) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Active" && e.status === "active") ||
      (activeFilter === "Paused" && e.status === "paused");
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 px-5 pt-5 pb-4 border-b border-gray-100 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
              activeFilter === f
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {filtered.length} Expenses
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-4 h-4" /> Add recurring expense
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Frequency</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Next date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">End date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-[#41B63E]">{exp.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-900">{exp.customer}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">{exp.frequency}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{exp.amount}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">{exp.nextDate}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden lg:table-cell">{exp.endDate}</td>
                  <td className="px-5 py-4"><StatusBadge status={exp.status} /></td>
                  <td className="px-5 py-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === exp.id ? null : exp.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {openMenuId === exp.id && (
                      <div className="absolute right-0 top-8 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                        <button
                          onClick={() => {
                            onViewClick?.(exp);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4" /> Edit
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Ban className="w-4 h-4" /> Deactivate
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#41B63E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4h16v16H4z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Recurring Expense Yet</h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            Add a recurring expense to automate your accounting.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" /> Add recurring expense
          </button>
        </div>
      )}
    </div>
  );
}
