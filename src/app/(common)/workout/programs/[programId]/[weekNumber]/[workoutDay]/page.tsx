// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";

// import axios from "axios";
// import Exercise from "@/entities/exercise/ui/ExerciseCard";
// import Timer from "@/components/common/Timer";
import WorkoutDayClient from "@/widgets/workout-day/ui/WorkoutDayClient";
import { getExercise } from "@/entities/exercise/api/getExercise";
import { initMsw } from "@/mocks/initMsw";

interface WorkoutDayPageProps {
  params: { programId: string; weekNumber: string; workoutDay: string };
}
export default async function WorkoutDayPage({ params }: WorkoutDayPageProps) {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw();
  }

  const exercises = await getExercise(params.workoutDay);
  return <WorkoutDayClient initialExercises={exercises} />;
}
