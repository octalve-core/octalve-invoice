interface StatusBadgeProps {
  status:
    | "paid"
    | "pending"
    | "refunded"
    | "draft"
    | "overdue"
    | "sent"
    | "declined"
    | "active"
    | "inactive"
    | "paused"
    | string;
}

const statusStyles: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  paid: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Paid",
  },
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Pending",
  },
  refunded: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Refunded",
  },
  draft: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Draft",
  },
  overdue: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    label: "Overdue",
  },
  sent: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "Sent",
  },
  declined: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Declined",
  },
  active: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Active",
  },
  inactive: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Inactive",
  },
  paused: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Paused",
  }
};

const defaultStyle = {
  bg: "bg-gray-100",
  text: "text-gray-700",
  label: "Unknown",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const style = statusStyles[normalizedStatus] || {
    ...defaultStyle,
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}
