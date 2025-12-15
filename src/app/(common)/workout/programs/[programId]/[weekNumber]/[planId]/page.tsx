// "use client";
// import React, { useState, useEffect, useRef } from "react";
// import { useParams } from "next/navigation";

// import axios from "axios";
// import Exercise from "@/entities/exercise/ui/ExerciseCard";
// import Timer from "@/components/common/Timer";
import PlanClient from "@/widgets/plan/ui/PlanClient";
import { getPlanDetail } from "@/entities/plan";
import type { PlanResponse } from "@/entities/plan";
import { initMsw } from "@/shared/api/msw/initMsw";

interface PlanPageProps {
  params: { programId: string; weekNumber: string; planId: string };
}
export default async function PlanPage({ params }: PlanPageProps) {
  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    await initMsw();
  }

  const planDetail: PlanResponse = await getPlanDetail(params.planId);
  return <PlanClient initialPlanDetail={planDetail} />;
}
