"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/shared";
import { getSession } from "@/entities/session";

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
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
            0
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
        (s) => s.completedAt || s.isComplete || s.status === "COMPLETED"
      );
      const volume = completedSets.reduce((acc: number, s: any) => {
        const reps = Number(s.reps ?? s.actualReps ?? s.targetReps ?? 0);
        const weight = Number(
          s.weight ?? s.actualWeight ?? s.targetWeight ?? 0
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
              s.completedAt || s.isComplete || s.status === "COMPLETED"
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
    <div>
      <Header showBackButton={true} title="운동 완료"></Header>

      <div className="px-5 pt-[72px] pb-10 bg-[#F7F8F9] min-h-screen">
        <div className="bg-white rounded-lg p-4">
          <div className="text-sm text-gray-600">운동 시작</div>
          <div className="font-bold">{formatDateTime(summary?.startedAt)}</div>

          <div className="mt-3 text-sm text-gray-600">운동 종료</div>
          <div className="font-bold">{formatDateTime(summary?.endedAt)}</div>

          <div className="mt-3 text-sm text-gray-600">운동 시간</div>
          <div className="font-bold">
            {summary?.durationSeconds != null
              ? formatDuration(Number(summary.durationSeconds))
              : "-"}
          </div>
        </div>

        <div className="mt-3 bg-white rounded-lg p-4">
          <div className="font-bold mb-3">오늘 한 운동</div>
          {loading ? (
            <div className="text-sm text-gray-600">불러오는 중...</div>
          ) : error ? (
            <div className="text-sm text-gray-600">{error}</div>
          ) : summary ? (
            <div className="flex flex-col gap-2">
              {summary.exercises.map((ex, idx) => (
                <div key={`${ex.name}-${idx}`} className="text-sm">
                  <div className="flex justify-between">
                    <div className="text-gray-800 font-medium">{ex.name}</div>
                    <div className="text-gray-600">
                      {ex.completedSetsCount}/{ex.totalSetsCount} 세트 ·{" "}
                      {Math.round(ex.volume)} kg
                    </div>
                  </div>
                  <div className="mt-2 flex flex-col gap-1">
                    {ex.sets.map((s: any, sIdx: number) => (
                      <div
                        key={`${idx}-${sIdx}`}
                        className="flex justify-between text-gray-700"
                      >
                        <div>
                          {s.setOrder ?? sIdx + 1}세트{" "}
                          {s.completed ? "(완료)" : ""}
                        </div>
                        <div className="text-gray-600">
                          {s.weight ?? "-"}kg · {s.reps ?? "-"}회 · 휴식{" "}
                          {s.restSeconds ?? "-"}s
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              요약 정보를 불러오지 못했습니다.
            </div>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            className="flex-1 h-[42px] rounded-lg bg-light-gray text-dark-gray"
            onClick={() => router.push("/workout/programs")}
          >
            프로그램 목록
          </button>
          <button
            className="flex-1 h-[42px] rounded-lg bg-main text-white"
            onClick={() => router.push("/workout")}
          >
            운동 홈
          </button>
        </div>
      </div>
    </div>
  );
}
