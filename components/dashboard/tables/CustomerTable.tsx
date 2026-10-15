"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Download,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Edit,
  FileText,
  Trash2,
} from "lucide-react";
import CustomerFilterModal, {
  FilterState,
} from "@/components/dashboard/modals/CustomerFilterModal";
import StatusBadge from "@/components/dashboard/ui/StatusBadge";

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  createdDate: string;
  amountDue: string;
  status: "paid" | "pending" | "overdue" | "draft";
}

const customers: Customer[] = [
  {
    id: "1",
    name: "Abdsamad Opabode",
    company: "Finzefy Company Ltd",
    email: "abdsarnado@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦120,000",
    status: "paid",
  },
  {
    id: "2",
    name: "Olamide Ismail",
    company: "Bi Creativity",
    email: "abdsarnado@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦100,000",
    status: "pending",
  },
  {
    id: "3",
    name: "Justin Avuru O.",
    company: "Seplat Company Ltd",
    email: "justinavuru@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦10,020,000",
    status: "overdue",
  },
  {
    id: "4",
    name: "Akanji Usman",
    company: "Finzefy Company Ltd",
    email: "akanjiusman@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦120,000",
    status: "draft",
  },
  {
    id: "5",
    name: "Steve Mary",
    company: "All Kitchen Store",
    email: "abdsamado@gmail.com",
    phone: "+234 80829473083",
    createdDate: "12/6/2024",
    amountDue: "₦935,000",
    status: "paid",
  },
];

interface CustomerTableProps {
  onCreateClick?: () => void;
  onCustomerClick?: (customer: Customer) => void;
  onEditClick?: (customer: Customer) => void;
  onDeleteClick?: (customer: Customer) => void;
  selectedCustomerId?: string;
  showEmptyState?: boolean;
}

export default function CustomerTable({
  onCreateClick,
  onCustomerClick,
  onEditClick,
  onDeleteClick,
  selectedCustomerId,
  showEmptyState = false,
}: CustomerTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-06",
    status: "All",
  });
  const [viewMode, setViewMode] = useState<"list" | "table">("list");
  const [activeTab, setActiveTab] = useState("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const tabs = ["All", "Paid", "Draft", "Sent", "Overdue"];

  const handleApplyFilters = (newFilters: FilterState) => {
    setAppliedFilters(newFilters);
  };

  const dataToShow = showEmptyState ? [] : customers;

  const filteredCustomers = dataToShow.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Paid" && customer.status === "paid") ||
      (activeTab === "Draft" && customer.status === "draft") ||
      (activeTab === "Sent" && customer.status === "pending") ||
      (activeTab === "Overdue" && customer.status === "overdue");

    return matchesSearch && matchesTab;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCustomers.map((c) => c.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExport = () => {
    // Export logic here
    console.log("Exporting customers...");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        {/* Title Row with Tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-gray-900">
              Customers
            </span>
            {/* Tabs */}
            <div className="hidden lg:flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    activeTab === tab
                      ? "bg-[#41B63E] text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <span className="text-sm text-gray-500">
            {filteredCustomers.length} Customers
          </span>
        </div>

        {/* Search and Actions Row */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>

          {/* View Toggle */}
          <div className="hidden lg:flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 ${
                viewMode === "list"
                  ? "bg-[#41B63E] text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 ${
                viewMode === "table"
                  ? "bg-[#41B63E] text-white"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Filters Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>

          {/* Add Customer Button */}
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Customer</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {filteredCustomers.length > 0 ? (
        <>
          {viewMode === "list" ? (
            /* List View */
            <div className="divide-y divide-gray-100 flex-1 overflow-y-auto">
              {paginatedCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => onCustomerClick?.(customer)}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedCustomerId === customer.id
                      ? "bg-green-50 border-l-4 border-[#41B63E]"
                      : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
                    {customer.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 truncate">
                        {customer.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {customer.company}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {customer.email} | {customer.phone}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span>Created: {customer.createdDate}</span>
                      <span>Amount Due: {customer.amountDue}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionMenuId(
                          openActionMenuId === customer.id ? null : customer.id
                        );
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    {/* Action Dropdown */}
                    {openActionMenuId === customer.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick?.(customer);
                            setOpenActionMenuId(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Customer
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle bill customer
                            setOpenActionMenuId(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <FileText className="w-4 h-4" />
                          Bill Customer
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick?.(customer);
                            setOpenActionMenuId(null);
                          }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Customer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedCustomers.length &&
                          paginatedCustomers.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-[#41B63E] rounded border-gray-300 focus:ring-[#41B63E]"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Due
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => onCustomerClick?.(customer)}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedCustomerId === customer.id ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(customer.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectOne(customer.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4 text-[#41B63E] rounded border-gray-300 focus:ring-[#41B63E]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {customer.company}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {customer.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {customer.phone}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {customer.amountDue}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {customer.createdDate}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={customer.status} />
                      </td>
                      <td className="px-4 py-3 text-center relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenActionMenuId(
                              openActionMenuId === customer.id
                                ? null
                                : customer.id
                            );
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        {/* Action Dropdown */}
                        {openActionMenuId === customer.id && (
                          <div className="absolute right-4 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditClick?.(customer);
                                setOpenActionMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Customer
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenActionMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <FileText className="w-4 h-4" />
                              Bill Customer
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick?.(customer);
                                setOpenActionMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Customer
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}{" "}
                of {filteredCustomers.length} customers
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-[#41B63E] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 flex-1">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Customer Yet
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            There&apos;s no customer for you.
            <br />
            Add a customer to help you keep track of your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Create Customer
          </button>
        </div>
      )}

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
