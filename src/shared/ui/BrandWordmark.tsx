"use client";
import { useState } from "react";
type Props = { className?: string; compact?: boolean; width?: number };
/**
 * Exact official user-supplied PNG assets, not a fabricated Octalve logo.
 * Until the uploaded binaries are committed, the textual placeholder remains.
 */
export function BrandWordmark({ className = "", compact = false, width = 166 }: Props) {
  const [missing, setMissing] = useState(false);
  if (compact) return <span className={className}>Octalve Invoice</span>;
  return <span className={`inline-flex items-center ${className}`}>
    {missing ? <span className="font-semibold tracking-tight">Octalve Invoice</span> :
      <img src="/branding/octalve-wordmark.png" width={width} height={Math.round(width * 641 / 2048)}
        alt="Octalve" onError={() => setMissing(true)} style={{ objectFit: "contain" }} />}
    <span className="sr-only">Invoice application</span>
  </span>;
}
