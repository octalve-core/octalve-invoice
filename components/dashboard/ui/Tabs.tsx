"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  label: string;
  href: string;
}

interface TabsProps {
  tabs: Tab[];
}

export default function Tabs({ tabs }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              isActive ? "text-[#41B63E]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#41B63E] rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
