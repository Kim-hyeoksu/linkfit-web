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
      <div className="bg-[#f2f4f6] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f2f4f6] min-h-screen pb-32">
      <Header title="DASHBOARD" showBackButton={false} className="!border-none">
        <button className="p-2 -mr-2 text-slate-400 hover:text-main transition-colors relative">
          <Bell size={24} strokeWidth={2} />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
        </button>
      </Header>

      <main className="px-5 pt-4 flex flex-col gap-10">
        <section>
          <GreetingWidget user={user} summary={summary} />
        </section>

        <section>
          <UpcomingScheduleWidget />
        </section>

        <section>
          <WorkoutStatusWidget summary={summary} />
        </section>
      </main>
    </div>
  );
}
