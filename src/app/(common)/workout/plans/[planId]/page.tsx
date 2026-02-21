"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { userState } from "@/entities/user/model/userState";
import PlanClient from "@/widgets/plan/ui/PlanClient";
import { getPlanDetail } from "@/entities/plan";
import type { PlanDetailDto } from "@/entities/plan";
import { getActiveSessionServer } from "@/entities/session";
import type { ActiveSessionDto } from "@/entities/session";
import { normalizeExercises } from "@/widgets/plan/model/normalize";

/**
 * 나만의 플랜(독립 플랜) 상세 페이지
 * 기존 프로그램 내 플랜 상세 페이지의 로직과 UI(PlanClient)를 재사용합니다.
 */
export default function StandalonePlanPage() {
  const params = useParams();
  const planId = params?.planId as string;
  const user = useAtomValue(userState);

  const [planDetail, setPlanDetail] = useState<
    PlanDetailDto | ActiveSessionDto | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!planId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // userState가 아직 로딩되지 않았을 수 있으므로 대비책 마련
        const userId = user?.id || 1;

        let data = null;
        try {
          // 1. 해당 플랜으로 진행 중인 활성 세션이 있는지 확인
          data = await getActiveSessionServer(userId, planId);
        } catch (err) {
          console.error("getActiveSessionServer error", err);
        }

        // 2. 활성 세션이 없으면 일반 플랜 상세 정보 조회
        if (!data) {
          data = await getPlanDetail(planId);
        }

        setPlanDetail(data);
      } catch (error) {
        console.error("플랜 상세 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [planId, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        {/* 공통 로딩 스피너 UI */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-main rounded-full animate-spin" />
      </div>
    );
  }

  if (!planDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-gray-500">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  // 데이터 규격에 맞게 운동 목록 정규화
  const initialExercises = normalizeExercises(planDetail);

  return (
    <PlanClient
      initialPlanDetail={planDetail}
      initialExercises={initialExercises}
    />
  );
}
