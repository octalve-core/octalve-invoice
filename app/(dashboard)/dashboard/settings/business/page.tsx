"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  Loader2,
  Camera,
  Upload,
} from "lucide-react";

interface BusinessSettings {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessDescription: string;
  rcNumber: string;
  taxId: string;
  bankName: string;
  accountNumber: string;
}

const banks = [
  { value: "gtb", label: "Guaranty Trust Bank" },
  { value: "firstbank", label: "First Bank" },
  { value: "zenith", label: "Zenith Bank" },
  { value: "access", label: "Access Bank" },
  { value: "uba", label: "United Bank for Africa" },
  { value: "sterling", label: "Sterling Bank" },
];

export default function BusinessSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [settings, setSettings] = useState<BusinessSettings>({
    businessName: "Giant's Tech",
    businessAddress: "2 Abayomi Street, Chevron Rd, Akoka, Yaba, Lagos",
    businessPhone: "+234 9012345678",
    businessDescription:
      "Number one Gadget's Plug in Lagos Nigeria. We can't wait to deal with you!",
    rcNumber: "616525617771",
    taxId: "616525617771",
    bankName: "gtb",
    accountNumber: "0052678976",
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/dashboard/settings");
  };

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
            Business Settings
          </h1>
        </div>

        {/* Logo Upload */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Camera className="w-6 h-6 text-gray-400 mx-auto" />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <p className="text-center text-xs text-gray-500 mt-2">Logo</p>
          </label>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Business Name */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Business Name
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) =>
                setSettings({ ...settings, businessName: e.target.value })
              }
              placeholder="Enter business name"
              className="auth-input-gray"
            />
          </div>

          {/* Business Address */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Business Address
            </label>
            <input
              type="text"
              value={settings.businessAddress}
              onChange={(e) =>
                setSettings({ ...settings, businessAddress: e.target.value })
              }
              placeholder="Enter business address"
              className="auth-input-gray"
            />
          </div>

          {/* Business Phone */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Business Phone Number
            </label>
            <input
              type="tel"
              value={settings.businessPhone}
              onChange={(e) =>
                setSettings({ ...settings, businessPhone: e.target.value })
              }
              placeholder="+234 7012345678"
              className="auth-input-gray"
            />
          </div>

          {/* Business Description */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Business Description
            </label>
            <textarea
              value={settings.businessDescription}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  businessDescription: e.target.value,
                })
              }
              placeholder="Describe your business"
              rows={3}
              className="auth-input-gray resize-none h-auto py-3"
            />
          </div>

          {/* RC Number */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              RC Number (Optional)
            </label>
            <input
              type="text"
              value={settings.rcNumber}
              onChange={(e) =>
                setSettings({ ...settings, rcNumber: e.target.value })
              }
              placeholder="Enter RC number"
              className="auth-input-gray"
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Tax ID (Optional)
            </label>
            <input
              type="text"
              value={settings.taxId}
              onChange={(e) =>
                setSettings({ ...settings, taxId: e.target.value })
              }
              placeholder="Enter Tax ID"
              className="auth-input-gray"
            />
          </div>

          {/* Signature Upload */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">
              Signature Profile (one Optional)
            </label>
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                {signaturePreview ? (
                  <img
                    src={signaturePreview}
                    alt="Signature"
                    className="max-h-16 mx-auto"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-[#41B63E] font-medium">
                      Tap to upload signature
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleSignatureChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Vendor Account Details */}
          <div className="pt-4">
            <p className="text-xs text-gray-400 mb-3">
              Vendor Account Details{" "}
              <span className="text-gray-300">
                (For fast depositation and record keeping)
              </span>
            </p>

            {/* Bank */}
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1.5 block">Bank</label>
              <div className="relative">
                <select
                  value={settings.bankName}
                  onChange={(e) =>
                    setSettings({ ...settings, bankName: e.target.value })
                  }
                  className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#41B63E] focus:ring-2 focus:ring-[#41B63E]/20 focus:outline-none appearance-none"
                >
                  {banks.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Account Number */}
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">
                Bank Account Number
              </label>
              <input
                type="text"
                value={settings.accountNumber}
                onChange={(e) =>
                  setSettings({ ...settings, accountNumber: e.target.value })
                }
                placeholder="Enter account number"
                className="auth-input-gray"
              />
              <p className="text-xs text-[#41B63E] mt-1">OLAMIDE TAD DANJUMA</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
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
            <h1 className="text-2xl font-bold text-gray-900">
              Business Settings
            </h1>
            <p className="text-gray-500 mt-1">
              Update your business information
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Logo Upload */}
          <div className="flex justify-center mb-8">
            <label className="cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden hover:bg-gray-50 transition-colors">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                Upload Logo
              </p>
            </label>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Business Name - Full Width */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Business Name*
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) =>
                  setSettings({ ...settings, businessName: e.target.value })
                }
                placeholder="Enter business name"
                className="auth-input-gray"
              />
            </div>

            {/* Business Address - Full Width */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Business Address*
              </label>
              <input
                type="text"
                value={settings.businessAddress}
                onChange={(e) =>
                  setSettings({ ...settings, businessAddress: e.target.value })
                }
                placeholder="Enter business address"
                className="auth-input-gray"
              />
            </div>

            {/* Business Phone */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Business Phone Number*
              </label>
              <input
                type="tel"
                value={settings.businessPhone}
                onChange={(e) =>
                  setSettings({ ...settings, businessPhone: e.target.value })
                }
                placeholder="+234 7012345678"
                className="auth-input-gray"
              />
            </div>

            {/* RC Number */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                RC Number (Optional)
              </label>
              <input
                type="text"
                value={settings.rcNumber}
                onChange={(e) =>
                  setSettings({ ...settings, rcNumber: e.target.value })
                }
                placeholder="Enter RC number"
                className="auth-input-gray"
              />
            </div>

            {/* Tax ID */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Tax ID (Optional)
              </label>
              <input
                type="text"
                value={settings.taxId}
                onChange={(e) =>
                  setSettings({ ...settings, taxId: e.target.value })
                }
                placeholder="Enter Tax ID"
                className="auth-input-gray"
              />
            </div>

            {/* Business Description - Full Width */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Business Description
              </label>
              <textarea
                value={settings.businessDescription}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    businessDescription: e.target.value,
                  })
                }
                placeholder="Describe your business"
                rows={3}
                className="auth-input-gray resize-none h-auto py-3"
              />
            </div>

            {/* Signature Upload - Full Width */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-[#344053] mb-2 block">
                Digital Signature (Optional)
              </label>
              <label className="cursor-pointer block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
                  {signaturePreview ? (
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="max-h-20 mx-auto"
                    />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-[#41B63E] font-medium">
                        Click to upload signature
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        SVG, PNG, JPG or GIF (max. 1024x576px)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSignatureChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Vendor Account Details */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Vendor Account Details
              <span className="text-gray-400 font-normal ml-2">
                (For fast depositation and record keeping)
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {/* Bank */}
              <div>
                <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                  Bank
                </label>
                <div className="relative">
                  <select
                    value={settings.bankName}
                    onChange={(e) =>
                      setSettings({ ...settings, bankName: e.target.value })
                    }
                    className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#41B63E] focus:ring-2 focus:ring-[#41B63E]/20 focus:outline-none appearance-none"
                  >
                    {banks.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={settings.accountNumber}
                  onChange={(e) =>
                    setSettings({ ...settings, accountNumber: e.target.value })
                  }
                  placeholder="Enter account number"
                  className="auth-input-gray"
                />
                <p className="text-xs text-[#41B63E] mt-1">
                  OLAMIDE TAD DANJUMA
                </p>
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
