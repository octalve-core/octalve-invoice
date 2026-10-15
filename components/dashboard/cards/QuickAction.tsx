import type { LucideIcon } from "lucide-react";

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  tone?: "blue" | "green" | "red" | "orange";
  onClick?: () => void;
}
const tones = {
 blue: {surface:"bg-blue-100",foreground:"text-[#0064E0]"},
 green:{surface:"bg-green-100",foreground:"text-green-600"},
 red:{surface:"bg-red-100",foreground:"text-red-600"},
 orange:{surface:"bg-orange-100",foreground:"text-orange-600"}
} as const;
export default function QuickAction({icon:Icon,label,tone="blue",onClick}:QuickActionProps){
 const palette=tones[tone];
 return <button type="button" onClick={onClick}
   className="flex min-w-0 flex-col items-center gap-2 rounded-xl px-1 py-3 transition-colors hover:bg-gray-50 sm:p-4">
   <span className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 ${palette.surface}`}>
     <Icon className={`h-6 w-6 ${palette.foreground}`}/>
   </span>
   <span className="max-w-full text-center text-[11px] font-medium leading-tight text-gray-700 sm:text-sm">{label}</span>
 </button>;
}
