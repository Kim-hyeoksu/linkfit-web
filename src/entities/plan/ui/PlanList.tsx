// "use client";

// import { useState } from "react";
// import {
//   WorkoutProgram,
//   WorkoutDay,
// } from "@/entities/plan/model/types";
// import WorkoutDayCard from "@/entities/plan/ui/WorkoutDayCard";

// interface WorkoutDayListProps {
//   workoutdays: WorkoutProgram; // ✅ 단일 프로그램 객체
//   programId: number;
// }

// export default function WorkoutDayList({
//   workoutdays,
//   programId,
// }: WorkoutDayListProps) {
//   const [selectedWeek, setSelectedWeek] = useState<number>(
//     workoutdays.weeks[0]?.week ?? 1
//   );

//   const currentWeek = workoutdays.weeks.find((w) => w.week === selectedWeek);

//   return (
//     <div className="p-5 bg-white">
//       {/* ✅ 주차 선택 버튼 영역 */}
//       <div className="flex gap-2 mb-4">
//         {workoutdays.weeks.map((week) => (
//           <button
//             key={week.week}
//             onClick={() => setSelectedWeek(week.week)}
//             className={`px-3 py-1 rounded-lg border text-sm ${
//               selectedWeek === week.week
//                 ? "bg-blue-500 text-white border-blue-500"
//                 : "bg-gray-100 text-gray-700 border-gray-300"
//             }`}
//           >
//             {week.week}주차
//           </button>
//         ))}
//       </div>

//       {/* ✅ 선택된 주차의 일차 데이터 */}
//       <div className="gap-3 flex flex-col">
//         {currentWeek?.days.map((day) => (
//           <WorkoutDayCard
//             key={`${selectedWeek}-${day.dayNumber}`}
//             {...day}
//             programId={programId}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
// app/workout/programs/[programId]/WorkoutDayListServer.tsx
import { PlanCard } from "../ui/PlanCard";
import type { PlanResponse } from "@/entities/plan";

interface Props {
  program: PlanResponse[];
  programId: number;
  weekNumber: number; // 서버에서 주차를 선택
  lastExercisedPlanId: number | null;
}

export const PlanList = ({
  program,
  programId,
  weekNumber,
  lastExercisedPlanId,
}: Props) => {
  const currentWeekPlans = program
    .filter((w) => w.weekNumber === weekNumber)
    .sort((a, b) => a.dayOrder - b.dayOrder);

  return (
    <div className="p-5 bg-white">
      <h3 className="mb-4 font-bold">{weekNumber}주차</h3>
      <div className="flex flex-col gap-3">
        {currentWeekPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            {...plan}
            programId={programId}
            weekNumber={weekNumber}
            isLastExercised={plan.id === lastExercisedPlanId}
          />
        ))}
      </div>
    </div>
  );
};
