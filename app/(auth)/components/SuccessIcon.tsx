"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SuccessIconProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

const checkSizes = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export const SuccessIcon: React.FC<SuccessIconProps> = ({
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={cn(
        "rounded-full bg-[#41B63E] flex items-center justify-center animate-scale-in",
        sizeStyles[size],
        className
      )}
    >
      <svg
        className={cn("text-white", checkSizes[size])}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
};

// Alternate ring style success icon
export const SuccessRingIcon: React.FC<SuccessIconProps> = ({
  size = "md",
  className = "",
}) => {
  return (
    <div
      className={cn(
        "rounded-full border-4 border-[#41B63E] flex items-center justify-center animate-scale-in",
        sizeStyles[size],
        className
      )}
    >
      <svg
        className={cn("text-[#41B63E]", checkSizes[size])}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
};

export default SuccessIcon;
