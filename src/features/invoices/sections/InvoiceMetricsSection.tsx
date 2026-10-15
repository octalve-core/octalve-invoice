"use client";

import StatCard from "@/components/dashboard/cards/StatCard";

/** Preserved Finzefy invoice-card layout, with demo fixtures isolated here.
 * TODO backend phase: replace these fixtures using authorized merchant totals.
 */
const previewMetrics = [
  { title: "Total sales generated", value: "2,420", change: 40,
    chartData: [30, 40, 25, 50, 49, 60, 70, 91, 85, 95], chartColor: "#0064E0" },
  { title: "Total Invoice", value: "1,210", change: -8,
    chartData: [50, 45, 60, 55, 40, 35, 45, 40, 35, 30], chartColor: "#EF4444" },
  { title: "Total Orders", value: "316", change: 23,
    chartData: [20, 35, 40, 50, 55, 60, 65, 70, 80, 85], chartColor: "#0064E0" },
] as const;

export function InvoiceMetricsSection() {
  return (
    <section aria-label="Invoice preview metrics">
      <p className="mb-2 text-xs text-gray-500">Sample figures — UI preview only</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {previewMetrics.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value}
            change={stat.change} chartData={[...stat.chartData]} chartColor={stat.chartColor} />
        ))}
      </div>
    </section>
  );
}
