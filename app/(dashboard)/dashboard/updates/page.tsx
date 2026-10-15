import Tabs from "@/components/dashboard/ui/Tabs";
import AnnouncementCard from "@/components/dashboard/cards/AnnouncementCard";

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Announcement", href: "/dashboard/announcement" },
  { label: "Recent Update", href: "/dashboard/updates" },
];

const updates = [
  {
    id: 1,
    date: "29 September 2023",
    title: "Prevent Duplicate Payments",
    description:
      "In cases where your customers make invoice payments via ACH or direct debit, the transaction could remain in the Pending status for a long time. During this time, there's a chance for your customers to initiate another (duplicate) payment. To prevent this, go to Settings > Customer Portal and check the 'Prevent Duplicate Payments' option.",
  },
  {
    id: 2,
    date: "29 September 2023",
    title: "Prevent Duplicate Payments",
    description:
      "In cases where your customers make invoice payments via ACH or direct debit, the transaction could remain in the Pending status for a long time. During this time, there's a chance for your customers to initiate another (duplicate) payment. To prevent this, go to Settings > Customer Portal and check the 'Prevent Duplicate Payments' option.",
  },
  {
    id: 3,
    date: "29 September 2023",
    title: "Prevent Duplicate Payments",
    description:
      "In cases where your customers make invoice payments via ACH or direct debit, the transaction could remain in the Pending status for a long time. During this time, there's a chance for your customers to initiate another (duplicate) payment. To prevent this, go to Settings > Customer Portal and check the 'Prevent Duplicate Payments' option.",
  },
  {
    id: 4,
    date: "29 September 2023",
    title: "Prevent Duplicate Payments",
    description:
      "In cases where your customers make invoice payments via ACH or direct debit, the transaction could remain in the Pending status for a long time. During this time, there's a chance for your customers to initiate another (duplicate) payment. To prevent this, go to Settings > Customer Portal and check the 'Prevent Duplicate Payments' option.",
  },
  {
    id: 5,
    date: "29 September 2023",
    title: "Prevent Duplicate Payments",
    description:
      "In cases where your customers make invoice payments via ACH or direct debit, the transaction could remain in the Pending status for a long time. During this time, there's a chance for your customers to initiate another (duplicate) payment. To prevent this, go to Settings > Customer Portal and check the 'Prevent Duplicate Payments' option.",
  },
];

export default function RecentUpdatesPage() {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <Tabs tabs={tabs} />

      {/* Updates List */}
      <div className="space-y-4">
        {updates.map((update) => (
          <AnnouncementCard
            key={update.id}
            date={update.date}
            title={update.title}
            description={update.description}
          />
        ))}
      </div>
    </div>
  );
}
