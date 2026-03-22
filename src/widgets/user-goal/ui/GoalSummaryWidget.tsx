"use client";

import React, { useEffect, useState } from "react";
import { Target, ChevronRight } from "lucide-react";
import { UserGoal, getGoals } from "@/entities/user-goal";
import { useRouter } from "next/navigation";

export const GoalSummaryWidget = () => {
  const router = useRouter();
  const [activeGoal, setActiveGoal] = useState<UserGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals();
        if (data && data.length > 0) {
          // 가장 임박하거나 현재 진행 중인 첫 번째 목표 선택 (단순화)
          setActiveGoal(data[0]);
        }
      } catch (e) {
        console.error("Failed to load goals for summary", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const calculateDday = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now <= start) return 0;
    if (now >= end) return 100;

    const total = end - start;
    const current = now - start;
    return Math.round((current / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-50 flex items-center justify-center h-[140px]">
        <div className="animate-spin rounded-full h-7 w-7 border-[3px] border-slate-100 border-t-main"></div>
      </div>
    );
  }

  if (!activeGoal) {
    return (
      <div
        onClick={() => router.push("/mypage")}
        className="bg-white rounded-2xl p-7 shadow-sm border border-slate-50 flex flex-col items-center justify-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
      >
        <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-main transition-colors">
          <Target size={24} />
        </div>
        <div className="text-center">
          <p className="text-slate-900 font-bold text-[16px]">
            아직 설정된 목표가 없어요
          </p>
          <p className="text-slate-400 text-[13px] mt-0.5">
            클릭해서 첫 목표를 세워보세요!
          </p>
        </div>
      </div>
    );
  }

  const getGoalInfo = (goal: UserGoal) => {
    switch (goal.goalType) {
      case "WEIGHT_LOSS":
        return {
          primaryLabel: "목표 체중",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "체지방률",
          secondary: goal.secondaryValue ? `${goal.secondaryValue}%` : null,
          showValues: true,
        };
      case "BULK_UP":
        return {
          primaryLabel: "목표 체중",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "골격근량",
          secondary: goal.secondaryValue ? `${goal.secondaryValue}kg` : null,
          showValues: true,
        };
      case "STRENGTH":
        return {
          primaryLabel: "목표 중량",
          primary: `${goal.primaryValue?.toLocaleString()}kg`,
          secondaryLabel: "목표 횟수",
          secondary: goal.secondaryValue ? `${goal.secondaryValue} Reps` : null,
          showValues: true,
        };
      default:
        return {
          showValues: false,
        };
    }
  };

  const ddayLabel = calculateDday(activeGoal.endDate);
  const progress = calculateProgress(activeGoal.startDate, activeGoal.endDate);
  const isFinished = ddayLabel.startsWith("D+");
  const { primary, secondary, showValues, primaryLabel, secondaryLabel } =
    getGoalInfo(activeGoal);

  return (
    <div
      onClick={() => router.push("/mypage")}
      className="bg-white rounded-2xl p-7 shadow-sm border border-white flex flex-col gap-6 cursor-pointer hover:shadow-md transition-all active:scale-[0.98] group"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-main group-hover:scale-110 transition-transform">
            <Target size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
              나의 목표
            </h2>
            <span className="text-[12px] font-semibold text-slate-400">
              DAILY GOAL
            </span>
          </div>
        </div>
        <div
          className={`text-[13px] font-bold px-3 py-1.5 rounded-full ${isFinished ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-main"}`}
        >
          {ddayLabel}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-[20px] font-bold text-gray-900 leading-tight tracking-tight">
          {activeGoal.targetText}
        </h3>
        {showValues && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-400">
                {primaryLabel}
              </span>
              <span className="text-[18px] font-bold text-gray-800 tracking-tight">
                {primary}
              </span>
            </div>
            {secondary && (
              <div className="flex items-center gap-2 border-l border-slate-100 pl-4">
                <span className="text-[13px] font-semibold text-slate-400">
                  {secondaryLabel}
                </span>
                <span className="text-[18px] font-bold text-gray-800 tracking-tight">
                  {secondary}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-[12px] font-bold text-main">
            {progress}% 진행 중
          </span>
          <span className="text-[11px] font-semibold text-slate-300">
            {activeGoal.endDate}까지
          </span>
        </div>
        <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isFinished ? "bg-slate-300" : "bg-main shadow-sm shadow-blue-100"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
