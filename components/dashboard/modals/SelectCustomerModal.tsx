"use client";

import { useState } from "react";
import { X, Search, Plus, Check, User } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

const customers: Customer[] = [
  {
    id: "1",
    name: "Abdulsamad Ojedokun",
    email: "samiadopolas@gmail.com",
    phone: "+234 800 000 0001",
  },
  {
    id: "2",
    name: "Olamide Israel",
    email: "olamide@gmail.com",
    phone: "+234 800 000 0002",
  },
  {
    id: "3",
    name: "Weypoint Energy",
    email: "info@weypoint.com",
    phone: "+234 800 000 0003",
  },
  {
    id: "4",
    name: "Rhocwoods Ltd",
    email: "contact@rhocwoods.com",
    phone: "+234 800 000 0004",
  },
  {
    id: "5",
    name: "Lavicwoods",
    email: "hello@lavicwoods.com",
    phone: "+234 800 000 0005",
  },
];

interface SelectCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
  onAddNew: () => void;
  selectedId?: string;
}

export default function SelectCustomerModal({
  isOpen,
  onClose,
  onSelect,
  onAddNew,
  selectedId,
}: SelectCustomerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Customer
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
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
            Add New Customer
          </button>
        </div>

        {/* Customer List */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredCustomers.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <li key={customer.id}>
                  <button
                    onClick={() => {
                      onSelect(customer);
                      onClose();
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors ${
                      selectedId === customer.id ? "bg-green-50" : ""
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="text-sm text-gray-500">{customer.email}</p>
                    </div>
                    {selectedId === customer.id && (
                      <Check className="w-5 h-5 text-[#41B63E]" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-500">No customers found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
