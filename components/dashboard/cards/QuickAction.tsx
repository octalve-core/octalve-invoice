import { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export default function QuickAction({
  icon: Icon,
  label,
  onClick,
}: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors min-w-[80px]"
    >
      <div className="w-12 h-12 rounded-xl bg-[#E8F5E8] flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#41B63E]" />
      </div>
      <span className="text-xs text-gray-600 font-medium text-center whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}
