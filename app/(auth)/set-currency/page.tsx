"use client";

import { useState } from "react";
import React from "react";
import Link from "next/link";
import { toast } from "sonner";

import { Loader2, ChevronDown } from "lucide-react";

const currencies = [
  { code: "NGN", name: "Nigerian Naira", flag: "🇳🇬", symbol: "₦" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸", symbol: "$" },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", symbol: "£" },
  { code: "EUR", name: "Euro", flag: "🇪🇺", symbol: "€" },
  { code: "GHS", name: "Ghanaian Cedi", flag: "🇬🇭", symbol: "₵" },
  { code: "KES", name: "Kenyan Shilling", flag: "🇰🇪", symbol: "KSh" },
  { code: "ZAR", name: "South African Rand", flag: "🇿🇦", symbol: "R" },
];

export default function SetCurrencyPage() {
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async () => {
    toast.info("UI Preview only — currency selection is not saved yet. Merchant profile persistence is scheduled for the backend phase.");
  };

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-[calc(100vh-100px)] flex flex-col justify-center px-4">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-[28px] text-[#2D2D2D] mb-3">
              Set Primary Currency
            </h1>
            <p className="text-[14px] text-[#7F7F7F] leading-relaxed">
              Choose the primary currency for your account. This can be edited later in Settings.
            </p>
          </div>

          {/* Currency Selector */}
          <div className="mb-6 relative">
            <label className="text-sm font-medium text-[#344053] mb-2 block">
              Select Currency
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full auth-input-gray flex items-center justify-between pr-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCurrency.flag}</span>
                <span className="font-medium">{selectedCurrency.code}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedCurrency.code === currency.code
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <span className="text-xl">{currency.flag}</span>
                    <div className="text-left">
                      <span className="font-medium block">{currency.code}</span>
                      <span className="text-sm text-gray-500">
                        {currency.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg mb-6">
            The primary currency may be changed later; issued invoices will keep their original currencies.
          </p>

          <Link href="/dashboard/getting-started" className="mb-3 block text-right text-sm font-semibold text-[#0064E0]">Skip for now</Link>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="auth-btn flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading
              </>
            ) : (
              "Set Currency"
            )}
          </button>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-[#1D2838] mb-2">
            Set Primary Currency
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Choose the primary currency for your account. This can be edited later in Settings.
          </p>

          {/* Currency Selector */}
          <div className="mb-6 relative">
            <label className="text-sm font-medium text-[#344053] mb-2 block">
              Select Currency
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full auth-input-gray flex items-center justify-between pr-4"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{selectedCurrency.flag}</span>
                <span className="font-medium">{selectedCurrency.code}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    type="button"
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedCurrency.code === currency.code
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <span className="text-xl">{currency.flag}</span>
                    <div className="text-left">
                      <span className="font-medium block">{currency.code}</span>
                      <span className="text-sm text-gray-500">
                        {currency.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-[#0064E0] hover:bg-[#0052B8] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading
              </>
            ) : (
              "Set Currency"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
