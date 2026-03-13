import React from "react";
import { ChevronRight, TrendingUp, Scale, Award } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DashboardSummary } from "@/entities/dashboard";

interface WorkoutStatusProps {
  summary: DashboardSummary | null;
}

export const WorkoutStatusWidget = ({ summary }: WorkoutStatusProps) => {
  const router = useRouter();
  if (!summary) return null;

  const {
    weeklyVolumeChart,
    bodyMetricSummary,
    recentlyCompletedPlanName,
    recentlyCompletedSessionId,
  } = summary;

  return (
    <div className="flex flex-col gap-6">
      {/* 최근 완료한 플랜 */}
      {recentlyCompletedPlanName && (
        <section
          onClick={() => {
            if (recentlyCompletedSessionId) {
              router.push(
                `/workout/sessions/${recentlyCompletedSessionId}/complete`,
              );
            }
          }}
          className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-semibold text-main uppercase tracking-tight">
              RECENTLY COMPLETED
            </span>
            <h3 className="text-[17px] font-bold text-gray-900 leading-tight">
              {recentlyCompletedPlanName}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-main group-hover:bg-blue-100 transition-colors">
            <Award size={22} strokeWidth={2.5} />
          </div>
        </section>
      )}

      {/* 주간 볼륨 차트 */}
      <section className="bg-white p-7 rounded-2xl shadow-sm flex flex-col gap-6 border border-white">
        <div className="flex justify-between items-start mb-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
              주간 운동 볼륨
            </h2>
            <div
              className={`text-[15px] font-semibold ${weeklyVolumeChart.chartMessage.includes("성공") ? "text-blue-500" : "text-slate-500"}`}
            >
              {weeklyVolumeChart.chartMessage}
            </div>
          </div>
          <Link
            href="/workout/calendar"
            className="text-[12px] font-bold text-slate-400 hover:text-main flex items-center transition-all"
          >
            전체 기록 <ChevronRight size={14} className="ml-0.5" />
          </Link>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between h-28 px-2 gap-3">
            {weeklyVolumeChart.dailyVolumes.map((item, index) => {
              const maxVolume = Math.max(
                ...weeklyVolumeChart.dailyVolumes.map((d) => d.volume),
                weeklyVolumeChart.lastWeekAverageVolume,
                500,
              );
              const height = (item.volume / maxVolume) * 100;
              const isToday =
                index === weeklyVolumeChart.dailyVolumes.length - 1;

              return (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center gap-4 group"
                >
                  <div className="relative w-full h-28 flex flex-col justify-end items-center">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-all bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl pointer-events-none whitespace-nowrap z-10 bottom-full mb-2 shadow-xl">
                      {item.volume.toLocaleString()}kg
                    </div>
                    <div
                      className={`w-full max-w-[12px] rounded-full transition-all duration-1000 ${
                        isToday
                          ? "bg-main shadow-lg shadow-blue-100"
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-[12px] font-bold ${isToday ? "text-main" : "text-slate-300"}`}
                  >
                    {item.dayOfWeek}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[13px] font-medium text-slate-400">
              지난 주 평균
            </span>
            <span className="text-[15px] font-bold text-slate-700">
              {weeklyVolumeChart.lastWeekAverageVolume.toLocaleString()}kg
            </span>
          </div>
        </div>
      </section>

      {/* 신체 지표 요약 - Toss 스타일 리스트형 */}
      {bodyMetricSummary && (
        <section className="bg-white p-7 rounded-2xl shadow-sm flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
              신체 지표 현황
            </h2>
            <Link
              href="/body-metrics/history"
              className="text-[13px] font-semibold text-slate-400 hover:text-main transition-colors"
            >
              더보기
            </Link>
          </div>

          <div className="flex flex-col gap-5">
            {/* 체중 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <Scale size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-slate-400">
                    체중
                  </span>
                  <div className="text-[17px] font-bold text-gray-900">
                    {bodyMetricSummary.currentWeight}kg
                  </div>
                </div>
              </div>
              <div
                className={`text-[13px] font-bold px-3 py-1.5 rounded-full ${bodyMetricSummary.weightDiff <= 0 ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"}`}
              >
                {bodyMetricSummary.weightDiff >= 0 ? "+" : ""}
                {bodyMetricSummary.weightDiff}kg
              </div>
            </div>

            {/* 골격근량 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                  <TrendingUp size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-semibold text-slate-400">
                    골격근량
                  </span>
                  <div className="text-[17px] font-bold text-gray-900">
                    {bodyMetricSummary.currentSkeletalMuscleMass}kg
                  </div>
                </div>
              </div>
              <div
                className={`text-[13px] font-bold px-3 py-1.5 rounded-full ${bodyMetricSummary.skeletalMuscleMassDiff >= 0 ? "bg-blue-50 text-blue-500" : "bg-red-50 text-red-500"}`}
              >
                {bodyMetricSummary.skeletalMuscleMassDiff >= 0 ? "+" : ""}
                {bodyMetricSummary.skeletalMuscleMassDiff}kg
              </div>
            </div>

            {/* 체지방률 */}
            <div className="flex items-center justify-between border-t border-slate-50 pt-5 mt-2">
              <div className="flex flex-col">
                <span className="text-[14px] font-semibold text-slate-400">
                  체지방률
                </span>
                <div className="text-[20px] font-bold text-gray-900 mt-0.5">
                  {bodyMetricSummary.currentBodyFatPercentage}%
                </div>
              </div>
              <div
                className={`text-[15px] font-bold ${bodyMetricSummary.bodyFatPercentageDiff <= 0 ? "text-blue-500" : "text-red-500"}`}
              >
                {bodyMetricSummary.bodyFatPercentageDiff >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(bodyMetricSummary.bodyFatPercentageDiff)}%
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
