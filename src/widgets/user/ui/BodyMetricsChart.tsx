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

export const BodyMetricsChart = ({
  data,
  activeMetrics = ["weight", "skeletalMuscleMass", "bodyFatPercentage"],
  hideUnitLabels = false,
}: {
  data: BodyMetric[];
  activeMetrics?: string[];
  hideUnitLabels?: boolean;
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="py-8 h-64 flex items-center justify-center text-center text-gray-500 text-sm">
        기록된 변화 추이가 없어요.
      </div>
    );
  }

  // 데이터 날짜순 정렬
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a.measuredDate).getTime() - new Date(b.measuredDate).getTime(),
  );

  return (
    <div className="w-full h-full text-xs font-sans flex flex-col [&_.recharts-wrapper]:!outline-none [&_.recharts-surface]:!outline-none">
      {/* 축 정보 안내표시 */}
      {!hideUnitLabels && (
        <div className="flex justify-between text-[10px] text-gray-400 px-2 z-10 w-full relative top-2">
          {activeMetrics.some(
            (m) => m === "weight" || m === "skeletalMuscleMass",
          ) && <span>단위: kg</span>}
          {activeMetrics.includes("bodyFatPercentage") && (
            <span className="ml-auto">단위: %</span>
          )}
        </div>
      )}
      <div className="flex-1 w-full relative">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="focus:outline-none"
        >
          <LineChart
            data={sortedData}
            margin={{
              top: 15,
              right: activeMetrics.includes("bodyFatPercentage") ? -25 : 0,
              left: -35,
              bottom: 0,
            }}
            style={{ outline: "none" }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="measuredDate"
              padding={{ left: 10, right: 10 }}
              tick={{ fill: "#9ca3af" }}
              tickFormatter={(tick) => {
                if (!tick) return "";
                const date = new Date(tick);
                return `${date.getMonth() + 1}.${date.getDate()}`;
              }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            {(activeMetrics.includes("weight") ||
              activeMetrics.includes("skeletalMuscleMass")) && (
              <YAxis
                yAxisId="weight"
                domain={["auto", "auto"]}
                tick={{ fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
            )}
            {activeMetrics.includes("bodyFatPercentage") && (
              <YAxis
                yAxisId="percent"
                orientation="right"
                domain={["auto", "auto"]}
                tick={{ fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
            )}
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
            {activeMetrics.includes("weight") && (
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
            )}
            {activeMetrics.includes("skeletalMuscleMass") && (
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
            )}
            {activeMetrics.includes("bodyFatPercentage") && (
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
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
