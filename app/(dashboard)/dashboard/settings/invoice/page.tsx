"use client";

import { useState } from "react";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import {merchantInitials} from "@/src/features/invoices/lib/document-number";
import {toast} from "sonner";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown, Loader2 } from "lucide-react";

interface InvoiceSettings {
  currency: string;
  invoicePrefix: string;
  preferredDueDate: string;
  taxPercentage: string;
  showPaymentHistory: boolean;
  enableAutoReminder: boolean;
  autoEnableTax: boolean;
}

const currencies = [
  { value: "NGN", label: "Naira" },
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
];

const dueDates = [
  { value: "1week", label: "1 week" },
  { value: "2weeks", label: "2 weeks" },
  { value: "1month", label: "1 month" },
  { value: "custom", label: "Custom" },
];

export default function InvoiceSettingsPage() {
  const router = useRouter();
  const {settings:merchantSettings,receiptAutoMode,setReceiptAutoMode}=useMerchantPreview();
  const [isLoading] = useState(false);
  const [settings, setSettings] = useState<InvoiceSettings>({
    currency: "NGN",
    invoicePrefix: "",
    preferredDueDate: "1week",
    taxPercentage: "3.5%",
    showPaymentHistory: true,
    enableAutoReminder: true,
    autoEnableTax: true,
  });

  const handleSave=()=>{toast.info("Invoice preferences are preview-only and not saved to any merchant account.");router.push("/dashboard/settings");};

  return (
    <>
      <section aria-label="Payment receipt preferences" className="mx-auto mb-5 max-w-2xl space-y-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
       <div><h2 className="font-semibold text-[#1d344b]">Payment receipts</h2><p className="mt-1 text-xs text-gray-500">Choose what happens after a verified online payment.</p></div>
       <label className="flex flex-col gap-1.5 text-xs font-medium text-[#1d344b]">Automatic receipt handling
       <select value={receiptAutoMode} onChange={e=>setReceiptAutoMode(e.target.value as typeof receiptAutoMode)} className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm">
        <option value="off">Manual — issue a receipt when needed</option>
        <option value="generate">Automatically generate a receipt</option>
        <option value="generate_and_email">Generate and email a receipt to the customer</option>
       </select></label>
       <p className="text-xs text-gray-500">These are preferences only. Automatic receipt processing and emailing remain inactive until secure payment verification and merchant authentication are available. Merchants can also issue a receipt later for a previously verified payment.</p>
      </section>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen mx-auto max-w-xl min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Invoice Settings
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Currency */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Currency
            </label>
            <div className="relative">
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#0064E0] focus:ring-2 focus:ring-[#0064E0]/20 focus:outline-none appearance-none"
              >
                {currencies.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Invoice Prefix */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Invoice Prefix
            </label>
            <input
              type="text"
              value={merchantInitials(merchantSettings.businessName||"Octalve Limited")}
              readOnly
              placeholder="Auto-generated from company name"
              className="auth-input-gray"
            />
          </div>

          {/* Preferred Due Date */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Preferred Due Date
            </label>
            <div className="relative">
              <select
                value={settings.preferredDueDate}
                onChange={(e) =>
                  setSettings({ ...settings, preferredDueDate: e.target.value })
                }
                className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#0064E0] focus:ring-2 focus:ring-[#0064E0]/20 focus:outline-none appearance-none"
              >
                {dueDates.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Tax Percentage */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Tax Percentage
            </label>
            <input
              type="text"
              value={settings.taxPercentage}
              onChange={(e) =>
                setSettings({ ...settings, taxPercentage: e.target.value })
              }
              placeholder="e.g. 7.5%"
              className="auth-input-gray"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-4">
            {/* Show Payment History */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.showPaymentHistory}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      showPaymentHistory: e.target.checked,
                    })
                  }
                  className="sr-only"
                />
                <span className="text-sm text-gray-900">
                  Show Payment History on Invoice page
                </span>
              </div>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.showPaymentHistory ? "bg-[#0064E0]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.showPaymentHistory
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </label>

            {/* Enable Auto Payment Reminder */}
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.enableAutoReminder}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      enableAutoReminder: e.target.checked,
                    })
                  }
                  className="sr-only"
                />
                <span className="text-sm text-gray-900">
                  Enable Auto Payment Reminder
                </span>
              </div>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.enableAutoReminder ? "bg-[#0064E0]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.enableAutoReminder
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </label>

            {/* Auto Enable Tax */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-900">Auto Enable Tax</span>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.autoEnableTax ? "bg-[#0064E0]" : "bg-gray-300"
                }`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    autoEnableTax: !settings.autoEnableTax,
                  })
                }
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoEnableTax ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#0064E0] hover:bg-[#0052B8] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen mx-auto max-w-2xl">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Invoice Settings
            </h1>
            <p className="text-gray-500 mt-1">
              Configure your invoice preferences
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Currency */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Currency
              </label>
              <div className="relative">
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    setSettings({ ...settings, currency: e.target.value })
                  }
                  className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#0064E0] focus:ring-2 focus:ring-[#0064E0]/20 focus:outline-none appearance-none"
                >
                  {currencies.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Invoice Prefix */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Invoice Prefix
              </label>
              <input
                type="text"
                value={settings.invoicePrefix}
                readOnly
                placeholder="e.g. INV-"
                className="auth-input-gray"
              />
            </div>

            {/* Preferred Due Date */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Preferred Due Date
              </label>
              <div className="relative">
                <select
                  value={settings.preferredDueDate}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferredDueDate: e.target.value,
                    })
                  }
                  className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#0064E0] focus:ring-2 focus:ring-[#0064E0]/20 focus:outline-none appearance-none"
                >
                  {dueDates.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Tax Percentage */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Tax Percentage
              </label>
              <input
                type="text"
                value={settings.taxPercentage}
                onChange={(e) =>
                  setSettings({ ...settings, taxPercentage: e.target.value })
                }
                placeholder="e.g. 7.5%"
                className="auth-input-gray"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Preferences
            </h3>

            {/* Show Payment History */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-900">
                Show Payment History on Invoice page
              </span>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.showPaymentHistory ? "bg-[#0064E0]" : "bg-gray-300"
                }`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    showPaymentHistory: !settings.showPaymentHistory,
                  })
                }
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.showPaymentHistory
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </label>

            {/* Enable Auto Payment Reminder */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-900">
                Enable Auto Payment Reminder
              </span>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.enableAutoReminder ? "bg-[#0064E0]" : "bg-gray-300"
                }`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    enableAutoReminder: !settings.enableAutoReminder,
                  })
                }
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.enableAutoReminder
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </div>
            </label>

            {/* Auto Enable Tax */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-gray-900">Auto Enable Tax</span>
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.autoEnableTax ? "bg-[#0064E0]" : "bg-gray-300"
                }`}
                onClick={() =>
                  setSettings({
                    ...settings,
                    autoEnableTax: !settings.autoEnableTax,
                  })
                }
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoEnableTax ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </label>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-[#0064E0] hover:bg-[#0052B8] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
