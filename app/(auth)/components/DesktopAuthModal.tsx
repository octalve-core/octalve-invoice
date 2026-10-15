"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DesktopAuthModalProps {
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  modalClassName?: string;
}

export const DesktopAuthModal: React.FC<DesktopAuthModalProps> = ({
  children,
  backgroundImage = "/loginBg.jpg",
  className = "",
  modalClassName = "",
}) => {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center relative",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Optional overlay for better contrast */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4",
          "animate-fade-in-up",
          modalClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

// Variant with split layout (form left, image right)
interface DesktopSplitLayoutProps {
  children: React.ReactNode;
  backgroundImage?: string;
  showFloatingBadges?: boolean;
  className?: string;
}

export const DesktopSplitLayout: React.FC<DesktopSplitLayoutProps> = ({
  children,
  backgroundImage = "/loginBg.jpg",
  showFloatingBadges = true,
  className = "",
}) => {
  return (
    <div className={cn("grid grid-cols-[4fr_3fr] h-screen", className)}>
      {/* Left Side - Form */}
      <div className="w-full flex flex-col justify-center items-center bg-white px-8 py-16">
        <div className="w-full max-w-lg">{children}</div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="relative overflow-hidden">
        <img
          src={backgroundImage}
          alt="Hero"
          className="w-full h-full object-cover"
        />

        {/* Floating Badges */}
        {showFloatingBadges && (
          <>
            <div className="absolute top-[12%] left-[15%] bg-white shadow-lg px-4 py-2 rounded-xl text-sm flex items-center gap-2 animate-float-slow">
              <img src="/invoiceIcon.svg" alt="" className="w-5 h-5" />
              Invoice
            </div>
            <div className="absolute top-[8%] right-[10%] bg-purple-100 text-purple-600 shadow-lg px-4 py-2 rounded-xl text-sm animate-float-delayed">
              Expenses
            </div>
            <div className="absolute top-[35%] right-[5%] bg-[#41B63E] text-white shadow-lg px-4 py-2 rounded-xl text-sm animate-float">
              Receipt
            </div>
            <div className="absolute bottom-[35%] left-[15%] bg-yellow-400 text-gray-800 shadow-lg px-4 py-2 rounded-xl text-sm animate-float-slow">
              Invoice
            </div>
            <div className="absolute bottom-[15%] right-[8%] bg-white text-[#41B63E] shadow-lg px-4 py-2 rounded-xl text-sm flex items-center gap-2 animate-float-delayed">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path
                  fillRule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clipRule="evenodd"
                />
              </svg>
              Expenses
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopAuthModal;
