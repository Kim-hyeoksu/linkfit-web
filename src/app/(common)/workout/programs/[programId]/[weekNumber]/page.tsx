import { getWorkoutDays } from "@/entities/plan";
import { initMsw } from "@/shared/api/msw/initMsw";
import { Header } from "@/shared";
import Link from "next/link";
import { WorkoutDayList } from "@/entities/plan";
interface Props {
  params: { programId: string; weekNumber: string };
}

export default async function WorkoutProgramWeekPage({ params }: Props) {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw();
  }

  const { programId, weekNumber } = params;
  const workoutdays = await getWorkoutDays(Number(programId));

  return (
    <div>
      {/* 주차별 링크 버튼 */}
      <Header
        title={workoutdays.name}
        showBackButton={true}
        backUrl="/workout/programs"
      />
      <div className="flex gap-2 mb-4">
        {workoutdays.weeks.map((w) => (
          <Link
            key={w.week}
            href={`/workout/programs/${programId}/${w.week}`}
            className={`px-3 py-1 rounded-lg border text-sm ${
              w.week === Number(weekNumber)
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            {w.week}주차
          </Link>
        ))}
      </div>

      {/* 주차별 운동일차 리스트 */}
      <WorkoutDayList
        program={workoutdays}
        programId={Number(programId)}
        weekNumber={Number(weekNumber)}
      />
    </div>
  );
}
