"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MobileHeaderProps {
  userName?: string;
  onMenuClick?: () => void;
}

export default function MobileHeader({
  userName = "Abdulsamad",
  onMenuClick,
}: MobileHeaderProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "getting-started">(
    "dashboard"
  );

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-[#2D7A2A] text-white">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.svg"
              alt="User"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium">{userName}</span>
        </div>
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Tab row */}
      <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === "dashboard"
              ? "bg-white text-[#2D7A2A]"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          Dashboard
        </button>
        <Link
          href="/dashboard/getting-started"
          onClick={() => setActiveTab("getting-started")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            activeTab === "getting-started"
              ? "bg-white text-[#2D7A2A]"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-[#41B63E] flex items-center justify-center text-xs text-white">
            ✓
          </span>
          Getting Started
        </Link>
      </div>
    </header>
  );
}
