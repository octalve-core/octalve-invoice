"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "../ui/StatusBadge";
import { MoreVertical } from "lucide-react";

interface Transaction {
  id: string;
  reference: string;
  customer: string;
  amount: string;
  date: string;
  email: string;
  status: "paid" | "pending" | "refunded" | "draft" | "overdue";
  type: "invoice" | "expense" | "quotation";
}

const transactions: Transaction[] = [
  {
    id: "1",
    reference: "FZ-000001",
    customer: "Olamide Isreal",
    amount: "₦20,000.00",
    date: "Due: 21/6/2024",
    email: "samiadopoolas@gmail.com",
    status: "pending",
    type: "invoice",
  },
  {
    id: "2",
    reference: "FZ-000002",
    customer: "Weypoint Energy",
    amount: "₦20,000.00",
    date: "Created: 5/6/2024",
    email: "samiadopoolas@gmail.com",
    status: "overdue",
    type: "invoice",
  },
  {
    id: "3",
    reference: "FZ-000003",
    customer: "Olamide Isreal",
    amount: "₦20,000.00",
    date: "Due: 21/6/2024",
    email: "samiadopoolas@gmail.com",
    status: "paid",
    type: "invoice",
  },
  {
    id: "4",
    reference: "FZ-000004",
    customer: "Olamide Isreal",
    amount: "₦20,000.00",
    date: "Due: 21/6/2024",
    email: "samiadopoolas@gmail.com",
    status: "paid",
    type: "expense",
  },
  {
    id: "5",
    reference: "FZ-000005",
    customer: "Weypoint Energy",
    amount: "₦20,000.00",
    date: "Due: 21/6/2024",
    email: "samiadopoolas@gmail.com",
    status: "draft",
    type: "quotation",
  },
];

type FilterType = "all" | "invoice" | "expense" | "quotation";

export default function TransactionTable() {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  const filters: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Invoice", value: "invoice" },
    { label: "Expenses", value: "expense" },
    { label: "Quotation", value: "quotation" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent transactions
        </h3>
        <Link
          href="/dashboard/transactions"
          className="text-sm text-[#41B63E] font-medium hover:underline"
        >
          View All
        </Link>
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
            {filteredTransactions.map((transaction) => (
              <tr
                key={transaction.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {transaction.reference}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-700">
                    {transaction.customer}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {transaction.amount}
                  </span>
                </td>
                <td className="px-5 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-500">
                    {transaction.date}
                  </span>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="text-sm text-gray-500">
                    {transaction.email}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={transaction.status} />
                </td>
                <td className="px-5 py-4">
                  <button className="p-1 rounded hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
