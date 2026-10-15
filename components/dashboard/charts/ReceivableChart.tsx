"use client";

import { ArrowUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const chartData = [
  { month: "Jan", current: 200000, overdue: 100000, outstanding: 50000 },
  { month: "Feb", current: 350000, overdue: 200000, outstanding: 100000 },
  { month: "Mar", current: 450000, overdue: 250000, outstanding: 150000 },
  { month: "Apr", current: 400000, overdue: 300000, outstanding: 200000 },
  { month: "May", current: 500000, overdue: 350000, outstanding: 180000 },
  { month: "Jun", current: 600000, overdue: 400000, outstanding: 250000 },
  { month: "Jul", current: 550000, overdue: 380000, outstanding: 220000 },
  { month: "Aug", current: 700000, overdue: 450000, outstanding: 300000 },
  { month: "Sep", current: 650000, overdue: 420000, outstanding: 280000 },
  { month: "Oct", current: 750000, overdue: 500000, outstanding: 350000 },
  { month: "Nov", current: 800000, overdue: 550000, outstanding: 400000 },
  { month: "Dec", current: 900000, overdue: 600000, outstanding: 450000 },
];

interface ReceivableChartProps {
  totalAmount?: string;
  percentChange?: number;
}

export default function ReceivableChart({
  totalAmount = "₦1,057,235.31",
  percentChange = 7,
}: ReceivableChartProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Receivable Summary</span>
            <span className="text-xs text-gray-400">
              AMOUNT RECEIVABLE: MONTHLY
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {totalAmount}
            </span>
            <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <ArrowUp className="w-4 h-4" />
              {percentChange}%
            </span>
            <span className="text-sm text-gray-400">+ Last month ₦925,000</span>
          </div>
        </div>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#41B63E]/20">
          <option>Monthly (2024)</option>
          <option>Monthly (2023)</option>
        </select>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2} barCategoryGap="20%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              formatter={(value?: number) => [
                `₦${(value ?? 0).toLocaleString()}`,
                "",
              ]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              formatter={(value) => (
                <span className="text-sm text-gray-600 capitalize">
                  {value}
                </span>
              )}
            />
            <Bar
              dataKey="current"
              fill="#41B63E"
              radius={[4, 4, 0, 0]}
              name="Current"
            />
            <Bar
              dataKey="overdue"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
              name="Overdue"
            />
            <Bar
              dataKey="outstanding"
              fill="#EF4444"
              radius={[4, 4, 0, 0]}
              name="Outstanding"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
