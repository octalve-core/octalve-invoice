import type { HTMLAttributes } from "react";
export interface BrandWordmarkProps extends HTMLAttributes<HTMLSpanElement> {
  compact?: boolean;
}
// The verified Octalve Invoice image asset will replace this accessible
// text-only fallback when supplied. Do not use the unrelated Finzefy artwork.
export function BrandWordmark({ compact = false, className = "", ...props }: BrandWordmarkProps) {
  return (
    <span className={`inline-flex items-center font-semibold tracking-tight text-current ${className}`} {...props}>
      {compact ? "Octalve" : "Octalve Invoice"}
    </span>
  );
}
