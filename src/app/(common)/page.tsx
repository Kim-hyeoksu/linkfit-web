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
import { Header } from "@/shared";
import { Bell } from "lucide-react";

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
      <Header
        title="DASHBOARD"
        showBackButton={false}
        className="!bg-transparent !border-none"
      >
        <button className="p-2 -mr-2 text-slate-400 hover:text-main transition-colors relative">
          <Bell size={24} strokeWidth={2.5} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </Header>

      <div className="px-5 pt-8 flex flex-col gap-8">
        <GreetingWidget user={user} summary={summary} />

        {/* 오늘의 일정은 별개로 유지하거나, 최근 플랜으로 대체하거나 고민 */}
        <UpcomingScheduleWidget />

        <WorkoutStatusWidget summary={summary} />
      </div>
    </div>
  );
}
