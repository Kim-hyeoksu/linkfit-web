import WorkoutDayList from "@/widgets/program-list/workout-day-liat/ui/WorkoutDayList";
import { getWorkoutDays } from "@/entities/program/workout-day/api/getWorkoutDays";
import { initMsw } from "@/mocks/initMsw";
export default async function WorkoutProgramDetailPage({
  params,
}: {
  params: Promise<{ programId: number }>;
}) {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw(); // SSR에서 모킹 활성화
  }
  const { programId } = await params;
  const workoutdays = await getWorkoutDays(programId);
  console.log("workoutdays", workoutdays);
  return (
    <div>
      <WorkoutDayList workoutdays={workoutdays} />
    </div>
  );
}
