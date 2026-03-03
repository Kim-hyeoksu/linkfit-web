"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Header } from "@/shared";
import { BodyMetricsChart } from "@/widgets/user";
import { getBodyMetrics } from "@/entities/user/api/getBodyMetrics";
import { BodyMetric } from "@/entities/user/model/types";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

type TimeRange = "1m" | "3m" | "6m" | "all";

export default function BodyMetricsHistoryPage() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [activeMetrics, setActiveMetrics] = useState<string[]>([
    "weight",
    "skeletalMuscleMass",
    "bodyFatPercentage",
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getBodyMetrics();
        if (data && data.length > 0) {
          // 최신순 정렬 보관 (목록용)
          const sortedByNewest = [...data].sort(
            (a, b) =>
              new Date(b.measuredDate).getTime() -
              new Date(a.measuredDate).getTime(),
          );
          setMetrics(sortedByNewest);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  // 기간 필터링된 데이터 계산
  const filteredData = useMemo(() => {
    if (timeRange === "all") return [...metrics].reverse(); // 차트는 과거순

    const now = new Date();
    const limitDate = new Date();
    if (timeRange === "1m") limitDate.setMonth(now.getMonth() - 1);
    else if (timeRange === "3m") limitDate.setMonth(now.getMonth() - 3);
    else if (timeRange === "6m") limitDate.setMonth(now.getMonth() - 6);

    return metrics
      .filter((m) => new Date(m.measuredDate) >= limitDate)
      .reverse();
  }, [metrics, timeRange]);

  // 인사이트 데이터 계산 (현재 수치 및 증감)
  const insights = useMemo(() => {
    if (metrics.length === 0) return null;
    const latest = metrics[0];
    const prev = metrics[1] || latest;

    const calcDiff = (curr: number, prevVal: number) => {
      const diff = curr - prevVal;
      return {
        val: Math.abs(diff).toFixed(1),
        status: diff > 0 ? "up" : diff < 0 ? "down" : "none",
      };
    };

    return {
      weight: {
        current: latest.weight,
        diff: calcDiff(latest.weight, prev.weight),
        color: "#3b82f6",
        key: "weight",
        label: "체중",
        unit: "kg",
      },
      muscle: {
        current: latest.skeletalMuscleMass,
        diff:
          latest.skeletalMuscleMass && prev.skeletalMuscleMass
            ? calcDiff(latest.skeletalMuscleMass, prev.skeletalMuscleMass)
            : { val: "0.0", status: "none" },
        color: "#ef4444",
        key: "skeletalMuscleMass",
        label: "골격근량",
        unit: "kg",
      },
      fat: {
        current: latest.bodyFatPercentage,
        diff:
          latest.bodyFatPercentage && prev.bodyFatPercentage
            ? calcDiff(latest.bodyFatPercentage, prev.bodyFatPercentage)
            : { val: "0.0", status: "none" },
        color: "#10b981",
        key: "bodyFatPercentage",
        label: "체지방률",
        unit: "%",
      },
    };
  }, [metrics]);

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header title="전체 신체 기록" showBackButton={true} />

      <main className="px-5 pt-4 flex flex-col gap-6">
        {/* 기간 필터 탭 */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          {(["1m", "3m", "6m", "all"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
                timeRange === range
                  ? "bg-main text-white shadow-md shadow-blue-200"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {range === "all" ? "전체" : range.replace("m", "개월")}
            </button>
          ))}
        </div>

        {/* 지표 요약 카드 */}
        <div className="grid grid-cols-3 gap-3">
          {insights &&
            Object.values(insights).map((item) => (
              <button
                key={item.key}
                onClick={() => toggleMetric(item.key)}
                className={`p-3 rounded-2xl flex flex-col gap-1 transition-all border-2 text-left ${
                  activeMetrics.includes(item.key)
                    ? "bg-white border-blue-100 shadow-sm"
                    : "bg-gray-50 border-transparent opacity-60"
                }`}
              >
                <span
                  className="text-[10px] font-bold"
                  style={{ color: item.color }}
                >
                  {item.label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-sm font-black text-gray-800">
                    {item.current || "-"}
                  </span>
                  <span className="text-[9px] text-gray-400">{item.unit}</span>
                </div>
                <div
                  className={`flex items-center text-[9px] font-bold ${
                    item.diff.status === "up"
                      ? "text-red-500"
                      : item.diff.status === "down"
                        ? "text-blue-500"
                        : "text-gray-400"
                  }`}
                >
                  {item.diff.status === "up" && <TrendingUp size={10} />}
                  {item.diff.status === "down" && <TrendingDown size={10} />}
                  {item.diff.status === "none" && <Minus size={10} />}
                  {item.diff.val}
                </div>
              </button>
            ))}
        </div>

        {/* 메인 차트 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">변화 추이</h3>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
              {timeRange === "all"
                ? "전체 기간"
                : `최근 ${timeRange.replace("m", "개월")}`}
            </span>
          </div>
          <div className="w-full h-72">
            <BodyMetricsChart
              data={filteredData}
              activeMetrics={activeMetrics}
            />
          </div>
        </section>

        {/* 기록 목록 */}
        <section className="flex flex-col gap-4">
          <h3 className="font-bold text-gray-800 ml-1">상세 기록 리스트</h3>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
            </div>
          ) : metrics.length === 0 ? (
            <div className="py-8 bg-white rounded-3xl text-center text-gray-500 text-sm border border-gray-100">
              기록된 신체 정보가 없어요.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {metrics.map((item, index) => (
                <div
                  key={index}
                  className="p-5 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-medium">
                      {item.measuredDate}
                    </span>
                    <span className="text-base font-bold text-gray-800">
                      {item.weight}kg
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400">근육량</span>
                      <span className="text-sm font-bold text-gray-700">
                        {item.skeletalMuscleMass
                          ? `${item.skeletalMuscleMass}kg`
                          : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-gray-400">체지방</span>
                      <span className="text-sm font-bold text-gray-700">
                        {item.bodyFatPercentage
                          ? `${item.bodyFatPercentage}%`
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
