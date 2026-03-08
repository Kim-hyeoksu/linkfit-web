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
    <div className="mb-8">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-[18px] font-extrabold text-gray-900">
          오늘의 일정
        </h2>
        <Link
          href="/workout/calendar"
          className="text-[12px] font-bold text-slate-400 hover:text-main flex items-center transition-colors"
        >
          전체 보기 <ChevronRight size={14} className="ml-0.5" />
        </Link>
      </div>

      {todayPlan ? (
        <div className="bg-main text-white rounded-[24px] p-6 shadow-lg shadow-blue-500/20 relative overflow-hidden">
          {/* 장식용 그래픽 요소 */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full w-fit tracking-wide">
                  예정된 플랜
                </span>
                <h3 className="text-[20px] font-extrabold mt-1 leading-tight tracking-tight">
                  {todayPlan.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[13px] font-medium text-white/90">
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <Clock size={16} /> {todayPlan.duration}
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <Dumbbell size={16} /> {todayPlan.exercises}개 운동
              </div>
            </div>

            <button className="w-full bg-white text-main font-bold py-3.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors mt-2 active:scale-95 flex items-center justify-center gap-2">
              운동 시작하기 <ChevronRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-1">
            <Calendar size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[15px] font-bold text-slate-700">
              오늘은 일정이 없어요
            </p>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              계획을 세우고 운동을 시작해보세요!
            </p>
          </div>
          <button className="px-5 py-2.5 mt-2 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
            추천 플랜 둘러보기
          </button>
        </div>
      )}
    </div>
  );
};
