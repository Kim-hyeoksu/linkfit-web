"use client";

import { useEffect, useState } from "react";
import { getPrograms, ProgramList, Program } from "@/entities/program";
import { getStandalonePlans } from "@/entities/plan/api";
import { StandalonePlanList } from "@/entities/plan/ui/StandalonePlanList";
import { PlanListItemResponse } from "@/entities/plan/model/types";
import Link from "next/link";
import { initMsw } from "@/shared/api/msw/initMsw";
import { Header } from "@/shared";
import { Calendar, PlusCircle } from "lucide-react";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [standalonePlans, setStandalonePlans] = useState<
    PlanListItemResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
        await initMsw();
      }

      try {
        const [programsData, plansData] = await Promise.all([
          getPrograms(),
          getStandalonePlans(),
        ]);
        setPrograms(programsData);
        setStandalonePlans(plansData);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-40">
      <Header
        title="운동 프로그램"
        showBackButton={false}
        rightButtonIconUrl={"/workout/history"}
      >
        <Calendar
          size={24}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        />
      </Header>

      <div className="px-5 pt-6 flex flex-col gap-8">
        <StandalonePlanList
          plans={standalonePlans}
          title="나만의 플랜"
          moreLink="/workout/plans"
        />

        <ProgramList
          programs={programs}
          title={"추천 프로그램"}
          moreLink="/workout/programs/popular"
        />
        <ProgramList
          programs={programs}
          title={"나의 운동 루틴"}
          moreLink="/workout/programs/mine"
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 w-full max-w-xl mx-auto px-5 pointer-events-none">
        <Link
          href={"/workout/programs/add"}
          className="pointer-events-auto h-[56px] w-full mb-24 flex items-center justify-center gap-2 bg-main text-white rounded-2xl font-bold text-[16px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <PlusCircle size={24} />
          <span>새로운 루틴 만들기</span>
        </Link>
      </div>
    </div>
  );
}
