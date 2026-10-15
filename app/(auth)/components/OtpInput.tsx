"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  value = "",
  onChange,
  onComplete,
  className = "",
  disabled = false,
  error = false,
}) => {
  const [otp, setOtp] = useState<string[]>(
    value.split("").concat(Array(length - value.length).fill(""))
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (value) {
      setOtp(value.split("").concat(Array(length - value.length).fill("")));
    }
  }, [value, length]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newOtp = [...otp];
    newOtp[index] = digit.slice(-1);
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange?.(otpValue);

    // Move to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if complete
    if (otpValue.length === length && !otpValue.includes("")) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData
      .split("")
      .concat(Array(length - pastedData.length).fill(""));
    setOtp(newOtp);
    onChange?.(pastedData);

    if (pastedData.length === length) {
      onComplete?.(pastedData);
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  // Handle input from numeric keypad
  const handleKeypadInput = (digit: string) => {
    const firstEmptyIndex = otp.findIndex((val) => val === "");
    if (firstEmptyIndex !== -1 && digit !== "backspace") {
      handleChange(firstEmptyIndex, digit);
    } else if (digit === "backspace") {
      const lastFilledIndex = [...otp].reverse().findIndex((val) => val !== "");
      if (lastFilledIndex !== -1) {
        const actualIndex = length - 1 - lastFilledIndex;
        const newOtp = [...otp];
        newOtp[actualIndex] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
        inputRefs.current[actualIndex]?.focus();
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 transition-all duration-200",
              "focus:outline-none focus:border-[#41B63E] focus:ring-2 focus:ring-[#41B63E]/20",
              error
                ? "border-red-500 bg-red-50"
                : otp[index]
                ? "border-[#41B63E] bg-green-50"
                : "border-gray-300 bg-white",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
        ))}
      </div>

      {/* Export keypad handler for external use */}
      <input type="hidden" data-keypad-handler id="otp-keypad-handler" />
    </div>
  );
};

// Expose the OtpInput ref type for external numeric keypad integration
export type OtpInputRef = {
  handleKeypadInput: (digit: string) => void;
};

export default OtpInput;
