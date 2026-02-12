import { getPlans, PlanList } from "@/entities/plan";
import type { PlanListResponse } from "@/entities/plan";
import { initMsw } from "@/shared/api/msw/initMsw";
import { Header } from "@/shared";
import Link from "next/link";
import { ImportProgramButton } from "@/features/program-import";

interface Props {
  params: { programId: string; weekNumber: string };
}

export default async function WorkoutProgramWeekPage({ params }: Props) {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw();
  }

  const { programId, weekNumber } = params;
  const planData: PlanListResponse = await getPlans(Number(programId));

  // weekNumber가 null인 데이터가 있을 경우 dayOrder를 기준으로 weekNumber를 계산하여 할당
  const processedPlans = planData.plans.map((plan) => ({
    ...plan,
    weekNumber:
      plan.weekNumber ?? (plan.dayOrder ? Math.ceil(plan.dayOrder / 7) : 1),
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-[180px]">
      {/* 주차별 링크 버튼 */}
      <Header
        title={planData.programName || ""}
        showBackButton={true}
        backUrl="/workout/programs"
      />

      <div className="flex overflow-x-auto px-5 py-4 gap-2 scrollbar-hide sticky top-[56px] z-30 bg-[#f8fafc]/95 backdrop-blur-sm border-b border-slate-200/50">
        {Array.from({ length: planData.maxWeekNumber }, (_, index) => {
          const week = index + 1;
          const isActive = week === Number(weekNumber);
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

      {/* 주차별 운동일차 리스트 */}
      <div className="px-5 mt-6 flex flex-col gap-4">
        <PlanList
          program={processedPlans}
          programId={Number(programId)}
          weekNumber={Number(weekNumber)}
          lastExercisedPlanId={planData.lastExercisedPlanId}
        />
      </div>
      <ImportProgramButton programId={Number(programId)} />
    </div>
  );
}
