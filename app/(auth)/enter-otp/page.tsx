"use client";

import { useState, useRef } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { OtpInput } from "../components/OtpInput";
import { NumericKeypad } from "../components/NumericKeypad";

export default function EnterOtpPage() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(false);
  };

  const handleKeypadPress = (key: string) => {
    if (key === "backspace") {
      setOtp((prev) => prev.slice(0, -1));
    } else if (otp.length < 6) {
      setOtp((prev) => prev + key);
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      setError(true);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    router.push("/set-new-password");
  };

  const handleResend = async () => {
    // Simulate resend
    console.log("Resending OTP...");
  };

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-[calc(100vh-100px)] flex flex-col px-4">
        <div className="flex-1 flex flex-col pt-8 max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-[28px] text-[#2D2D2D] mb-3">
              Enter OTP
            </h1>
            <p className="text-[14px] text-[#7F7F7F] leading-relaxed">
              Enter the code sent to your OTP code
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <OtpInput
              length={6}
              value={otp}
              onChange={handleOtpChange}
              onComplete={handleSubmit}
              error={error}
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || otp.length !== 6}
            className="auth-btn flex items-center justify-center gap-2 mb-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading
              </>
            ) : (
              "Continue"
            )}
          </button>

          {/* Resend Link */}
          <button
            onClick={handleResend}
            className="text-[#41B63E] font-medium text-center hover:underline"
          >
            Resend Code
          </button>
        </div>

        {/* Numeric Keypad - Fixed at bottom */}
        <div className="pb-4 pt-8">
          <NumericKeypad onKeyPress={handleKeypadPress} disabled={isLoading} />
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen">
        <div className="min-h-screen w-full flex items-center justify-center relative">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/loginBg.jpg"
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>

          {/* Modal */}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fade-in-up">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/logo.svg" alt="Finzefy" className="h-10" />
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-[#41B63E] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
            </div>

            {/* Title */}
            <p className="text-gray-600 text-center text-sm mb-6">
              Enter the OTP code sent to your email
            </p>

            {/* OTP Input */}
            <div className="mb-6">
              <OtpInput
                length={4}
                value={otp.slice(0, 4)}
                onChange={(val) => setOtp(val)}
                onComplete={() => handleSubmit()}
                error={error}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying
                </>
              ) : (
                "Enter verification"
              )}
            </button>

            {/* Resend Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Didn&apos;t receive code?{" "}
              <button
                onClick={handleResend}
                className="text-[#41B63E] hover:underline font-medium"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
