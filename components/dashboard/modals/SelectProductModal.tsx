"use client";

import { useState } from "react";
import { X, Search, Plus, Check, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku?: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Web Design Services",
    description: "Complete website design package",
    price: 150000,
    sku: "WDS-001",
  },
  {
    id: "2",
    name: "Logo Design",
    description: "Professional logo creation",
    price: 50000,
    sku: "LOG-001",
  },
  {
    id: "3",
    name: "Mobile App Development",
    description: "iOS and Android development",
    price: 500000,
    sku: "MAD-001",
  },
  {
    id: "4",
    name: "SEO Optimization",
    description: "Search engine optimization",
    price: 75000,
    sku: "SEO-001",
  },
  {
    id: "5",
    name: "Content Writing",
    description: "Blog and website content",
    price: 25000,
    sku: "CW-001",
  },
];

interface SelectProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  onAddNew: () => void;
}

export default function SelectProductModal({
  isOpen,
  onClose,
  onSelect,
  onAddNew,
}: SelectProductModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Info */}
        <div className="px-6 py-3 bg-green-50 border-b border-green-100">
          <p className="text-sm text-gray-600">
            A new product is an item or service that is added to an invoice
          </p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
            />
          </div>
        </div>

        {/* Add New Button */}
        <div className="px-4 py-3 border-b border-gray-100">
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 w-full px-4 py-3 text-sm font-medium text-[#41B63E] bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </button>
        </div>

        {/* Product List */}
        <div className="max-h-[400px] overflow-y-auto">
          <p className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">
            Product
          </p>
          {filteredProducts.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <li key={product.id}>
                  <button
                    onClick={() => {
                      onSelect(product);
                      onClose();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Package className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₦{product.price.toLocaleString()}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No products found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
