import { getPlans, PlanList } from "@/entities/plan";
import type { PlanListResponse } from "@/entities/plan";
import { initMsw } from "@/shared/api/msw/initMsw";
import { Header } from "@/shared";
import Link from "next/link";
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
    <div>
      {/* 주차별 링크 버튼 */}
      <Header
        title={planData.programName}
        showBackButton={true}
        backUrl="/workout/programs"
      />
      <div className="flex gap-2 mb-4 ml-5">
        {Array.from({ length: planData.maxWeekNumber }, (_, index) => {
          const week = index + 1;
          return (
            <Link
              key={week}
              href={`/workout/programs/${programId}/${week}`}
              className={`px-3 py-1 rounded-lg border text-sm ${
                week === Number(weekNumber)
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {week}주차
            </Link>
          );
        })}
      </div>

      {/* 주차별 운동일차 리스트 */}
      <PlanList
        program={processedPlans}
        programId={Number(programId)}
        weekNumber={Number(weekNumber)}
        lastExercisedPlanId={planData.lastExercisedPlanId}
      />
    </div>
  );
}
