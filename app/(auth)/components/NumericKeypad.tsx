"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  className?: string;
  disabled?: boolean;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onKeyPress,
  className = "",
  disabled = false,
}) => {
  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"],
  ];

  const handleKeyPress = (key: string) => {
    if (disabled || key === "") return;
    onKeyPress(key);
  };

  return (
    <div className={cn("w-full max-w-xs mx-auto", className)}>
      <div className="grid grid-cols-3 gap-3">
        {keys.flat().map((key, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleKeyPress(key)}
            disabled={disabled || key === ""}
            className={cn(
              "h-14 rounded-lg text-2xl font-medium transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-[#41B63E]/50",
              key === ""
                ? "invisible"
                : key === "backspace"
                ? "flex items-center justify-center text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                : "bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-900",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {key === "backspace" ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
                />
              </svg>
            ) : (
              <span>{key}</span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom indicator bar (like iOS) */}
      <div className="flex justify-center mt-6">
        <div className="w-32 h-1 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};

export default NumericKeypad;
