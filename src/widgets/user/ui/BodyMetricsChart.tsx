"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getBodyMetrics } from "@/entities/user/api/getBodyMetrics";
import { BodyMetric } from "@/entities/user/model/types";

export const BodyMetricsChart = () => {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getBodyMetrics();
        if (data && data.length > 0) {
          // 최신순으로 올 수도 있으므로 날짜 과거순으로 오름차순 정렬
          const sortedData = [...data].sort(
            (a, b) =>
              new Date(a.measuredDate).getTime() -
              new Date(b.measuredDate).getTime(),
          );
          setMetrics(sortedData);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10 h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  if (metrics.length === 0) {
    return (
      <div className="py-8 h-64 flex items-center justify-center text-center text-gray-500 text-sm">
        기록된 변화 추이가 없어요.
      </div>
    );
  }

  return (
    <div className="w-full h-72 mt-2 text-xs font-sans flex flex-col [&_.recharts-wrapper]:!outline-none [&_.recharts-surface]:!outline-none">
      {/* 축 정보 안내표시 */}
      <div className="flex justify-between text-[10px] text-gray-400 px-2 z-10 w-full relative top-2">
        <span>단위: kg</span>
        <span>단위: %</span>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="focus:outline-none"
        >
          <LineChart
            data={metrics}
            margin={{ top: 15, right: -15, left: -35, bottom: 0 }}
            style={{ outline: "none" }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="measuredDate"
              tick={{ fill: "#9ca3af" }}
              tickFormatter={(tick) => {
                // "YYYY-MM-DD" 형식을 "MM.DD"로 변환
                if (!tick) return "";
                const date = new Date(tick);
                return `${date.getMonth() + 1}.${date.getDate()}`;
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              yAxisId="weight"
              domain={["auto", "auto"]}
              tick={{ fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="percent"
              orientation="right"
              domain={["auto", "auto"]}
              tick={{ fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                fontSize: "12px",
              }}
              labelFormatter={(label) => {
                const date = new Date(label);
                return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
              }}
              itemStyle={{ padding: "2px 0" }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="circle"
              iconSize={8}
            />
            {/* 체중 선 */}
            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="weight"
              name="체중(kg)"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
            {/* 골격근량 선 (없는 경우 이어주도록 connectNulls 설정) */}
            <Line
              yAxisId="weight"
              type="monotone"
              dataKey="skeletalMuscleMass"
              name="골격근량(kg)"
              stroke="#ef4444"
              strokeWidth={3}
              connectNulls
              dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
            {/* 체지방률 선 */}
            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="bodyFatPercentage"
              name="체지방률(%)"
              stroke="#10b981"
              strokeWidth={3}
              connectNulls
              dot={{ r: 4, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
