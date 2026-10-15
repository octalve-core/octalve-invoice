"use client";

import { useState } from "react";
import {UserAvatar} from "@/src/features/merchant-preview/UserAvatar";
import {PreviewLogoutButton} from "@/src/features/merchant-preview/PreviewLogoutButton";
import {useMerchantPreview} from "@/src/features/merchant-preview/MerchantPreviewProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  User,
  FileText,
  Building2,
  Palette,
  HelpCircle,
  CreditCard,
  BarChart3,
  Check,
  ChevronLeft,
} from "lucide-react";

interface SettingsItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const generalSettings: SettingsItem[] = [
  {
    label: "Profile Settings",
    href: "/dashboard/settings/profile",
    icon: User,
  },
  {
    label: "Invoice Settings",
    href: "/dashboard/settings/invoice",
    icon: FileText,
  },
  {
    label: "Business Settings",
    href: "/dashboard/settings/business",
    icon: Building2,
  },
];

const otherSettings: SettingsItem[] = [
  { label: "Theme Settings", href: "/dashboard/settings/theme", icon: Palette },
  { label: "FAQs", href: "/dashboard/settings/faqs", icon: HelpCircle },
];

export default function SettingsPage() {
  const router = useRouter();
  const {user}=useMerchantPreview();

  return (
    <>
      <div className="mb-4 flex justify-end"><PreviewLogoutButton className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"/></div>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">More</h1>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <UserAvatar size="md"/>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">
                    {user.fullName||"Preview User"}
                  </p>
                  
                </div>
                <p className="text-sm text-gray-500">{user.email||"No preview email configured"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 mb-6">
          <Link
            href="/dashboard/settings/subscription"
            className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">
                Manage Subscription
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/dashboard/settings/reports"
            className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Sales Reports</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Preferences
          </h2>
          <p className="text-xs text-gray-400 mb-3">General Settings</p>
          <div className="space-y-2">
            {generalSettings.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Other Settings Section */}
        <div>
          <p className="text-xs text-gray-400 mb-3">Other Settings</p>
          <div className="space-y-2">
            {otherSettings.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-3 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <UserAvatar size="lg"/>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {user.fullName||"Preview User"}
                    </h2>
                    
                  </div>
                  <p className="text-gray-500 mt-1">{user.email||"No preview email configured"}</p>
                </div>
              </div>
              <Link href="/dashboard/settings/profile" className="px-4 py-2 text-sm font-medium text-[#0064E0] border border-[#0064E0] rounded-lg hover:bg-blue-50 transition-colors">
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Quick Access Cards */}
          <Link
            href="/dashboard/settings/subscription"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Manage Subscription
                </h3>
                <p className="text-sm text-gray-500">
                  View and update your plan
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/settings/reports"
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sales Reports</h3>
                <p className="text-sm text-gray-500">View detailed analytics</p>
              </div>
            </div>
          </Link>

          <div className="bg-gradient-to-br from-[#0064E0] to-[#0052B8] rounded-xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-2">Upgrade to Pro</h3>
            <p className="text-sm text-white/80 mb-4">
              Get more features and unlock advanced tools
            </p>
            <button className="px-4 py-2 bg-white text-[#0064E0] font-medium rounded-lg text-sm hover:bg-gray-100 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">General Settings</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {generalSettings.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Other Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Other Settings</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {otherSettings.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        {item.label}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
