import React from "react";
import { ChevronRight, Target, Flame, Activity } from "lucide-react";
import Link from "next/link";

export const WorkoutStatusWidget = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[18px] font-extrabold text-gray-900">
          이번 주 운동 기록
        </h2>
        <Link
          href="/workout/calendar"
          className="text-[12px] font-bold text-slate-400 hover:text-main flex items-center transition-colors"
        >
          기록 보기 <ChevronRight size={14} className="ml-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* 달성률 카드 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2.5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
            <Target size={14} className="text-orange-500" /> 주간 달성률
          </div>
          <div className="text-[28px] font-black text-gray-900 flex items-baseline gap-1 tracking-tight">
            75<span className="text-[14px] font-bold text-slate-400">%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 h-1.5 rounded-full"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>

        {/* 총 볼륨 카드 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2.5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500 uppercase tracking-widest">
            <Flame size={14} className="text-red-500" /> 총 볼륨
          </div>
          <div className="text-[28px] font-black text-gray-900 flex items-baseline gap-1 tracking-tight">
            15.2
            <span className="text-[14px] font-bold text-slate-400">ton</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-400 to-red-500 h-1.5 rounded-full"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>

      {/* 가벼운 피드백용 카드 */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
        <div className="min-w-[48px] h-[48px] rounded-2xl bg-blue-50 flex items-center justify-center text-main border border-blue-100">
          <Activity size={24} strokeWidth={2} />
        </div>
        <div>
          <div className="text-[15px] font-extrabold text-gray-900 mb-0.5">
            꾸준히 잘하고 있어요!
          </div>
          <div className="text-[13px] font-medium text-slate-500">
            이번 주 목표 달성까지 2회 남았습니다.
          </div>
        </div>
      </div>
    </div>
  );
};
