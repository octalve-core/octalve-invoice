import React from "react";

export const HorizontalLine = () => {
  return <div className="flex-1 empty:block min-h-0.5 h-0.5 bg-[#D7D7D7]" />;
};

export const LineThroghText = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  return (
    <div className={`w-full flex gap-2 h-10 items-center ${className}`}>
      <HorizontalLine />
      <p> {text} </p>
      <HorizontalLine />
    </div>
  );
};
