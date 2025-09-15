import WorkoutDayList from "@/widgets/program-list/workout-day-liat/ui/WorkoutDayList";
import { getWorkoutDays } from "@/entities/program/workout-day/api/getWorkoutDays";
export default async function WorkoutProgramDetailPage({
  params,
}: {
  params: Promise<{ programId: number }>;
}) {
  const { programId } = await params;
  const workoutdays = await getWorkoutDays(programId);
  console.log("workoutdays", workoutdays);
  return (
    <div>
      <WorkoutDayList workoutdays={workoutdays} />
    </div>
  );
}
