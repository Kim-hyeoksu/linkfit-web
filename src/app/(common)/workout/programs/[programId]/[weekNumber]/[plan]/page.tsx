// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";

// import axios from "axios";
// import Exercise from "@/entities/exercise/ui/ExerciseCard";
// import Timer from "@/components/common/Timer";
import PlanClient from "@/widgets/plan/ui/PlanClient";
import { getExercise } from "@/entities/exercise";
import { initMsw } from "@/shared/api/msw/initMsw";

interface PlanPageProps {
  params: { programId: string; weekNumber: string; workoutDay: string };
}
export default async function PlanPage({ params }: PlanPageProps) {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw();
  }

  const exercises = await getExercise(params.workoutDay);
  return <PlanClient initialExercises={exercises} />;
}
