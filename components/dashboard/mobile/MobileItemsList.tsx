"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  Package,
} from "lucide-react";
import Link from "next/link";
import ItemsFilterModal, {
  ItemFilterState,
} from "@/components/dashboard/modals/ItemsFilterModal";
import ItemActionsModal from "@/components/dashboard/modals/ItemActionsModal";

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
    unitPrice: "₦650,000",
    discount: "Disc: 01 ( ₦ 5,000)",
    tax: "VAT: 14 ( ₦ 5,000)",
    category: "Phone",
  },
  {
    id: "2",
    productId: "Cat-0002",
    name: "iPhone 16 Pro Max",
    type: "goods",
    quantity: 7,
    unitPrice: "₦872,000",
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
    unitPrice: "₦250,000",
    discount: "Disc: 01 ( ₦ 5,000)",
    tax: "VAT: 14 ( ₦ 5,000)",
    category: "Laptop",
  },
  {
    id: "4",
    productId: "Cat-0004",
    name: "iPhone 16 Pro Max",
    type: "goods",
    quantity: 2,
    unitPrice: "₦672,000",
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
    unitPrice: "₦650,000",
    discount: "Disc: 01 ( ₦ 9,400)",
    tax: "VAT: 14 ( ₦ 9,400)",
    category: "Laptop",
  },
];

interface MobileItemsListProps {
  onCreateClick?: () => void;
  onItemClick?: (item: Item) => void;
  onViewClick?: (item: Item) => void;
  onEditClick?: (item: Item) => void;
  onDeleteClick?: (item: Item) => void;
  showEmptyState?: boolean;
}

export default function MobileItemsList({
  onCreateClick,
  onItemClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
  showEmptyState = false,
}: MobileItemsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<ItemFilterState>({
    category: "All",
    type: "All",
    priceFrom: "",
    priceTo: "",
  });

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

  const handleApplyFilters = (newFilters: ItemFilterState) => {
    setAppliedFilters(newFilters);
  };

  const handleItemMenuClick = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsActionsModalOpen(true);
  };

  // Empty state
  if (dataToShow.length === 0) {
    return (
      <div className="lg:hidden min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <h1 className="font-semibold text-gray-900">Items</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Package className="w-12 h-12 text-[#41B63E]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No Items Added Yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            There&apos;s no product or service for you. Add items to help you
            manage your business.
          </p>
          <button
            onClick={onCreateClick}
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
          >
            <Plus className="w-5 h-5" />
            Add Items
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
            <h1 className="font-semibold text-gray-900">Items</h1>
          </div>
        </div>

        {/* Search Row */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Items"
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
          Add Items
        </button>
      </div>

      {/* Items List */}
      <div className="px-4 py-4 space-y-3">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-left cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#41B63E]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} • Unit Price: {item.unitPrice} •
                      Disc: ₦
                      {item.discount.match(/₦[\d,]+/)?.[0]?.replace("₦", "") ||
                        "0"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => handleItemMenuClick(item, e)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-[#41B63E]">{item.unitPrice}</p>
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>

      {/* Bottom spacing for nav */}
      <div className="h-20"></div>

      {/* Filter Modal */}
      <ItemsFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={appliedFilters}
      />

      {/* Actions Modal */}
      <ItemActionsModal
        isOpen={isActionsModalOpen}
        onClose={() => setIsActionsModalOpen(false)}
        item={
          selectedItem
            ? {
                name: selectedItem.name,
                productId: selectedItem.productId,
              }
            : undefined
        }
        onView={() => selectedItem && onViewClick?.(selectedItem)}
        onEdit={() => selectedItem && onEditClick?.(selectedItem)}
        onDelete={() => selectedItem && onDeleteClick?.(selectedItem)}
      />
    </div>
  );
}
