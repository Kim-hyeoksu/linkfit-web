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
    console.log("activeSession.exercises", activeSession?.exercises[0].sets[0]);
  } catch (err) {
    console.error("getActiveSessionServer error", err);
    throw err;
  }

  const planDetail: PlanDetailDto | ActiveSessionDto =
    activeSession ?? (await planPromise);
  return <PlanClient initialPlanDetail={planDetail} />;
}
