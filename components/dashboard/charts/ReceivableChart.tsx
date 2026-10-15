"use client";

import { ArrowUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
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
    <div className="min-w-0 overflow-hidden bg-white rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <span>Receivable Summary</span>
            <span className="text-xs text-gray-400">
              Your current sales summary and activity
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span className="text-xl sm:text-3xl font-bold break-all text-gray-900">
              {totalAmount}
            </span>
            <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <ArrowUp className="w-4 h-4" />
              {percentChange}%
            </span>

          </div>
          <p className="mt-1 text-xs text-gray-500">Last month ₦925,000 · sample figures</p>
        </div>
        <select aria-label="Chart period" className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0064E0]/20">
          <option>Monthly (2024)</option>
          <option>Monthly (2023)</option>
        </select>
      </div>

      {/* Chart */}
      <div className="hidden h-[300px] min-w-0 sm:block">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={2} barCategoryGap="32%">
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              formatter={(value) => [
                `₦${Number(value ?? 0).toLocaleString()}`,
                "",
              ]}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar
              dataKey="current"
              fill="#0064E0"
              radius={[4, 4, 0, 0]}
              name="Current"
            />
            <Bar
              dataKey="overdue"
              fill="#22C55E"
              radius={[2, 2, 0, 0]}
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
      <div className="relative -mx-1 mt-4 h-[220px] min-w-0 sm:hidden" role="img"
        aria-label="Monthly receivables comparison chart for January through December, with blue current, green overdue and red outstanding bars">
        <div className="absolute inset-x-6 top-0 bottom-7 flex flex-col justify-between text-[9px] text-gray-400" aria-hidden="true">
          <span>1M</span><span>750k</span><span>500k</span><span>250k</span><span>0</span>
        </div>
        <div className="absolute inset-y-0 left-8 right-1 grid grid-cols-12 gap-0.5">
          {chartData.map(row=><div key={row.month} className="flex min-w-0 flex-col justify-end">
            <div className="flex h-[184px] items-end justify-center gap-[1px]">
             {([["current",row.current,"bg-[#0064E0]"],["overdue",row.overdue,"bg-green-500"],["outstanding",row.outstanding,"bg-red-500"]] as const).map(([key,amount,color])=>
              <span key={key} title={`${row.month} ${key}: ₦${amount.toLocaleString()}`}
               style={{height:`${Math.max(2,amount/1000000*100)}%`}} className={`w-[3px] min-w-[2px] max-w-[6px] rounded-t-sm ${color}`}/>)}
            </div>
            <span className="mt-2 truncate text-center text-[9px] text-gray-500">{row.month}</span>
          </div>)}
        </div>
      </div>
    </div>
  );
}
