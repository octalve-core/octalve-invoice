"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Check } from "lucide-react";

type ThemeOption = "light" | "dark" | "blue" | "yellow";

interface ThemePreview {
  id: ThemeOption;
  name: string;
  headerBg: string;
  bodyBg: string;
  textColor: string;
  accentColor: string;
}

const themes: ThemePreview[] = [
  {
    id: "light",
    name: "Light",
    headerBg: "bg-white",
    bodyBg: "bg-white",
    textColor: "text-gray-900",
    accentColor: "#41B63E",
  },
  {
    id: "dark",
    name: "Dark",
    headerBg: "bg-[#1a2332]",
    bodyBg: "bg-[#0f1729]",
    textColor: "text-white",
    accentColor: "#3B82F6",
  },
  {
    id: "blue",
    name: "Blue",
    headerBg: "bg-[#1e3a5f]",
    bodyBg: "bg-[#2563eb]/10",
    textColor: "text-gray-900",
    accentColor: "#2563EB",
  },
  {
    id: "yellow",
    name: "Yellow",
    headerBg: "bg-[#fef3c7]",
    bodyBg: "bg-[#fffbeb]",
    textColor: "text-gray-900",
    accentColor: "#F59E0B",
  },
];

function InvoicePreviewCard({
  theme,
  isSelected,
}: {
  theme: ThemePreview;
  isSelected: boolean;
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden border-2 transition-all ${
        isSelected ? "border-[#41B63E] shadow-lg" : "border-gray-200"
      }`}
    >
      {/* Invoice Preview Mock */}
      <div className={`${theme.headerBg} p-3`}>
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: theme.accentColor }}
          >
            <span className="text-white text-xs font-bold">FZ</span>
          </div>
          <div>
            <p
              className={`text-xs font-semibold ${
                theme.id === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Invoice-005
            </p>
            <p
              className={`text-[10px] ${
                theme.id === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Invoice for a Dell Express
            </p>
          </div>
        </div>
      </div>
      <div className={`${theme.bodyBg} p-3`}>
        {/* Action buttons mock */}
        <div className="flex gap-1 mb-2">
          <div className="px-2 py-1 text-[8px] bg-gray-100 rounded text-gray-600">
            Send Reminder
          </div>
          <div
            className="px-2 py-1 text-[8px] rounded text-white"
            style={{ backgroundColor: theme.accentColor }}
          >
            Record Payment
          </div>
          <div className="px-2 py-1 text-[8px] bg-gray-100 rounded text-gray-600">
            Copy Link
          </div>
        </div>
        {/* Info rows mock */}
        <div className="space-y-1">
          <div className="flex justify-between text-[8px]">
            <span className="text-gray-400">Created:</span>
            <span
              className={
                theme.id === "dark" ? "text-gray-300" : "text-gray-600"
              }
            >
              12/6/2024
            </span>
          </div>
          <div className="flex justify-between text-[8px]">
            <span className="text-gray-400">Due:</span>
            <span
              className={
                theme.id === "dark" ? "text-gray-300" : "text-gray-600"
              }
            >
              2/10/2024
            </span>
          </div>
          <div className="flex justify-between text-[8px]">
            <span className="text-gray-400">Amount:</span>
            <span
              className={
                theme.id === "dark"
                  ? "text-white font-semibold"
                  : "text-gray-900 font-semibold"
              }
            >
              ₦120,000.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThemeSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>("light");

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/dashboard/settings");
  };

  const currentTheme = themes.find((t) => t.id === selectedTheme) || themes[0];

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-screen pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Theme Settings
          </h1>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Select your preferred invoice theme
        </p>

        {/* Theme Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {themes.map((theme) => (
            <div key={theme.id} className="space-y-2">
              <button
                onClick={() => setSelectedTheme(theme.id)}
                className="w-full focus:outline-none"
              >
                <InvoicePreviewCard
                  theme={theme}
                  isSelected={selectedTheme === theme.id}
                />
              </button>
              <label className="flex items-center justify-center gap-2 cursor-pointer">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedTheme === theme.id
                      ? "border-[#41B63E] bg-[#41B63E]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedTheme === theme.id && (
                    <Check className="w-2.5 h-2.5 text-white" />
                  )}
                </div>
                <span className="text-sm text-gray-700">{theme.name}</span>
              </label>
            </div>
          ))}
        </div>

        {/* Theme Preview */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Theme Preview
          </h3>
          <div className="transform scale-100">
            <InvoicePreviewCard theme={currentTheme} isSelected={false} />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
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

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Theme Settings</h1>
            <p className="text-gray-500 mt-1">
              Customize the appearance of your invoices
            </p>
          </div>
        </div>

        {/* Theme Selection Card */}
        <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <p className="text-sm text-gray-500 mb-6">
            Select your preferred invoice theme
          </p>

          {/* Theme Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {themes.map((theme) => (
              <div key={theme.id} className="space-y-3">
                <button
                  onClick={() => setSelectedTheme(theme.id)}
                  className="w-full focus:outline-none transform transition-transform hover:scale-105"
                >
                  <InvoicePreviewCard
                    theme={theme}
                    isSelected={selectedTheme === theme.id}
                  />
                </button>
                <label className="flex items-center justify-center gap-2 cursor-pointer">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedTheme === theme.id
                        ? "border-[#41B63E] bg-[#41B63E]"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    {selectedTheme === theme.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {theme.name}
                  </span>
                </label>
              </div>
            ))}
          </div>

          {/* Large Preview */}
          <div className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Theme Preview
            </h3>
            <div className="max-w-md mx-auto">
              <div
                className={`rounded-xl overflow-hidden shadow-lg border border-gray-200`}
              >
                {/* Invoice Header */}
                <div className={`${currentTheme.headerBg} p-4`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    >
                      <span className="text-white font-bold text-sm">FZ</span>
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          currentTheme.id === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Invoice-005
                      </p>
                      <p
                        className={`text-xs ${
                          currentTheme.id === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        Invoice for a Dell Express Laptop & Original Charger
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-2 py-1 text-[10px] ${
                        currentTheme.id === "dark"
                          ? "bg-white/10 text-white"
                          : "bg-gray-100 text-gray-600"
                      } rounded`}
                    >
                      Send Reminder
                    </button>
                    <button
                      className="px-2 py-1 text-[10px] rounded text-white"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    >
                      Record Payment
                    </button>
                    <button
                      className={`px-2 py-1 text-[10px] ${
                        currentTheme.id === "dark"
                          ? "bg-white/10 text-white"
                          : "bg-gray-100 text-gray-600"
                      } rounded`}
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className={`${currentTheme.bodyBg} p-4 text-xs`}>
                  {/* Date Info */}
                  <div className="flex justify-between mb-4 pb-3 border-b border-gray-200">
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <span
                        className={`ml-2 ${
                          currentTheme.id === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                      >
                        12/6/2024
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Due:</span>
                      <span
                        className={`ml-2 ${
                          currentTheme.id === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        }`}
                      >
                        2/10/2024
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Amount:</span>
                      <span
                        className={`ml-2 font-semibold ${
                          currentTheme.id === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                        style={{ color: currentTheme.accentColor }}
                      >
                        ₦120,000.00
                      </span>
                    </div>
                  </div>

                  {/* Invoice From/To */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-3 border-b border-gray-200">
                    <div>
                      <p className="text-gray-400 mb-1">Invoice from</p>
                      <p
                        className={`font-medium ${
                          currentTheme.id === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Unachukwu Charles
                      </p>
                      <p className="text-gray-400">giantstech@gmail.com</p>
                      <p className="text-gray-400">+234 9012345678</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">To Customer</p>
                      <p
                        className={`font-medium ${
                          currentTheme.id === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        Obiawason Bernard
                      </p>
                      <p className="text-gray-400">o.bern@gmail.com</p>
                      <p className="text-gray-400">+234 8012345678</p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-2 mb-3">
                    <div
                      className={`p-2 rounded ${
                        currentTheme.id === "dark" ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p
                            className={`font-medium ${
                              currentTheme.id === "dark"
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            Dell Express 5125SD Laptop
                          </p>
                          <p className="text-gray-400">
                            Qty: 1 · Price: ₦650,000
                          </p>
                        </div>
                        <p
                          className={`font-medium ${
                            currentTheme.id === "dark"
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                          style={{ color: currentTheme.accentColor }}
                        >
                          ₦550,000
                        </p>
                      </div>
                    </div>
                    <div
                      className={`p-2 rounded ${
                        currentTheme.id === "dark" ? "bg-white/5" : "bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <p
                            className={`font-medium ${
                              currentTheme.id === "dark"
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            Original Laptop Charger 195v 333A
                          </p>
                          <p className="text-gray-400">
                            Qty: 1 · Price: ₦6,250
                          </p>
                        </div>
                        <p
                          className={`font-medium ${
                            currentTheme.id === "dark"
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          ₦6,250
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="space-y-1 mb-3 pb-3 border-b border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span
                        className={
                          currentTheme.id === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        }
                      >
                        ₦656,250
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-red-500">- ₦5,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">VAT (3.5%)</span>
                      <span
                        className={
                          currentTheme.id === "dark"
                            ? "text-gray-300"
                            : "text-gray-600"
                        }
                      >
                        ₦19,468.75
                      </span>
                    </div>
                  </div>

                  {/* Total */}
                  <div
                    className="flex justify-between font-semibold mb-3"
                    style={{ color: currentTheme.accentColor }}
                  >
                    <span>Total</span>
                    <span>₦570,218.75</span>
                  </div>

                  {/* Notes */}
                  <div
                    className={`p-2 rounded ${
                      currentTheme.id === "dark" ? "bg-white/5" : "bg-gray-50"
                    }`}
                  >
                    <p
                      className="font-medium mb-1"
                      style={{ color: currentTheme.accentColor }}
                    >
                      Notes
                    </p>
                    <p
                      className={
                        currentTheme.id === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                      }
                    >
                      Thank you for Choosing Us!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-6 py-3 bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
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
