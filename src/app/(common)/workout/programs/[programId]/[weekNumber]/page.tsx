"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPlans, PlanList } from "@/entities/plan";
import type { PlanListResponse, PlanListItemResponse } from "@/entities/plan";
import { Header } from "@/shared";
import Link from "next/link";
import { ImportProgramButton } from "@/features/program-import";

export default function WorkoutProgramWeekPage() {
  const params = useParams();
  const programId = Number(params?.programId);
  const weekNumber = Number(params?.weekNumber);

  const [planData, setPlanData] = useState<PlanListResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!programId) return;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await getPlans(programId);
        setPlanData(data);
      } catch (error) {
        console.error("플랜 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [programId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!planData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-500">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  // weekNumber가 null인 데이터가 있을 경우 dayOrder를 기준으로 weekNumber를 계산하여 할당
  const processedPlans = planData.plans.map((plan: PlanListItemResponse) => ({
    ...plan,
    weekNumber:
      plan.weekNumber ?? (plan.dayOrder ? Math.ceil(plan.dayOrder / 7) : 1),
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-[180px]">
      <Header
        title={planData.programName || ""}
        showBackButton={true}
        backUrl="/workout/programs"
      />

      <div className="flex overflow-x-auto px-5 py-4 gap-2 scrollbar-hide sticky top-[56px] z-30 bg-[#f8fafc]/95 backdrop-blur-sm border-b border-slate-200/50">
        {Array.from({ length: planData.maxWeekNumber ?? 0 }, (_, index) => {
          const week = index + 1;
          const isActive = week === weekNumber;
          return (
            <Link
              key={week}
              href={`/workout/programs/${programId}/${week}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-[14px] font-bold transition-all shadow-sm active:scale-95 border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-slate-200"
                  : "bg-white text-slate-500 border-slate-100/50 hover:bg-slate-50"
              }`}
            >
              {week}주차
            </Link>
          );
        })}
      </div>

      <div className="px-5 mt-6 flex flex-col gap-4">
        <PlanList
          program={processedPlans}
          programId={programId}
          weekNumber={weekNumber}
          lastExercisedPlanId={planData.lastExercisedPlanId}
        />
      </div>
      <ImportProgramButton programId={programId} />
    </div>
  );
}
