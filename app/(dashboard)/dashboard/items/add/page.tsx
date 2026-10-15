"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, ChevronDown, Check, X } from "lucide-react";
import Link from "next/link";

const categories = [
  "Categorical Expenses",
  "Electronics",
  "Phone",
  "Accessories",
  "Laptop",
  "Services",
  "Other",
];

interface AddItemPageProps {}

export default function AddItemPage({}: AddItemPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId;

  // Form state
  const [formData, setFormData] = useState({
    type: "goods" as "goods" | "service",
    name: "",
    unitPrice: "",
    quantity: "1",
    category: "",
    tax: "",
    discountType: "percentage" as "percentage" | "naira",
    discountValue: "",
    note: "",
  });

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTaxDropdownOpen, setIsTaxDropdownOpen] = useState(false);

  const handleSubmit = (asDraft: boolean = false) => {
    console.log("Submitting:", { ...formData, asDraft });
    setShowSuccessNotification(true);
    setTimeout(() => {
      setShowSuccessNotification(false);
      router.push("/dashboard/items");
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-[#41B63E] text-white rounded-lg shadow-lg">
          <Check className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isEditMode
              ? "A product or service has been edited"
              : "A new product or service has been added"}
          </span>
          <button
            onClick={() => setShowSuccessNotification(false)}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/items"
            className="p-2 hover:bg-gray-100 rounded-lg -ml-2"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <span className="font-semibold text-gray-900">
            {isEditMode ? "Edit Item" : "Add Product or service"}
          </span>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block px-6 py-4 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/items"
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Product / Service" : "Add Product / Service"}
          </h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              {/* Left Column - Product Details */}
              <div className="space-y-5">
                <h3 className="font-semibold text-gray-900">Product</h3>

                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Type*
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={formData.type === "goods"}
                        onChange={() => handleInputChange("type", "goods")}
                        className="w-4 h-4 text-[#41B63E] border-gray-300 focus:ring-[#41B63E]"
                      />
                      <span className="text-sm text-gray-700">Goods</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="type"
                        checked={formData.type === "service"}
                        onChange={() => handleInputChange("type", "service")}
                        className="w-4 h-4 text-[#41B63E] border-gray-300 focus:ring-[#41B63E]"
                      />
                      <span className="text-sm text-gray-700">Service</span>
                    </label>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name/Description
                  </label>
                  <input
                    type="text"
                    placeholder="iPhone 16 Pro Max"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  />
                </div>

                {/* Unit Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price / Rate
                  </label>
                  <input
                    type="text"
                    placeholder="₦ 375,000"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      handleInputChange("unitPrice", e.target.value)
                    }
                    className="w-full h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="relative">
                    <select
                      value={formData.quantity}
                      onChange={(e) =>
                        handleInputChange("quantity", e.target.value)
                      }
                      className="w-full h-11 px-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Options */}
              <div className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Category
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() =>
                          setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                        }
                        className="w-full h-11 px-4 pr-10 text-sm text-left bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                      >
                        {formData.category || "Categorical Expenses"}
                      </button>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      {isCategoryDropdownOpen && (
                        <div className="absolute top-12 left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                handleInputChange("category", cat);
                                setIsCategoryDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
                    >
                      <Plus className="w-4 h-4" />
                      Add New
                    </button>
                  </div>
                </div>

                {/* Tax */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => setIsTaxDropdownOpen(!isTaxDropdownOpen)}
                        className="w-full h-11 px-4 pr-10 text-sm text-left bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                      >
                        {formData.tax || "Select Tax"}
                      </button>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      {isTaxDropdownOpen && (
                        <div className="absolute top-12 left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg">
                          {["VAT (7.5%)", "WHT (5%)", "No Tax"].map((tax) => (
                            <button
                              key={tax}
                              type="button"
                              onClick={() => {
                                handleInputChange("tax", tax);
                                setIsTaxDropdownOpen(false);
                              }}
                              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50"
                            >
                              {tax}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#41B63E] bg-white border border-[#41B63E] rounded-lg hover:bg-green-50"
                    >
                      <Plus className="w-4 h-4" />
                      Create Tax
                    </button>
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange("discountType", "percentage")
                      }
                      className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                        formData.discountType === "percentage"
                          ? "bg-[#41B63E] text-white border-[#41B63E]"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      %
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("discountType", "naira")}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border ${
                        formData.discountType === "naira"
                          ? "bg-[#41B63E] text-white border-[#41B63E]"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      NGN
                    </button>
                    <input
                      type="text"
                      placeholder="*"
                      value={formData.discountValue}
                      onChange={(e) =>
                        handleInputChange("discountValue", e.target.value)
                      }
                      className="flex-1 h-11 px-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E]"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <textarea
                    placeholder="Short note about the product"
                    value={formData.note}
                    onChange={(e) => handleInputChange("note", e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#41B63E] rounded-lg hover:bg-[#36a137]"
              >
                {isEditMode ? "Save" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
