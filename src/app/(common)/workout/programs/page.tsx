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
          getPrograms({ page: 0, size: 3 }),
          getStandalonePlans({ page: 0, size: 3 }),
        ]);
        setPrograms(programsData.content);
        setStandalonePlans(plansData.content);
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
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <Header
        title="운동 프로그램"
        showBackButton={false}
        rightButtonIconUrl={"/workout/calendar"}
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
          addLink="/workout/programs/add"
          emptyMessage="아직 나만의 루틴이 없어요"
          emptyButtonLabel="루틴 만들기"
        />
      </div>
    </div>
  );
}
