import React from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import { DashboardSummary } from "@/entities/dashboard";

interface GreetingProps {
  user: { name?: string; profileImage?: string } | null;
  summary: DashboardSummary | null;
}

export const GreetingWidget = ({ user, summary }: GreetingProps) => {
  return (
    <div className="bg-white rounded-2xl py-6 px-5 shadow-sm flex flex-col gap-7">
      {/* 상단 인사말 */}
      <div className="flex justify-between items-pcenter">
        <div className="space-y-1.5">
          <h1 className="text-[20px] font-bold text-gray-900 leading-tight tracking-tight">
            안녕하세요,{" "}
            <span className="text-main">{user?.name || "사용자"}</span>님{" "}
            <span className="inline-block animate-bounce-subtle origin-bottom">
              👋
            </span>
          </h1>
          <p className="text-[15px] font-semibold text-slate-500/80 leading-relaxed">
            오늘도 멋진 근육을 만들 준비 되셨나요?
          </p>
        </div>
        <div className="w-[52px] h-[52px] rounded-full bg-slate-50 overflow-hidden border border-slate-100 flex items-center justify-center relative shadow-sm">
          {user?.profileImage ? (
            <Image
              src={user.profileImage}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <UserIcon size={24} className="text-slate-300" strokeWidth={2} />
          )}
        </div>
      </div>

      {/* 하단 지표 요약 (구분선 추가) */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-7">
        <div className="flex flex-col items-center gap-2 flex-1 border-r border-slate-50">
          <div className="text-[13px] font-semibold text-slate-400">
            이번 달
          </div>
          <div className="text-[20px] font-bold text-gray-900 flex items-baseline gap-0.5">
            {summary?.thisMonthWorkoutCount || 0}
            <span className="text-[13px] font-medium text-slate-400 ml-0.5">
              회
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 flex-1">
          <div className="text-[13px] font-semibold text-slate-400">
            연속 운동
          </div>
          <div className="text-[20px] font-bold text-gray-900 flex items-baseline gap-0.5">
            {summary?.currentStreakDays || 0}
            <span className="text-[13px] font-medium text-slate-400 ml-0.5">
              일
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
