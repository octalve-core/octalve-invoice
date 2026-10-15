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

interface Invoice {
  id: string;
  reference: string;
  customer: string;
  amount: string;
  date: string;
  email: string;
  status: "paid" | "pending" | "draft" | "overdue";
}

const invoices: Invoice[] = [
  {
    id: "1",
    reference: "FZ-000HYV",
    customer: "Abdulsamad Ojedokun",
    amount: "₦20,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "pending",
  },
  {
    id: "2",
    reference: "FZ-000HVV",
    customer: "Abdulsamad Ojedokun",
    amount: "₦20,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "paid",
  },
  {
    id: "3",
    reference: "FZ-000HRV",
    customer: "Olamide Israel",
    amount: "₦20,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "overdue",
  },
  {
    id: "4",
    reference: "FZ-000H11",
    customer: "Weypoint",
    amount: "₦20,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "overdue",
  },
  {
    id: "5",
    reference: "FZ-000H44",
    customer: "Olamide Israel",
    amount: "₦200,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "pending",
  },
  {
    id: "6",
    reference: "FZ-000H9N",
    customer: "Rhocwoods",
    amount: "₦100,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "paid",
  },
  {
    id: "7",
    reference: "FZ-000H0P",
    customer: "Olamide Israel",
    amount: "₦40,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "paid",
  },
  {
    id: "8",
    reference: "FZ-000POP",
    customer: "Lavicwoods",
    amount: "₦600,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "paid",
  },
  {
    id: "9",
    reference: "FZ-000WER",
    customer: "Lavicwoods",
    amount: "₦700,000.00",
    date: "21/6/2024",
    email: "samiadopolas@gmail.com",
    status: "pending",
  },
];

type FilterType =
  | "all"
  | "paid"
  | "pending"
  | "draft"
  | "overdue"
  | "recurring";

interface InvoiceTableProps {
  onCreateClick?: () => void;
  onViewClick?: (invoice: Invoice) => void;
}

export default function InvoiceTable({
  onCreateClick,
  onViewClick,
}: InvoiceTableProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Invoice", value: "pending" },
    { label: "Paid", value: "paid" },
    { label: "Draft", value: "draft" },
    { label: "Overdue", value: "overdue" },
    { label: "Recurring", value: "recurring" },
  ];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filter === "all" || inv.status === filter;
    const matchesSearch =
      inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">All Invoices</h3>

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

          {/* Date Filter */}
          <button className="flex items-center gap-2 h-9 px-3 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100">
            <Calendar className="w-4 h-4" />
            <span>7 days</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Create Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 h-9 px-4 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Invoice</span>
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
                Reference
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Customer
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Amount
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                Date
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                Email
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {invoice.reference}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-700">
                    {invoice.customer}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {invoice.amount}
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-500">{invoice.date}</span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm text-gray-500">{invoice.email}</span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={invoice.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === invoice.id ? null : invoice.id
                        )
                      }
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>

                    {activeMenu === invoice.id && (
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={() => {
                            onViewClick?.(invoice);
                            setActiveMenu(null);
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                          View Invoice
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                          Edit Invoice
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Send className="w-4 h-4" />
                          Send Invoice
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
    </div>
  );
}
