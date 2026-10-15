"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import MiniChart from "../charts/MiniChart";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel?: string;
  chartData?: number[];
  chartColor?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  chartData = [30, 40, 25, 50, 49, 60, 70, 91],
  chartColor,
}: StatCardProps) {
  const isPositive = change >= 0;
  const color = chartColor || (isPositive ? "#41B63E" : "#EF4444");

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="w-3 h-3" />
              ) : (
                <ArrowDown className="w-3 h-3" />
              )}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-400">{changeLabel}</span>
          </div>
        </div>
        <div className="w-20 h-12">
          <MiniChart data={chartData} color={color} />
        </div>
      </div>
    </div>
  );
}
