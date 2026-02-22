"use client";

import { useEffect, useState } from "react";
import { StandalonePlanCard } from "@/entities/plan/ui/StandalonePlanCard";
import { getStandalonePlans } from "@/entities/plan/api";
import { PlanListItemResponse } from "@/entities/plan/model/types";
import { Header } from "@/shared";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyPlansPage() {
  const [plans, setPlans] = useState<PlanListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (page === 0) setLoading(true);
        else setIsLoadingMore(true);

        const data = await getStandalonePlans({ page, size: 10 });

        if (page === 0) {
          setPlans(data.content);
        } else {
          setPlans((prev) => [...prev, ...data.content]);
        }
        setIsLast(data.last);
      } catch (error) {
        console.error("나만의 플랜 로딩 실패:", error);
      } finally {
        if (page === 0) setLoading(false);
        else setIsLoadingMore(false);
      }
    };

    fetchData();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-40">
      <Header
        title="나만의 플랜"
        showBackButton={true}
        backUrl="/workout/programs"
      />

      <div className="px-5 pt-4 flex flex-col gap-4">
        {plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 mt-20">
            <p className="mb-4 text-lg font-medium">
              아직 생성된 플랜이 없습니다.
            </p>
            <p className="text-sm mb-8 text-slate-400">
              나만의 운동 루틴을 직접 만들어보세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {plans.map((plan) => (
              <StandalonePlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        {plans.length > 0 && !isLast && (
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={isLoadingMore}
            className="mt-2 flex justify-center items-center gap-2 border border-blue-200 bg-blue-50 text-main rounded-xl w-full p-3 font-bold hover:bg-blue-100 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoadingMore ? "불러오는 중..." : "더보기"}
          </button>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="max-w-xl mx-auto px-5 w-full relative h-32 flex items-end pb-8 justify-end">
          <Link
            href="/workout/plans/add"
            className="pointer-events-auto h-16 w-16 rounded-full bg-main text-white shadow-xl shadow-blue-500/30 flex items-center justify-center transition-all active:scale-95 mb-[88px]"
          >
            <Plus size={32} strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
