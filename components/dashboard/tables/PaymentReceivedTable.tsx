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
} from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface Payment {
  id: string;
  customer: string;
  note: string;
  amount: string;
  method: string;
  reference: string;
  date: string;
  status: "paid" | "pending" | "draft" | "overdue";
}

const payments: Payment[] = [
  {
    id: "CRF 0002",
    customer: "Case 1002 James",
    note: "invoice payment",
    amount: "₦350,000",
    method: "E99933528",
    reference: "0023490824",
    date: "21/01/24",
    status: "paid",
  },
  {
    id: "CRF 0003",
    customer: "Case 1003 James",
    note: "advance payment",
    amount: "₦200,000",
    method: "POS",
    reference: "0023490114",
    date: "21/01/24",
    status: "pending",
  },
];

interface PaymentReceivedTableProps {
  onCreateClick?: () => void;
  onViewClick?: (payment: Payment) => void;
}

export default function PaymentReceivedTable({
  onCreateClick,
  onViewClick,
}: PaymentReceivedTableProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filters = ["All", "Income", "Advance"];

  const filteredPayments = payments.filter((p) => {
    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Income" && p.note.includes("invoice")) ||
      (activeFilter === "Advance" && p.note.includes("advance"));
    const matchesSearch =
      p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
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
            {filteredPayments.length} Payments
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
            <Plus className="w-4 h-4" /> Add payment
          </button>
        </div>
      </div>

      {/* Table */}
      {filteredPayments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID number</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer name</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received via</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Reference no</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Date</th>
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 text-sm font-medium text-[#41B63E]">{p.id}</td>
                  <td className="px-5 py-4 text-sm text-gray-900">{p.customer}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.note}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{p.amount}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.method}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">{p.reference}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 hidden md:table-cell">{p.date}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4 relative">
                    <button
                      onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {openMenuId === p.id && (
                      <div className="absolute right-0 top-8 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                        <button
                          onClick={() => {
                            onViewClick?.(p);
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
            <svg
              className="w-10 h-10 text-[#41B63E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8c1.654 0 3-.895 3-2s-1.346-2-3-2-3 .895-3 2 1.346 2 3 2zM6 22v-2c0-1.654 4-2 6-2s6 .346 6 2v2H6z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Payment Yet</h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            There is no payment received yet.
            <br /> Add a payment to keep your records up to date.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" /> Add Payment
          </button>
        </div>
      )}
    </div>
  );
}
