import { WorkoutDay } from "@/entities/program/workout-day/model/types";
import WorkoutDayCard from "@/entities/program/workout-day/ui/WorkoutDayCard";
import Link from "next/link";

interface WorkoutDayListProps {
  workoutdays: WorkoutDay[];
}
export default function WorkoutDayList({ workoutdays }: WorkoutDayListProps) {
  return (
    <div className="p-5 bg-white">
      <div className="text-right mb-2"></div>
      <div className="gap-3 flex flex-col">
        {workoutdays.map((workoutday) => (
          <WorkoutDayCard key={workoutday.id} {...workoutday} />
        ))}
      </div>
    </div>
  );
}
