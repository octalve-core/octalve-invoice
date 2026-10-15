"use client";

import React from "react";
import Link from "next/link";
import { SuccessIcon } from "../components/SuccessIcon";

export default function EmailVerifiedPage() {
  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-[calc(100vh-100px)] flex flex-col justify-center px-4">
        <div className="max-w-md mx-auto w-full text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <SuccessIcon size="lg" />
          </div>

          {/* Title */}
          <h1 className="font-bold text-[28px] text-[#2D2D2D] mb-3">
            Email verified
          </h1>

          {/* Description */}
          <p className="text-[14px] text-[#7F7F7F] leading-relaxed mb-8">
            Your email has been verified successfully. You can now continue to
            set up your account.
          </p>

          {/* Button */}
          <Link
            href="/business-info"
            className="auth-btn inline-flex items-center justify-center"
          >
            Continue
          </Link>
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
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <SuccessIcon size="lg" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-[#1D2838] mb-4">
              Email verified
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6">
              Your email has been verified successfully
            </p>

            {/* Button */}
            <Link
              href="/business-info"
              className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Continue
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
