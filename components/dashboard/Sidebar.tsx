"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  FileSpreadsheet,
  Wallet,
  Users,
  Package,
  RefreshCcw,
  CreditCard,
  FileMinus,
  MoreHorizontal,
  UserCog,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Invoice", href: "/dashboard/invoice", icon: FileText },
  { label: "Receipt", href: "/dashboard/receipt", icon: Receipt },
  { label: "Quotation", href: "/dashboard/quotation", icon: FileSpreadsheet },
  { label: "Expenses", href: "/dashboard/expenses", icon: Wallet },
  { label: "Customer", href: "/dashboard/customer", icon: Users },
  { label: "Items", href: "/dashboard/items", icon: Package },
  {
    label: "Recurring Expense",
    href: "/dashboard/recurring-expense",
    icon: RefreshCcw,
  },
  {
    label: "Payment Received",
    href: "/dashboard/payment-received",
    icon: CreditCard,
  },
  { label: "Credit note", href: "/dashboard/credit-note", icon: FileMinus },
  {
    label: "Other Services",
    href: "/dashboard/other-services",
    icon: MoreHorizontal,
  },
  { label: "Staff", href: "/dashboard/staff", icon: UserCog },
  { label: "Report", href: "/dashboard/report", icon: BarChart3 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isGettingStartedOpen, setIsGettingStartedOpen] = useState(true);

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#2D7A2A] text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <Image
          src="/logo.svg"
          alt="Finzefy"
          width={32}
          height={32}
          className="rounded-lg"
        />
        <span className="text-xl font-semibold">Finzefy</span>
      </div>

      {/* Getting Started Section */}
      <div className="px-3 py-4">
        <button
          onClick={() => setIsGettingStartedOpen(!isGettingStartedOpen)}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-[#246B22] hover:bg-[#1E5B1B] transition-colors"
        >
          <span className="text-sm font-medium">Getting started</span>
          {isGettingStartedOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#246B22] text-white"
                      : "text-white/80 hover:bg-[#358832] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
