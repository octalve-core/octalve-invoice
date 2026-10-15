"use client";

import { useState } from "react";
import { Plus, MoreVertical, FileText } from "lucide-react";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface Invoice {
  id: string;
  reference: string;
  customer: string;
  amount: string;
  date: string;
  status: "paid" | "pending" | "draft" | "overdue";
}

const invoices: Invoice[] = [
  {
    id: "1",
    reference: "FZ-000HYV",
    customer: "Abdulsamad Ojedokun",
    amount: "₦20,000.00",
    date: "21/6/2024",
    status: "pending",
  },
  {
    id: "2",
    reference: "FZ-000HVV",
    customer: "Abdulsamad Ojedokun",
    amount: "₦20,000.00",
    date: "21/6/2024",
    status: "paid",
  },
  {
    id: "3",
    reference: "FZ-000HRV",
    customer: "Olamide Israel",
    amount: "₦20,000.00",
    date: "21/6/2024",
    status: "overdue",
  },
  {
    id: "4",
    reference: "FZ-000H11",
    customer: "Weypoint",
    amount: "₦20,000.00",
    date: "21/6/2024",
    status: "overdue",
  },
  {
    id: "5",
    reference: "FZ-000H44",
    customer: "Olamide Israel",
    amount: "₦200,000.00",
    date: "21/6/2024",
    status: "pending",
  },
];

interface MobileInvoiceListProps {
  onCreateClick?: () => void;
  onInvoiceClick?: (invoice: Invoice) => void;
}

export default function MobileInvoiceList({
  onCreateClick,
  onInvoiceClick,
}: MobileInvoiceListProps) {
  const [filter, setFilter] = useState<string>("all");

  const filters = ["All", "Paid", "Pending", "Draft", "Overdue"];

  const filteredInvoices =
    filter === "all" || filter === "All"
      ? invoices
      : invoices.filter(
          (inv) => inv.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="lg:hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
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

      {/* Invoice List */}
      <div className="space-y-3">
        {filteredInvoices.map((invoice) => (
          <button
            key={invoice.id}
            onClick={() => onInvoiceClick?.(invoice)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#41B63E]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {invoice.customer}
                  </p>
                  <p className="text-xs text-gray-500">{invoice.reference}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInvoiceClick?.(invoice);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{invoice.amount}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{invoice.date}</span>
                <StatusBadge status={invoice.status} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No invoices found</p>
          <button
            onClick={onCreateClick}
            className="mt-4 px-6 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            Create your first invoice
          </button>
        </div>
      )}
    </div>
  );
}
