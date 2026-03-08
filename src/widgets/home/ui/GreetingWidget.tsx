import React from "react";
import Image from "next/image";
import { User as UserIcon, Flame, CalendarCheck } from "lucide-react";
import { DashboardSummary } from "@/entities/dashboard";

interface GreetingProps {
  user: any;
  summary: DashboardSummary | null;
}

export const GreetingWidget = ({ user, summary }: GreetingProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center px-1">
        <div className="space-y-1">
          <h1 className="text-[20px] font-bold text-gray-900 leading-tight">
            안녕하세요{" "}
            <span className="text-gray-950">{user?.name || "사용자"}</span>님
          </h1>
          <p className="text-[14px] font-medium text-slate-400">
            오늘도 잊지 말고 득근하세요!
          </p>
        </div>
        <div className="w-[52px] h-[52px] rounded-full bg-slate-100 overflow-hidden border border-slate-200/50 flex items-center justify-center relative shadow-sm">
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

      <div className="bg-white rounded-[24px] p-6 shadow-sm flex items-center justify-between">
        <div className="flex flex-col items-center gap-2 flex-1 border-r border-slate-100">
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
