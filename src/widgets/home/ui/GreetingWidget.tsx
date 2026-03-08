import React from "react";
import Image from "next/image";
import { User as UserIcon, Flame, CalendarCheck } from "lucide-react";
import { DashboardSummary } from "@/entities/dashboard";

interface GreetingProps {
  user: any; // User type or null
  summary: DashboardSummary | null;
}

export const GreetingWidget = ({ user, summary }: GreetingProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-[20px] font-black text-gray-900 leading-tight tracking-tight">
            안녕하세요{" "}
            <span className="text-main">{user?.name || "사용자"}</span>님! 👋
          </h1>
          <p className="text-[14px] font-bold text-slate-400">
            오늘도 멋진 근육을 만들어볼까요?
          </p>
        </div>
        <div className="w-[58px] h-[58px] rounded-[22px] bg-slate-100 overflow-hidden shadow-inner border border-white/50 flex items-center justify-center relative">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <UserIcon size={24} className="text-slate-300" strokeWidth={2.5} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 이번 달 운동 횟수 */}
        <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-main border border-blue-100">
            <CalendarCheck size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              MONTHLY
            </span>
            <div className="text-[18px] font-black text-gray-900 flex items-baseline gap-0.5">
              {summary?.thisMonthWorkoutCount || 0}
              <span className="text-[12px] font-bold text-slate-300 uppercase ml-0.5">
                회
              </span>
            </div>
          </div>
        </div>

        {/* 현재 스트릭 */}
        <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
            <Flame size={20} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              STREAK
            </span>
            <div className="text-[18px] font-black text-gray-900 flex items-baseline gap-0.5">
              {summary?.currentStreakDays || 0}
              <span className="text-[12px] font-bold text-slate-300 uppercase ml-0.5">
                DAY
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
