"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { getSession } from "@/entities/session";
import { CheckCircle2, Clock, Dumbbell } from "lucide-react";

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
};

const formatDateTime = (value: string | Date | null | undefined) => {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function WorkoutCompletePage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const router = useRouter();
  const { sessionId } = use(params);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSession(Number(sessionId));
        if (mounted) setSession(data);
      } catch (e: any) {
        if (mounted) setError("세션 정보를 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, [sessionId]);

  const summary = useMemo(() => {
    if (!session) return null;

    const startedAt = session.startedAt ? new Date(session.startedAt) : null;
    const endedAt = session.endedAt ? new Date(session.endedAt) : null;
    const durationSeconds =
      session.totalDuraionSeconds ??
      session.totalDurationSeconds ??
      (startedAt && endedAt
        ? Math.max(
            Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000),
            0,
          )
        : null);

    const sessionExercises =
      session.exercises ??
      session.sessionExercises ??
      session.sessionExerciseList ??
      [];

    const normalizedExercises = (sessionExercises as any[]).map((ex) => {
      const name = ex.exerciseName ?? ex.name ?? ex.title ?? "운동";
      const sets = ex.sets ?? ex.sessionSets ?? ex.exerciseSets ?? [];
      const completedSets = (sets as any[]).filter(
        (s) => s.completedAt || s.isComplete || s.status === "COMPLETED",
      );
      const volume = completedSets.reduce((acc: number, s: any) => {
        const reps = Number(s.reps ?? s.actualReps ?? s.targetReps ?? 0);
        const weight = Number(
          s.weight ?? s.actualWeight ?? s.targetWeight ?? 0,
        );
        return acc + reps * weight;
      }, 0);

      return {
        name,
        completedSetsCount: completedSets.length,
        totalSetsCount: (sets as any[]).length,
        volume,
        sets: (sets as any[])
          .map((s) => ({
            setOrder: s.setOrder ?? s.order ?? null,
            reps: s.reps ?? s.actualReps ?? s.targetReps ?? null,
            weight: s.weight ?? s.actualWeight ?? s.targetWeight ?? null,
            restSeconds:
              s.restSeconds ??
              s.actualRestSeconds ??
              s.targetRestSeconds ??
              null,
            completed: Boolean(
              s.completedAt || s.isComplete || s.status === "COMPLETED",
            ),
          }))
          .filter((s) => s.completed),
      };
    });

    return {
      durationSeconds,
      startedAt: session.startedAt ?? null,
      endedAt: session.endedAt ?? null,
      exercises: normalizedExercises,
    };
  }, [session]);

  return (
    <div className="bg-white min-h-screen pb-24">
      <Header showBackButton={true} title="운동 결과" />

      <div className="px-5 pt-8 pb-10">
        {/* 심플한 완료 메시지 (플랫 디자인 + 브랜드 컬러) */}
        <div className="flex flex-col items-center justify-center text-center mb-8 mt-2">
          <div className="w-[60px] h-[60px] bg-blue-50 text-main rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </div>

          <h2 className="text-[22px] font-bold text-gray-900 mb-1.5 px-2">
            운동을 완료했습니다
          </h2>
          <p className="text-gray-500 text-[15px] font-medium">
            오늘 하루도 수고 많으셨습니다.
          </p>
        </div>

        {/* 핵심 요약 지표 (심플한 박스형) */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-10 border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
              <Clock size={16} strokeWidth={2} /> 총 시간
            </div>
            <div className="font-bold text-gray-900 text-lg">
              {summary?.durationSeconds != null
                ? formatDuration(Number(summary.durationSeconds))
                : "-"}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
              <Dumbbell size={16} strokeWidth={2} /> 총 볼륨
            </div>
            <div className="font-bold text-gray-900 text-lg">
              {summary
                ? summary.exercises
                    .reduce((sum, ex) => sum + ex.volume, 0)
                    .toLocaleString()
                : "-"}
              <span className="text-sm font-semibold text-gray-500 ml-1">
                kg
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">
            운동 상세
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <div className="w-8 h-8 border-4 border-gray-100 border-t-main rounded-full animate-spin mb-4" />
              <span className="text-sm font-medium text-gray-500">
                기록을 불러오는 중...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-sm font-medium text-red-500 bg-red-50 rounded-xl p-4">
              {error}
            </div>
          ) : summary ? (
            <div className="flex flex-col gap-4">
              {summary.exercises.map((ex, idx) => (
                <div
                  key={`${ex.name}-${idx}`}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-main" />
                      <div className="font-bold text-gray-900 text-[15px]">
                        {ex.name}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-main bg-blue-50 px-2 py-1 rounded-md">
                      {ex.completedSetsCount} / {ex.totalSetsCount} 완료
                    </div>
                  </div>

                  {ex.sets.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {ex.sets.map((s: any, sIdx: number) => (
                        <div
                          key={`${idx}-${sIdx}`}
                          className="flex justify-between items-center px-3 py-2 bg-gray-50 rounded-lg text-sm"
                        >
                          <span className="font-medium text-gray-500">
                            {s.setOrder ?? sIdx + 1}세트
                          </span>
                          <span className="font-semibold text-gray-800">
                            {s.weight ?? "-"}kg × {s.reps ?? "-"}회
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              기록을 불러오지 못했습니다.
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 영역 */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 pb-[max(env(safe-area-inset-bottom),_20px)] z-40">
        <div className="flex gap-3 max-w-xl mx-auto">
          <button
            className="flex-1 h-[52px] rounded-xl bg-gray-100 text-gray-700 font-semibold active:scale-[0.98] transition-all text-[15px]"
            onClick={() => router.push("/workout/calendar")}
          >
            캘린더 보기
          </button>
          <button
            className="flex-1 h-[52px] rounded-xl bg-main text-white font-semibold active:scale-[0.98] transition-all text-[15px]"
            onClick={() => router.push("/")}
          >
            홈으로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
