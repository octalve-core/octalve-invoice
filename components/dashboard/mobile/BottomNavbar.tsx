"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Receipt, Users, MoreHorizontal } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Invoices", href: "/dashboard/invoice", icon: FileText },
  { label: "Receipts", href: "/dashboard/receipt", icon: Receipt },
  { label: "Customers", href: "/dashboard/customer", icon: Users },
  { label: "More", href: "/dashboard/settings", icon: MoreHorizontal },
];

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? "text-[#41B63E]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
