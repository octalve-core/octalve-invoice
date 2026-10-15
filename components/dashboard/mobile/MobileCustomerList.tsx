"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Users,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import CustomerFilterModal, {
  FilterState,
} from "@/components/dashboard/modals/CustomerFilterModal";

interface CustomerItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  createdDate: string;
  amountDue: string;
}

const customers: CustomerItem[] = [
  {
    id: "1",
    name: "Abdsamad Opabode",
    company: "Finzefy Company Ltd",
    email: "abdsarnado@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦120,000",
  },
  {
    id: "2",
    name: "Olamide Ismail",
    company: "Bi Creativity",
    email: "abdsarnado@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦100,000",
  },
  {
    id: "3",
    name: "Justin Avuru O.",
    company: "Seplat Company Ltd",
    email: "justinavuru@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦10,020,000",
  },
  {
    id: "4",
    name: "Akanji Usman",
    company: "Finzefy Company Ltd",
    email: "akanjiusman@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦120,000",
  },
  {
    id: "5",
    name: "Steve Mary",
    company: "All Kitchen Store",
    email: "abdsamado@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦935,000",
  },
];

interface MobileCustomerListProps {
  onCreateClick?: () => void;
  onCustomerClick?: (customer: CustomerItem) => void;
  showEmptyState?: boolean;
}

export default function MobileCustomerList({
  onCreateClick,
  onCustomerClick,
  showEmptyState = false,
}: MobileCustomerListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-06",
    status: "All",
  });

  const dataToShow = showEmptyState ? [] : customers;

  const filteredCustomers = dataToShow.filter((c) => {
    return (
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
  };

  // Empty state
  if (dataToShow.length === 0) {
    return (
      <div className="lg:hidden min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-semibold text-gray-900">Customers</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Users className="w-12 h-12 text-[#41B63E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Customer Yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            There&apos;s no customer for you. Add a customer to help you keep
            track of your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Customer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:hidden min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-semibold text-gray-900">Customers</h1>
          </div>
        </div>

        {/* Search Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-sm bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20"
            />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Create Button */}
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
        >
          <Plus className="w-5 h-5" />
          Add Customer
        </button>
      </div>

      {/* Customer Count */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <span className="text-sm text-gray-600">
          {filteredCustomers.length} customers
        </span>
      </div>

      {/* Customer List */}
      <div className="px-4 py-4 space-y-3">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => onCustomerClick?.(customer)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-lg">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium text-gray-900 truncate">
                      {customer.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {customer.email}
                  </p>
                  <p className="text-xs text-gray-400">{customer.phone}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No customers found</p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>

      {/* Filter Modal */}
      <CustomerFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
}
