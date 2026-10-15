"use client";
import { useState } from "react";
export function BrandIcon({ size = 36, className = "" }: { size?: number; className?: string }) {
  const [missing, setMissing] = useState(false);
  return missing ?
    <span aria-label="Octalve Invoice" className={`inline-flex items-center justify-center rounded-lg bg-[#0064E0] text-white font-bold ${className}`} style={{width:size,height:size}}>O</span> :
    <img src="/branding/octalve-invoice-icon.png" width={size} height={size}
      alt="Octalve Invoice icon" className={className} style={{objectFit:"contain"}}
      onError={() => setMissing(true)} />;
}
