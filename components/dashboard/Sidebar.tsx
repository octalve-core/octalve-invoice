"use client";

import { useState } from "react";
import Link from "next/link";
import { BrandWordmark } from "@/src/shared/ui/BrandWordmark";
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
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0052B8] text-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <BrandWordmark width={166} className="text-white" />
      </div>

      {/* Getting Started Section */}
      <div className="px-3 py-4">
        <button
          onClick={() => setIsGettingStartedOpen(!isGettingStartedOpen)}
          className="flex items-center justify-between w-full px-3 py-2.5 rounded-lg bg-[#00489F] hover:bg-[#003D85] transition-colors"
        >
          <span className="text-sm font-medium">Getting started</span>
          {isGettingStartedOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>

      {isGettingStartedOpen && <div className="px-3 pb-3"><Link href="/dashboard/getting-started" className="block rounded-lg bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20">Open setup checklist →</Link></div>}
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
                      ? "bg-[#00489F] text-white"
                      : "text-white/80 hover:bg-[#126BCF] hover:text-white"
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
