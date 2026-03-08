import React from "react";
import { ChevronRight, TrendingUp, Scale, Activity, Award } from "lucide-react";
import Link from "next/link";
import { DashboardSummary } from "@/entities/dashboard";

interface WorkoutStatusProps {
  summary: DashboardSummary | null;
}

export const WorkoutStatusWidget = ({ summary }: WorkoutStatusProps) => {
  if (!summary) return null;

  const { weeklyVolumeChart, bodyMetricSummary, recentlyCompletedPlanName } =
    summary;

  return (
    <div className="flex flex-col gap-8">
      {/* 1. 최근 수행 플랜 하이라이트 */}
      {recentlyCompletedPlanName && (
        <section>
          <div className="flex justify-between items-end mb-3 ml-1">
            <h2 className="text-[18px] font-extrabold text-gray-900">
              최근 완료한 플랜 🏅
            </h2>
          </div>
          <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="min-w-[54px] h-[54px] rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500">
              <Award size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-grow">
              <h3 className="text-[17px] font-black text-gray-900 tracking-tight">
                {recentlyCompletedPlanName}
              </h3>
              <p className="text-[13px] font-bold text-slate-400 mt-0.5">
                성공적으로 마무리했습니다!
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 2. 주간 볼륨 차트 */}
      <section>
        <div className="flex justify-between items-end mb-3 ml-1">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[18px] font-extrabold text-gray-900 tracking-tight">
              주간 볼륨 차트 📈
            </h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">
              Weekly Progression
            </p>
          </div>
          <Link
            href="/workout/calendar"
            className="text-[12px] font-bold text-slate-400 hover:text-main flex items-center transition-colors mb-2"
          >
            기록 보기 <ChevronRight size={14} className="ml-0.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-slate-400 tracking-wide">
                지난 주 평균 대비
              </span>
              <div className="text-[20px] font-black text-main tracking-tight">
                {weeklyVolumeChart.chartMessage}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400">AVG</span>
              <div className="text-[16px] font-extrabold text-slate-700">
                {weeklyVolumeChart.lastWeekAverageVolume.toLocaleString()}kg
              </div>
            </div>
          </div>

          {/* 차트 시각화 (간단한 막대 형태) */}
          <div className="flex items-end justify-between h-32 px-1 mb-2">
            {weeklyVolumeChart.dailyVolumes.map((item, index) => {
              const maxVolume = Math.max(
                ...weeklyVolumeChart.dailyVolumes.map((d) => d.volume),
                weeklyVolumeChart.lastWeekAverageVolume,
                1000,
              );
              const height = (item.volume / maxVolume) * 100;
              const isToday =
                index === weeklyVolumeChart.dailyVolumes.length - 1;

              return (
                <div
                  key={item.date}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="relative group flex flex-col items-center justify-end h-32 w-8">
                    {/* 볼륨 툴팁 (hover 시) */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap z-10 scale-90">
                      {item.volume.toLocaleString()}kg
                    </div>
                    <div
                      className={`w-4 rounded-full transition-all duration-700 ${
                        isToday
                          ? "bg-gradient-to-t from-main to-blue-400 shadow-lg shadow-blue-200"
                          : "bg-slate-100"
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-[12px] font-black ${
                      isToday ? "text-main" : "text-slate-300"
                    }`}
                  >
                    {item.dayOfWeek}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 신체 지표 요약 */}
      {bodyMetricSummary && (
        <section>
          <div className="flex justify-between items-end mb-4 ml-1">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-[18px] font-extrabold text-gray-900 tracking-tight">
                신체 지표 변화 👤
              </h2>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wide">
                Body Metrics Tracking
              </p>
            </div>
            <Link
              href="/body-metrics/history"
              className="text-[12px] font-bold text-slate-400 hover:text-main flex items-center transition-colors mb-2"
            >
              상세 변화 <ChevronRight size={14} className="ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 체중 */}
            <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                <Scale size={14} className="text-blue-500" /> Weight
              </div>
              <div className="text-[26px] font-black text-gray-900 tracking-tight mb-1">
                {bodyMetricSummary.currentWeight}
                <span className="text-[12px] font-bold text-slate-300 uppercase ml-1">
                  kg
                </span>
              </div>
              <div
                className={`text-[12px] font-bold flex items-center gap-0.5 ${
                  bodyMetricSummary.weightDiff <= 0
                    ? "text-blue-500"
                    : "text-red-500"
                }`}
              >
                {bodyMetricSummary.weightDiff >= 0 ? "▲" : "▼"}{" "}
                {Math.abs(bodyMetricSummary.weightDiff)}kg
              </div>
            </div>

            {/* 골격근량 */}
            <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">
                <TrendingUp size={14} className="text-main" /> Muscle
              </div>
              <div className="text-[26px] font-black text-gray-900 tracking-tight mb-1">
                {bodyMetricSummary.currentSkeletalMuscleMass}
                <span className="text-[12px] font-bold text-slate-300 uppercase ml-1">
                  kg
                </span>
              </div>
              <div
                className={`text-[12px] font-bold flex items-center gap-0.5 ${
                  bodyMetricSummary.skeletalMuscleMassDiff >= 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {bodyMetricSummary.skeletalMuscleMassDiff > 0
                  ? `▲ ${bodyMetricSummary.skeletalMuscleMassDiff}kg`
                  : bodyMetricSummary.skeletalMuscleMassDiff < 0
                    ? `▼ ${Math.abs(bodyMetricSummary.skeletalMuscleMassDiff)}kg`
                    : "유지"}
              </div>
            </div>

            {/* 체지방률 (Full Width) */}
            <div className="col-span-2 bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  <Activity size={14} className="text-orange-500" /> Body Fat
                </div>
                <div className="text-[28px] font-black text-gray-900 tracking-tight">
                  {bodyMetricSummary.currentBodyFatPercentage}
                  <span className="text-[12px] font-bold text-slate-300 uppercase ml-1">
                    %
                  </span>
                </div>
              </div>
              <div
                className={`px-4 py-2 rounded-2xl font-black text-[14px] flex items-center gap-1.5 ${
                  bodyMetricSummary.bodyFatPercentageDiff <= 0
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-red-50 text-red-500 border border-red-100"
                }`}
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
