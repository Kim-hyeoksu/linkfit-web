"use client";

import React, { useEffect, useState } from "react";
import {
  GreetingWidget,
  UpcomingScheduleWidget,
  WorkoutStatusWidget,
} from "@/widgets/home";
import { getDashboardSummary, DashboardSummary } from "@/entities/dashboard";
import { useAtomValue } from "jotai";
import { userState } from "@/entities/user/model/userState";

export default function Home() {
  const user = useAtomValue(userState);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#f9fafb] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-32">
      <div className="px-5 pt-12 flex flex-col gap-8">
        <GreetingWidget user={user} summary={summary} />

        {/* 오늘의 일정은 별개로 유지하거나, 최근 플랜으로 대체하거나 고민 */}
        <UpcomingScheduleWidget />

        <WorkoutStatusWidget summary={summary} />
      </div>
    </div>
  );
}
