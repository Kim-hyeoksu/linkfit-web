import React from "react";
import { ChevronRight, Calendar, Dumbbell, Clock } from "lucide-react";
import Link from "next/link";

export const UpcomingScheduleWidget = () => {
  // TODO: 향후 API 연동 시 사용할 더미 데이터
  const todayPlan = {
    title: "1주차 월요일 - 하체",
    duration: "60분",
    exercises: 5,
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex justify-between items-end mb-1 px-1">
        <h2 className="text-[18px] font-bold text-gray-900 tracking-tight">
          오늘의 운동 일정
        </h2>
        <Link
          href="/workout/calendar"
          className="text-[13px] font-semibold text-slate-400 hover:text-main flex items-center transition-colors mb-1"
        >
          전체 일정 <ChevronRight size={14} className="ml-0.5" />
        </Link>
      </div>

      {todayPlan ? (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-white relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <span className="text-[12px] font-bold px-3 py-1 bg-blue-50 text-main rounded-full w-fit tracking-wide uppercase">
                  ACTIVE PLAN
                </span>
                <h3 className="text-[20px] font-bold text-gray-900 leading-tight">
                  {todayPlan.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  DURATION
                </span>
                <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-700">
                  <Clock size={16} /> {todayPlan.duration}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  EXERCISES
                </span>
                <div className="flex items-center gap-1.5 text-[14px] font-bold text-slate-700">
                  <Dumbbell size={16} /> {todayPlan.exercises}개 종목
                </div>
              </div>
            </div>

            <button className="w-full bg-main text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/10 hover:bg-blue-600 transition-colors mt-2 active:scale-95 flex items-center justify-center gap-2">
              운동 시작하기 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] p-8 border border-slate-50 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Calendar size={32} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <p className="text-[16px] font-bold text-gray-800">
              오늘은 쉬는 날이에요
            </p>
            <p className="text-[14px] text-slate-400 font-medium">
              충분한 휴식도 성장에 중요합니다!
            </p>
          </div>
          <button className="px-6 py-3 mt-2 bg-slate-50 rounded-2xl text-[14px] font-bold text-slate-500 hover:bg-slate-100 transition-all">
            내일 일정 확인하기
          </button>
        </div>
      )}
    </div>
  );
};
