"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { OtpInput } from "../components/OtpInput";
import { NumericKeypad } from "../components/NumericKeypad";
import { SuccessIcon } from "../components/SuccessIcon";

export default function VerifyEmailPage() {
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
    if (otp.length < 4) {
      setError(true);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    router.push("/email-verified");
  };

  const handleResend = async () => {
    console.log("Resending verification code...");
  };

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-[calc(100vh-100px)] flex flex-col px-4">
        <div className="flex-1 flex flex-col pt-8 max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-bold text-[28px] text-[#2D2D2D] mb-3">
              Verify Your Email
            </h1>
            <p className="text-[14px] text-[#7F7F7F] leading-relaxed">
              Check your email, for OTP code
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
            disabled={isLoading || otp.length < 4}
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

        {/* Numeric Keypad */}
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
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-fade-in-up text-center">
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <img src="/logo.svg" alt="Finzefy" className="h-10" />
            </div>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <SuccessIcon size="md" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-[#1D2838] mb-2">
              Check your email
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter the verification code sent to your email
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
