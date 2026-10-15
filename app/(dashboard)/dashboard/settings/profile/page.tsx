"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  Loader2,
  Camera,
  Pencil,
} from "lucide-react";

interface ProfileSettings {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  postalCode: string;
}

const countries = [
  { value: "nigeria", label: "Nigeria" },
  { value: "ghana", label: "Ghana" },
  { value: "kenya", label: "Kenya" },
  { value: "south-africa", label: "South Africa" },
  { value: "uk", label: "United Kingdom" },
  { value: "usa", label: "United States" },
];

const states: Record<string, { value: string; label: string }[]> = {
  nigeria: [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "kano", label: "Kano" },
    { value: "rivers", label: "Rivers" },
    { value: "oyo", label: "Oyo" },
  ],
  ghana: [
    { value: "greater-accra", label: "Greater Accra" },
    { value: "ashanti", label: "Ashanti" },
  ],
  kenya: [
    { value: "nairobi", label: "Nairobi" },
    { value: "mombasa", label: "Mombasa" },
  ],
  "south-africa": [
    { value: "gauteng", label: "Gauteng" },
    { value: "western-cape", label: "Western Cape" },
  ],
  uk: [
    { value: "england", label: "England" },
    { value: "scotland", label: "Scotland" },
  ],
  usa: [
    { value: "california", label: "California" },
    { value: "new-york", label: "New York" },
    { value: "texas", label: "Texas" },
  ],
};

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<ProfileSettings>({
    fullName: "Unachukwu Charles",
    email: "giantstech@gmail.com",
    phone: "+234 9012345678",
    address: "2 Abayomi Street, Chemist Rd, Akoka,Yaba, Lagos.",
    country: "nigeria",
    state: "lagos",
    postalCode: "10021",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
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

  const currentStates = states[settings.country] || [];

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-screen pb-8">
        {/* Header */}
        <div className="flex items-center justify-center relative mb-6">
          <button
            onClick={() => router.back()}
            className="absolute left-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            Profile Settings
          </h1>
        </div>

        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6">
          <p className="text-xs text-gray-500 mb-3">Profile Image</p>
          <label className="cursor-pointer relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#41B63E]/20 to-[#41B63E]/5 border-2 border-[#41B63E]/30 flex items-center justify-center relative overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            {/* Edit icon */}
            <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#2D9CDB] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <Pencil className="w-3.5 h-3.5 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Full Name
            </label>
            <input
              type="text"
              value={settings.fullName}
              onChange={(e) =>
                setSettings({ ...settings, fullName: e.target.value })
              }
              placeholder="Enter your full name"
              className="auth-input-gray"
            />
          </div>

          {/* Email Address */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
              placeholder="Enter your email"
              className="auth-input-gray"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Phone Number
            </label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
              placeholder="+234 7012345678"
              className="auth-input-gray"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Address
            </label>
            <textarea
              value={settings.address}
              onChange={(e) =>
                setSettings({ ...settings, address: e.target.value })
              }
              placeholder="Enter your address"
              rows={2}
              className="auth-input-gray resize-none h-auto py-3"
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Country
            </label>
            <div className="relative">
              <select
                value={settings.country}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    country: e.target.value,
                    state: "",
                  })
                }
                className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#41B63E] focus:ring-2 focus:ring-[#41B63E]/20 focus:outline-none appearance-none"
              >
                {countries.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">State</label>
            <div className="relative">
              <select
                value={settings.state}
                onChange={(e) =>
                  setSettings({ ...settings, state: e.target.value })
                }
                className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#41B63E] focus:ring-2 focus:ring-[#41B63E]/20 focus:outline-none appearance-none"
              >
                <option value="">Select State</option>
                {currentStates.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Postal Code */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">
              Postal Code
            </label>
            <input
              type="text"
              value={settings.postalCode}
              onChange={(e) =>
                setSettings({ ...settings, postalCode: e.target.value })
              }
              placeholder="Enter postal code"
              className="auth-input-gray"
            />
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
              Profile Settings
            </h1>
            <p className="text-gray-500 mt-1">
              Update your personal information
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-8">
            <label className="cursor-pointer relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#41B63E]/20 to-[#41B63E]/5 border-2 border-[#41B63E]/30 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400" />
                )}
              </div>
              {/* Edit icon */}
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-[#2D9CDB] rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-[#2589c5] transition-colors">
                <Pencil className="w-4 h-4 text-white" />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-center text-sm text-gray-500 mb-6">
            Click to upload profile image
          </p>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Full Name*
              </label>
              <input
                type="text"
                value={settings.fullName}
                onChange={(e) =>
                  setSettings({ ...settings, fullName: e.target.value })
                }
                placeholder="Enter your full name"
                className="auth-input-gray"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Email Address*
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                placeholder="Enter your email"
                className="auth-input-gray"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Phone Number*
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                placeholder="+234 7012345678"
                className="auth-input-gray"
              />
            </div>

            {/* Postal Code */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Postal Code
              </label>
              <input
                type="text"
                value={settings.postalCode}
                onChange={(e) =>
                  setSettings({ ...settings, postalCode: e.target.value })
                }
                placeholder="Enter postal code"
                className="auth-input-gray"
              />
            </div>

            {/* Address - Full Width */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Address
              </label>
              <textarea
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                placeholder="Enter your address"
                rows={2}
                className="auth-input-gray resize-none h-auto py-3"
              />
            </div>

            {/* Country */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                Country
              </label>
              <div className="relative">
                <select
                  value={settings.country}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      country: e.target.value,
                      state: "",
                    })
                  }
                  className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#41B63E] focus:ring-2 focus:ring-[#41B63E]/20 focus:outline-none appearance-none"
                >
                  {countries.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="text-sm font-medium text-[#344053] mb-1.5 block">
                State
              </label>
              <div className="relative">
                <select
                  value={settings.state}
                  onChange={(e) =>
                    setSettings({ ...settings, state: e.target.value })
                  }
                  className="w-full h-[44px] px-4 pr-10 text-gray-900 rounded-lg border border-[#CFD4DC] bg-white shadow-sm focus:border-[#41B63E] focus:ring-2 focus:ring-[#41B63E]/20 focus:outline-none appearance-none"
                >
                  <option value="">Select State</option>
                  {currentStates.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
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
