import React from "react";
import { AuthHeader } from "./components/AuthHeader";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Authentication",
  description: "User authentication pages",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="auth-container auth-layout bg-white">
      {/* SMALL SCREENS */}
      <div className="smallScreen min-h-screen">
        <div className="header p-4 flex justify-between items-center">
          <AuthHeader />
        </div>

        <div className="px-4 py-2 flex-1">{children}</div>
      </div>

      {/* LARGE SCREENS */}
      <div className="largeScreen">{children}</div>

      <Toaster />
    </main>
  );
}
