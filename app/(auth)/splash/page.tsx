"use client";

import { useEffect } from "react";
import React from "react";
import { BrandWordmark } from "@/src/shared/ui/BrandWordmark";
import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-navigate to onboarding after 2 seconds
    const timer = setTimeout(() => {
      router.push("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      {/* ==================== MOBILE VIEW ==================== */}
      <div className="smallScreen min-h-screen bg-[#0064E0] flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="animate-scale-in">
          <BrandWordmark className="brightness-0 invert" width={180} />
        </div>

        {/* Tagline */}
        <p
          className="text-white/80 text-sm animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Business Finance Made Simple
        </p>

        {/* Loading dots */}
        <div className="flex gap-1 mt-8">
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>

      {/* ==================== DESKTOP VIEW ==================== */}
      <div className="largeScreen min-h-screen bg-[#0064E0] flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="animate-scale-in">
          <BrandWordmark className="brightness-0 invert" width={180} />
        </div>

        {/* Tagline */}
        <p
          className="text-white/80 text-lg animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          Business Finance Made Simple
        </p>

        {/* Loading dots */}
        <div className="flex gap-2 mt-8">
          <div
            className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-3 h-3 bg-white/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
      </div>
    </>
  );
}
