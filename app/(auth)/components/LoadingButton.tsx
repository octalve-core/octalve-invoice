"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-[#41B63E] hover:bg-[#36a137] text-white border-transparent",
  secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border-transparent",
  outline: "bg-white hover:bg-gray-50 text-gray-700 border-gray-300",
};

const sizeStyles = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "w-full rounded-[30px] font-semibold border-2 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-[#41B63E]/50 focus:ring-offset-2",
        "flex items-center justify-center gap-2",
        "cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        (loading || disabled) && "opacity-70 cursor-not-allowed",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {loading ? "Loading" : children}
    </button>
  );
};

// Green CTA button specifically for auth forms
export const AuthButton: React.FC<
  Omit<LoadingButtonProps, "variant"> & { label?: string }
> = ({ label, children, ...props }) => {
  return (
    <LoadingButton variant="primary" {...props}>
      {label || children}
    </LoadingButton>
  );
};

// Google sign-in button
export const GoogleSignInButton: React.FC<{
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}> = ({ onClick, loading = false, className = "" }) => {
  return (
    <LoadingButton
      variant="outline"
      onClick={onClick}
      loading={loading}
      className={cn("gap-3", className)}
    >
      <img src="/google.svg" alt="Google" className="w-5 h-5" />
      <span className="font-medium">Continue With Google</span>
    </LoadingButton>
  );
};

export default LoadingButton;
