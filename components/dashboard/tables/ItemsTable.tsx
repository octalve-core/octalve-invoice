"use client";

import { useState } from "react";
import {
  Search,
  Download,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Package,
} from "lucide-react";
import ItemsFilterModal, {
  ItemFilterState,
} from "@/components/dashboard/modals/ItemsFilterModal";

interface Item {
  id: string;
  productId: string;
  name: string;
  type: "goods" | "service";
  quantity: number;
  unitPrice: string;
  discount: string;
  tax: string;
  category: string;
}

const items: Item[] = [
  {
    id: "1",
    productId: "Cat-0001",
    name: "Dell Inspiron 15(2015) Laptop",
    type: "goods",
    quantity: 3,
    unitPrice: "₦348,000.00",
    discount: "Disc: 01 ( ₦ 5,000)",
    tax: "VAT: 14 ( ₦ 5,000)",
    category: "Phone",
  },
  {
    id: "2",
    productId: "Cat-0002",
    name: "iPhone 16 Pro Max",
    type: "goods",
    quantity: 2,
    unitPrice: "₦800,000.00",
    discount: "Disc: 01 (₦ 15,000)",
    tax: "VAT: 14 ( ₦ 5,000)",
    category: "Accessories",
  },
  {
    id: "3",
    productId: "Cat-0003",
    name: "Dell Inspiron 15(2015) Laptop",
    type: "goods",
    quantity: 2,
    unitPrice: "₦400,000.00",
    discount: "Disc: 01 ( ₦ 5,000)",
    tax: "VAT: 14 ( ₦ 5,000)",
    category: "Hairphone",
  },
  {
    id: "4",
    productId: "Cat-0004",
    name: "iPhone 16 Pro Max",
    type: "goods",
    quantity: 2,
    unitPrice: "₦800,000.00",
    discount: "Disc: 01 ( ₦ 9,000)",
    tax: "VAT: 14 ( ₦ 5,000)",
    category: "Phone",
  },
  {
    id: "5",
    productId: "Cat-0005",
    name: "Dell Inspiron 15(2015) Laptop",
    type: "goods",
    quantity: 5,
    unitPrice: "₦400,000.00",
    discount: "Disc: 01 ( ₦ 9,400)",
    tax: "VAT: 14 ( ₦ 9,400)",
    category: "Amos",
  },
];

interface ItemsTableProps {
  onCreateClick?: () => void;
  onViewClick?: (item: Item) => void;
  onEditClick?: (item: Item) => void;
  onDeleteClick?: (item: Item) => void;
  showEmptyState?: boolean;
}

export default function ItemsTable({
  onCreateClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
  showEmptyState = false,
}: ItemsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<ItemFilterState>({
    category: "All",
    type: "All",
    priceFrom: "",
    priceTo: "",
  });

  const handleApplyFilters = (newFilters: ItemFilterState) => {
    setAppliedFilters(newFilters);
  };

  const dataToShow = showEmptyState ? [] : items;

  const filteredItems = dataToShow.filter((item) => {
    const matchesCategory =
      appliedFilters.category === "All" ||
      item.category.toLowerCase() === appliedFilters.category.toLowerCase();
    const matchesType =
      appliedFilters.type === "All" ||
      item.type === appliedFilters.type.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Product / Service
        </h2>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {filteredItems.length} Product / Service
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
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-4 h-4" />
            Add Product / Service
          </button>
        </div>
      </div>

      {/* Table */}
      {paginatedItems.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product ID
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Unit Price
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Discount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tax
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Categories
                  </th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[#41B63E]">
                        {item.productId}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-900">{item.name}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {item.unitPrice}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {item.discount}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">{item.tax}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenMenuId(
                              openMenuId === item.id ? null : item.id
                            )
                          }
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        {openMenuId === item.id && (
                          <div className="absolute right-0 top-8 z-10 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1">
                            <button
                              onClick={() => {
                                onViewClick?.(item);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Eye className="w-4 h-4" />
                              View Product/Service
                            </button>
                            <button
                              onClick={() => {
                                onEditClick?.(item);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              <Edit className="w-4 h-4" />
                              Edit Product/Service
                            </button>
                            <button
                              onClick={() => {
                                onDeleteClick?.(item);
                                setOpenMenuId(null);
                              }}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Product/Service
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? "bg-[#41B63E] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <Package className="w-10 h-10 text-[#41B63E]" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No Product/Service Added Yet
          </h3>
          <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
            There&apos;s no product or service for you.
            <br />
            Add items to help you manage your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Add Product / Service
          </button>
        </div>
      )}

      {/* Filter Modal */}
      <ItemsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />
    </div>
  );
}
