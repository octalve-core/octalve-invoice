"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface FloatingBadgeProps {
  icon?: React.ReactNode;
  text: string;
  variant?: "white" | "green" | "purple" | "yellow";
  className?: string;
  iconSrc?: string;
}

const variantStyles = {
  white: "bg-white text-gray-700 shadow-lg",
  green: "bg-[#41B63E] text-white shadow-lg",
  purple: "bg-purple-500 text-white shadow-lg",
  yellow: "bg-yellow-400 text-gray-800 shadow-lg",
};

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  icon,
  text,
  variant = "white",
  className = "",
  iconSrc,
}) => {
  return (
    <div
      className={cn(
        "px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 animate-float",
        variantStyles[variant],
        className
      )}
    >
      {iconSrc && <img src={iconSrc} alt="" className="w-5 h-5" />}
      {icon && !iconSrc && icon}
      <span>{text}</span>
    </div>
  );
};

// Pre-configured badges matching the design
export const InvoiceBadge = ({ className = "" }: { className?: string }) => (
  <FloatingBadge
    iconSrc="/invoiceIcon.svg"
    text="Invoice"
    variant="white"
    className={className}
  />
);

export const ExpensesBadge = ({
  className = "",
  variant = "purple" as const,
}: {
  className?: string;
  variant?: "purple" | "white";
}) => (
  <FloatingBadge
    text="Expenses"
    variant={variant}
    className={className}
    icon={
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
        <path
          fillRule="evenodd"
          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
          clipRule="evenodd"
        />
      </svg>
    }
  />
);

export const ReceiptBadge = ({ className = "" }: { className?: string }) => (
  <FloatingBadge
    text="Receipt"
    variant="green"
    className={className}
    icon={
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
          clipRule="evenodd"
        />
      </svg>
    }
  />
);

export default FloatingBadge;
