// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";

// import axios from "axios";
// import Exercise from "@/entities/exercise/ui/ExerciseCard";
// import Timer from "@/components/common/Timer";
import PlanClient from "@/widgets/plan/ui/PlanClient";
import { getPlanDetail } from "@/entities/plan";
import type { PlanDetailDto } from "@/entities/plan";
import { getActiveSessionServer } from "@/entities/session";
import type { ActiveSessionDto } from "@/entities/session";
import { initMsw } from "@/shared/api/msw/initMsw";
import { normalizeExercises } from "@/widgets/plan/model/normalize";

interface PlanPageProps {
  params: { programId: string; weekNumber: string; planId: string };
}
export default async function PlanPage({ params }: PlanPageProps) {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw();
  }

  const userId = 1; // TODO: 세션/토큰에서 사용자 ID 추출
  const planPromise = getPlanDetail(params.planId);

  let activeSession: PlanDetailDto | ActiveSessionDto | null = null;
  try {
    activeSession = await getActiveSessionServer(userId, params.planId);
  } catch (err) {
    console.error("getActiveSessionServer error", err);
    // 세션이 없으면 에러가 아니라 그냥 null 처리하고 플랜을 보여주는게 맞을 수 있음
    // 하지만 현재 로직 흐름상 유지
  }

  const planDetail: PlanDetailDto | ActiveSessionDto =
    activeSession ?? (await planPromise);

  const initialExercises = normalizeExercises(planDetail);

  return (
    <PlanClient
      initialPlanDetail={planDetail}
      initialExercises={initialExercises}
    />
  );
}
