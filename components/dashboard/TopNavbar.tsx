"use client";

import { Search, Bell, Menu, MessageSquare } from "lucide-react";
import Image from "next/image";

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export default function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <header className="hidden lg:flex sticky top-0 z-40 items-center justify-between h-16 px-4 lg:px-6 bg-white border-b border-gray-200">
      {/* Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search here..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20 focus:border-[#41B63E] transition-colors"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notification icons */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#41B63E] rounded-full"></span>
        </button>
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#41B63E] rounded-full"></span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
          <div className="w-9 h-9 rounded-full bg-[#41B63E] flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
            <Image
              src="/logo.svg"
              alt="User"
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">Abdulsamad</p>
          </div>
        </div>
      </div>
    </header>
  );
}
