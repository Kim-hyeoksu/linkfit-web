"use client";

import React, { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { userState } from "@/entities/user/model/userState";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { accessTokenState } from "@/features/auth/model/accessTokenState";
import { User, LogOut, ChevronRight, Settings } from "lucide-react";
import { ConfirmModal, Header } from "@/shared";
import { getLatestBodyMetric } from "@/entities/user/api/getLatestBodyMetric";
import { getBodyMetrics } from "@/entities/user/api/getBodyMetrics";
import { BodyMetric } from "@/entities/user/model/types";
import { getMuscleHeatmap } from "@/entities/exercise";
import dynamic from "next/dynamic";
const BodyMetricsChart = dynamic(
  () => import("@/widgets/user").then((mod) => mod.BodyMetricsChart),
  { ssr: false },
);
const MuscleHeatmap = dynamic(
  () => import("@/widgets/exercise").then((mod) => mod.MuscleHeatmap),
  { ssr: false },
);

export default function MyPage() {
  const user = useAtomValue(userState);
  const setAccessToken = useSetAtom(accessTokenState);
  const setUser = useSetAtom(userState);
  const router = useRouter();

  const [bodyMetric, setBodyMetric] = useState<BodyMetric | null>(null);
  const [allMetrics, setAllMetrics] = useState<BodyMetric[]>([]);
  const [volumeMap, setVolumeMap] = useState<
    Record<string, { score: number; volume: number }>
  >({});
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const { startDate, endDate } = React.useMemo(() => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - 30);
    return {
      startDate: fromDate.toISOString().split("T")[0],
      endDate: toDate.toISOString().split("T")[0],
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const [latest, all, heatmapData] = await Promise.all([
            getLatestBodyMetric(),
            getBodyMetrics(),
            getMuscleHeatmap({ startDate, endDate }),
          ]);
          setBodyMetric(latest);
          if (all) setAllMetrics(all);
          if (heatmapData) setVolumeMap(heatmapData);
        } catch (e) {
          console.error("Failed to fetch mypage data", e);
        }
      }
    };
    fetchData();
  }, [user]);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    setAccessToken(null);
    setUser(null);
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pb-24 flex items-center justify-center">
        <div className="text-gray-500">로그인 정보가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      <Header title="마이페이지" showBackButton={false} />

      <main className="px-5 pt-4 flex flex-col gap-6">
        {/* 프로필 카드 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 relative">
          <button
            onClick={() => router.push("/onboarding?mode=edit")}
            className="absolute top-4 right-4 text-gray-400 p-2"
          >
            <Settings size={20} />
          </button>
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User size={32} />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1 flex gap-2">
              <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium">
                {user.userType === "TRAINER" ? "트레이너" : "트레이니"}
              </span>
              <span className="text-xs px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">
                {user.exerciseLevel || "초급"}
              </span>
            </div>
          </div>
        </section>

        {/* 신체 기록 대시보드 */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">최근 신체 기록</h3>
            <div className="flex items-center gap-2">
              {bodyMetric && (
                <span className="text-xs text-gray-400">
                  {bodyMetric.measuredDate} 업데이트
                </span>
              )}
              <button
                onClick={() => router.push("/body-metrics/history")}
                className="text-xs text-blue-500 font-medium flex items-center"
              >
                상세보기 <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {bodyMetric ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                <span className="text-sm text-gray-500">체중</span>
                <span className="text-xl font-bold text-gray-800">
                  {bodyMetric.weight}kg
                </span>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl flex flex-col items-center">
                <span className="text-sm text-gray-500">키</span>
                <span className="text-xl font-bold text-gray-800">
                  {bodyMetric.height}cm
                </span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500 text-sm">
              아직 기록된 신체 정보가 없어요.
            </div>
          )}

          {/* 추이 차트 추가 (마이페이지에서는 최근 7회만) */}
          {bodyMetric && allMetrics.length > 0 && (
            <BodyMetricsChart data={allMetrics.slice(-7)} />
          )}

          <button
            onClick={() => router.push("/body-metrics/add")}
            className="w-full mt-2 py-3 rounded-xl bg-blue-50 text-main font-semibold text-sm active:bg-blue-100 transition-colors"
          >
            {bodyMetric ? "오늘의 신체 정보 기록하기" : "첫 신체 정보 입력하기"}
          </button>
        </section>

        {/* 운동 부위 히트맵 */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">최근 30일 부위별 집중도</h3>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            최근 수행한 운동의 총 볼륨(무게×횟수)을 기준으로 한 근육
            활성도입니다.
          </p>
          <MuscleHeatmap
            volumeMap={volumeMap}
            startDate={startDate}
            endDate={endDate}
          />
        </section>

        {/* 메뉴 리스트 */}
        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
          <MenuItem label="알림 설정" onClick={() => {}} />
          <MenuItem
            label="종목 관리 및 기록 통계"
            onClick={() => router.push("/exercises/history")}
          />
        </section>

        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
          <MenuItem label="고객센터 / 문의하기" onClick={() => {}} />
          <MenuItem label="이용약관" onClick={() => {}} />
          <MenuItem label="개인정보 처리방침" onClick={() => {}} />
        </section>

        <section className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 divide-y divide-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors text-red-500 font-medium"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} />
              <span>로그아웃</span>
            </div>
          </button>
        </section>

        <div className="text-center text-xs text-gray-400 py-4">
          앱 버전 1.0.0
        </div>
      </main>

      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        isDanger={true}
      />
    </div>
  );
}

// 아이콘 매핑을 위한 간단한 컴포넌트
const MenuItem = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 active:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium">{label}</span>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </button>
  );
};
