"use client";

import React from "react";
import Link from "next/link";
import { SuccessIcon } from "../components/SuccessIcon";

export default function CheckEmailPage() {
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
            Check your email
          </h1>

          {/* Description */}
          <p className="text-[14px] text-[#7F7F7F] leading-relaxed mb-8">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions.
          </p>

          {/* Button */}
          <a
            href="mailto:"
            className="auth-btn inline-flex items-center justify-center"
          >
            Go to your email
          </a>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Back to{" "}
            <Link
              href="/login"
              className="text-[#41B63E] hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
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
              Check your email
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6">
              We&apos;ve sent a password reset link to your email. Check your
              inbox and click on the link to reset your password.
            </p>

            {/* Button */}
            <a
              href="mailto:"
              className="w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Go to your email
            </a>

            {/* Back to Login */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Back to{" "}
              <Link
                href="/login"
                className="text-[#41B63E] hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
