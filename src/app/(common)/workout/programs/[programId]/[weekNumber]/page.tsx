// import WorkoutDayList from "@/widgets/program-list/workout-day-liat/ui/WorkoutDayList";
// import { getWorkoutDays } from "@/entities/program/workout-day/api/getWorkoutDays";
// import { initMsw } from "@/mocks/initMsw";
// export default async function WorkoutProgramDetailPage({
//   params,
// }: {
//   params: Promise<{ programId: number }>;
// }) {
//   if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
//     await initMsw(); // SSR에서 모킹 활성화
//   }
//   const { programId } = await params;
//   const workoutdays = await getWorkoutDays(programId);
//   console.log("workoutdays", workoutdays);
//   return (
//     <div>
//       <WorkoutDayList workoutdays={workoutdays} programId={programId} />
//     </div>
//   );
// }
import WorkoutDayList from "@/widgets/program-list/workout-day-liat/ui/WorkoutDayList";
import { getWorkoutDays } from "@/entities/program/workout-day/api/getWorkoutDays";
import { initMsw } from "@/mocks/initMsw";
import Link from "next/link";
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
