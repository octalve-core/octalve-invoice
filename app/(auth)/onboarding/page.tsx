"use client";

import React from "react";
import Link from "next/link";

export default function OnboardingPage() {
  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-screen bg-white flex flex-col">
        {/* Top Section - Illustration */}
        <div className="flex-1 flex items-center justify-center px-8 pt-8">
          <div className="w-full max-w-sm">
            {/* Illustration placeholder - replace with actual illustration */}
            <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
              {/* Abstract shapes for illustration */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-[#41B63E]/20 rounded-full" />
              <div className="absolute bottom-8 right-8 w-32 h-32 bg-[#41B63E]/10 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <img src="/logo.svg" alt="Finzefy" className="h-16" />
              </div>
              {/* Floating elements */}
              <div className="absolute top-8 right-12 bg-white shadow-lg px-3 py-1.5 rounded-lg text-xs animate-float">
                📊 Dashboard
              </div>
              <div className="absolute bottom-12 left-8 bg-[#41B63E] text-white shadow-lg px-3 py-1.5 rounded-lg text-xs animate-float-delayed">
                💰 Invoice
              </div>
              <div className="absolute top-1/3 right-4 bg-purple-100 text-purple-600 shadow-lg px-3 py-1.5 rounded-lg text-xs animate-float-slow">
                📈 Reports
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Content */}
        <div className="px-8 pb-12">
          {/* Title */}
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-3 text-center">
            Manage Your Business Finances
          </h1>

          {/* Description */}
          <p className="text-[#7F7F7F] text-sm text-center mb-8 leading-relaxed">
            Track expenses, create invoices, and manage your business finances
            all in one place. Get started in minutes.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              href="/signup"
              className="block w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-4 rounded-[30px] text-center transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="block w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-[30px] text-center hover:bg-gray-50 transition-colors"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen min-h-screen bg-white grid grid-cols-2">
        {/* Left - Illustration */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative overflow-hidden">
          {/* Background shapes */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-[#41B63E]/20 rounded-full" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-[#41B63E]/10 rounded-full" />

          {/* Center content */}
          <div className="relative z-10 text-center">
            <img src="/logo.svg" alt="Finzefy" className="h-20 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#1D2838] mb-2">
              Welcome to Finzefy
            </h2>
            <p className="text-gray-600">
              Your complete business finance solution
            </p>
          </div>

          {/* Floating badges */}
          <div className="absolute top-[15%] right-[20%] bg-white shadow-lg px-4 py-2 rounded-xl text-sm flex items-center gap-2 animate-float">
            📊 Dashboard
          </div>
          <div className="absolute bottom-[20%] left-[15%] bg-[#41B63E] text-white shadow-lg px-4 py-2 rounded-xl text-sm animate-float-delayed">
            💰 Invoice
          </div>
          <div className="absolute top-[40%] left-[10%] bg-purple-100 text-purple-600 shadow-lg px-4 py-2 rounded-xl text-sm animate-float-slow">
            📈 Reports
          </div>
          <div className="absolute bottom-[35%] right-[10%] bg-yellow-100 text-yellow-700 shadow-lg px-4 py-2 rounded-xl text-sm animate-float">
            💳 Expenses
          </div>
        </div>

        {/* Right - Content */}
        <div className="flex items-center justify-center px-16">
          <div className="w-full max-w-md">
            {/* Title */}
            <h1 className="text-4xl font-bold text-[#1D2838] mb-4">
              Manage Your Business Finances
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-10 leading-relaxed">
              Track expenses, create invoices, manage receipts, and get insights
              into your business finances. Everything you need in one powerful
              platform.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#41B63E]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Create professional invoices
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#41B63E]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Track expenses in real-time
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-[#41B63E]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-gray-700">
                  Generate financial reports
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-4">
              <Link
                href="/signup"
                className="block w-full bg-[#41B63E] hover:bg-[#36a137] text-white font-semibold py-4 rounded-lg text-center transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="block w-full border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-lg text-center hover:bg-gray-50 transition-colors"
              >
                I already have an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
