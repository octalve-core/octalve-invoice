interface AnnouncementCardProps {
  date: string;
  title: string;
  description: string;
}

export default function AnnouncementCard({
  date,
  title,
  description,
}: AnnouncementCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-400 mb-2">{date}</p>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
