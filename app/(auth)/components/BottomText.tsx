import Link from "next/link";
import React from "react";

interface BottomTextProps {
  text?: string | React.ReactNode;
  className?: string;
}

export const BottomText = ({ text = "", className = "" }: BottomTextProps) => {
  return (
    <div>
      <p
        className={`text-center text-[14px] leading-[20px] tracking-[0%] text-[#727475] font-nunito font-medium ${className}`}
      >
        {text ? (
          text
        ) : (
          <>
            Have an account?{" "}
            <Link href="/login" className="text-[#41B63E] font-bold">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
};
