"use client";

import { useEffect, useState } from "react";
import { getPrograms, ProgramList, Program } from "@/entities/program";
import { getStandalonePlans } from "@/entities/plan/api";
import { StandalonePlanList } from "@/entities/plan/ui/StandalonePlanList";
import { PlanListItemResponse } from "@/entities/plan/model/types";
import Link from "next/link";
import { initMsw } from "@/shared/api/msw/initMsw";
import { Header } from "@/shared";
import { Calendar, Plus, Dumbbell, ClipboardList, X } from "lucide-react";

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [standalonePlans, setStandalonePlans] = useState<
    PlanListItemResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFabOpen, setIsFabOpen] = useState(false);

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

      <div className="px-5 pt-6 flex flex-col gap-8 pb-5">
        <StandalonePlanList
          plans={standalonePlans}
          title="나만의 플랜"
          moreLink="/workout/plans"
          helpMessage="프로그램에 속해있지 않은 자유로운 단일 운동 플랜이에요."
        />

        <ProgramList
          programs={programs}
          title={"추천 프로그램"}
          moreLink="/workout/programs/popular"
          helpMessage="전문가들이 미리 구성해 둔 체계적인 운동 세트 조합이에요."
        />
        <ProgramList
          programs={programs}
          title={"나의 프로그램"}
          moreLink="/workout/programs/mine"
          emptyMessage="아직 나만의 프로그램이 없어요"
          emptyButtonLabel="프로그램 만들기"
          helpMessage="사용자가 직접 구성하고 저장해 둔 맞춤형 운동 프로그램이에요."
        />
      </div>

      {/* Floating Action Button */}
      {isFabOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 animate-in fade-in duration-200"
          onClick={() => setIsFabOpen(false)}
        />
      )}

      <div className="fixed bottom-[88px] right-5 z-50 flex flex-col items-end gap-3 pointer-events-none">
        {isFabOpen && (
          <div className="flex flex-col gap-2 animate-in slide-in-from-bottom-5 fade-in duration-200 origin-bottom-right items-end mr-1">
            <Link
              href="/workout/plans/add"
              onClick={() => setIsFabOpen(false)}
              className="pointer-events-auto flex items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-all text-slate-800 w-[220px]"
            >
              <span className="font-bold text-[15px] whitespace-nowrap">
                나만의 플랜 만들기
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-main flex-shrink-0">
                <Dumbbell size={16} />
              </div>
            </Link>
            <Link
              href="/workout/programs/add"
              onClick={() => setIsFabOpen(false)}
              className="pointer-events-auto flex items-center justify-between gap-3 bg-white px-4 py-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] active:scale-95 transition-all text-slate-800 w-[220px]"
            >
              <span className="font-bold text-[15px] whitespace-nowrap">
                나의 프로그램 만들기
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-main flex-shrink-0">
                <ClipboardList size={16} />
              </div>
            </Link>
          </div>
        )}

        <button
          onClick={() => setIsFabOpen(!isFabOpen)}
          className={`pointer-events-auto h-14 w-14 rounded-full text-white shadow-xl flex items-center justify-center transition-all active:scale-95 z-50 ${isFabOpen ? "bg-slate-700 shadow-slate-900/20 rotate-45" : "bg-main shadow-blue-500/30"}`}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
