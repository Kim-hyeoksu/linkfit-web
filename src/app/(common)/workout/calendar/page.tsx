"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/shared";
import { getSessions } from "@/entities/session";

type SessionLike = any;

const pad2 = (n: number) => String(n).padStart(2, "0");

const toDateKeyLocal = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )}`;
};

const formatDateHeader = (dateKey: string) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  return `${y}.${pad2(m)}.${pad2(d)}`;
};

const getWeekdayKo = (dateKey: string) => {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return "";
  return ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
};

const formatTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
};

const formatDuration = (seconds: number | null | undefined) => {
  if (seconds == null) return "-";
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${pad2(minutes)}:${pad2(secs)}`;
};

const getSessionDateKey = (session: SessionLike) => {
  const startedAt =
    session.startedAt ?? session.sessionDate ?? session.createdAt;
  if (!startedAt) return null;
  return toDateKeyLocal(startedAt);
};

const getSessionProgramName = (session: SessionLike) => {
  return (
    session.programName ??
    session.program?.name ??
    session.plan?.programName ??
    null
  );
};

const getSessionExercises = (session: SessionLike) => {
  return (
    session.exercises ??
    session.sessionExercises ??
    session.sessionExerciseList ??
    []
  );
};

const getExerciseSets = (exercise: any) => {
  return exercise.sets ?? exercise.sessionSets ?? exercise.exerciseSets ?? [];
};

const isCompletedSet = (set: any) => {
  return Boolean(
    set.completedAt || set.isComplete || set.status === "COMPLETED"
  );
};

export default function WorkoutCalendarPage() {
  const userId = 1; // TODO: 로그인 유저로 교체
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      setLoading(true);
      setError(null);
      setSelectedDateKey(null);

      const from = `${monthCursor.getFullYear()}-${pad2(
        monthCursor.getMonth() + 1
      )}-01`;
      const lastDay = new Date(
        monthCursor.getFullYear(),
        monthCursor.getMonth() + 1,
        0
      ).getDate();
      const to = `${monthCursor.getFullYear()}-${pad2(
        monthCursor.getMonth() + 1
      )}-${pad2(lastDay)}`;

      try {
        const data = await getSessions({
          userId,
          from,
          to,
          status: "COMPLETED",
        });
        const list = Array.isArray(data) ? data : data?.content ?? [];
        if (mounted) setSessions(list);
      } catch (e) {
        if (mounted) setError("운동 기록을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [monthCursor, userId]);

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, SessionLike[]>();
    sessions.forEach((s) => {
      const key = getSessionDateKey(s);
      if (!key) return;
      const arr = map.get(key) ?? [];
      arr.push(s);
      map.set(key, arr);
    });

    [...map.values()].forEach((arr) => {
      arr.sort((a, b) => {
        const ta = new Date(a.startedAt ?? a.createdAt ?? 0).getTime();
        const tb = new Date(b.startedAt ?? b.createdAt ?? 0).getTime();
        return ta - tb;
      });
    });

    return map;
  }, [sessions]);

  const monthLabel = `${monthCursor.getFullYear()}.${pad2(
    monthCursor.getMonth() + 1
  )}`;

  const calendarCells = useMemo(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ dateKey: string | null; day: number | null }> = [];
    for (let i = 0; i < startWeekday; i++)
      cells.push({ dateKey: null, day: null });
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${pad2(month + 1)}-${pad2(day)}`;
      cells.push({ dateKey: key, day });
    }
    while (cells.length % 7 !== 0) cells.push({ dateKey: null, day: null });
    return cells;
  }, [monthCursor]);

  const selectedSessions = selectedDateKey
    ? sessionsByDate.get(selectedDateKey) ?? []
    : [];

  return (
    <div>
      <Header showBackButton={true} title="운동 캘린더">
        <div />
      </Header>

      <div className="px-5 pt-[72px] pb-10 bg-[#F7F8F9] min-h-screen">
        {/* 캘린더 */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <button
              className="w-[42px] h-[32px] rounded-lg bg-light-gray text-dark-gray"
              onClick={() =>
                setMonthCursor(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
                )
              }
            >
              이전
            </button>
            <div className="font-bold">{monthLabel}</div>
            <button
              className="w-[42px] h-[32px] rounded-lg bg-light-gray text-dark-gray"
              onClick={() =>
                setMonthCursor(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
                )
              }
            >
              다음
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-3 text-center text-xs text-gray-500">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mt-1">
            {calendarCells.map((cell, idx) => {
              const hasWorkout =
                cell.dateKey != null &&
                (sessionsByDate.get(cell.dateKey)?.length ?? 0) > 0;
              const isSelected =
                cell.dateKey != null && cell.dateKey === selectedDateKey;
              return (
                <button
                  key={`${cell.dateKey ?? "empty"}-${idx}`}
                  type="button"
                  disabled={!cell.dateKey}
                  onClick={() => {
                    if (!cell.dateKey) return;
                    setSelectedDateKey((prev) =>
                      prev === cell.dateKey ? null : cell.dateKey
                    );
                  }}
                  className={`h-[44px] rounded-lg border text-sm flex flex-col items-center justify-center ${
                    cell.dateKey
                      ? "bg-white border-[#d9d9d9]"
                      : "bg-[#F7F8F9] border-transparent"
                  } ${isSelected ? "border-black" : ""}`}
                >
                  <div className="leading-none">{cell.day ?? ""}</div>
                  <div className="h-[10px] flex items-center justify-center">
                    {hasWorkout && (
                      <div className="w-1.5 h-1.5 rounded-full bg-main" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* 리스트 */}
        <div className="mt-3 bg-white rounded-lg p-4">
          {loading ? (
            <div className="text-sm text-gray-600">불러오는 중...</div>
          ) : error ? (
            <div className="text-sm text-gray-600">{error}</div>
          ) : selectedDateKey ? (
            <>
              <div className="font-bold mb-3">
                {formatDateHeader(selectedDateKey)} (
                {getWeekdayKo(selectedDateKey)}) 운동 기록
              </div>
              {selectedSessions.length === 0 ? (
                <div className="text-sm text-gray-600">
                  선택한 날짜에 운동 기록이 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {selectedSessions.map((s, idx) => {
                    const duration = s.totalDurationSeconds;
                    const exercises = getSessionExercises(s);
                    const planTitle = s.planTitle;
                    const programName = s.programName;
                    return (
                      <div key={s.id ?? idx} className="border rounded-lg p-3">
                        <div className="flex justify-between text-sm">
                          <div className="font-medium">
                            {formatTime(s.startedAt)} ~ {formatTime(s.endedAt)}
                          </div>
                          <div className="text-gray-600">
                            {formatDuration(duration)}
                          </div>
                        </div>
                        {(planTitle || programName) && (
                          <div className="mt-2 text-xs text-gray-600">
                            {programName ? `[${programName}] ` : ""}
                            {planTitle ?? ""}
                          </div>
                        )}
                        <div className="mt-2 flex flex-col gap-2">
                          {(exercises as any[]).map((ex, exIdx) => {
                            const name =
                              ex.exerciseName ?? ex.name ?? ex.title ?? "운동";
                            const sets = getExerciseSets(ex);
                            const completedSets = (sets as any[]).filter(
                              isCompletedSet
                            );
                            if (completedSets.length === 0) return null;
                            return (
                              <div key={`${name}-${exIdx}`} className="text-sm">
                                <div className="font-medium text-gray-800">
                                  {name}
                                </div>
                                <div className="mt-1 flex flex-col gap-1">
                                  {completedSets.map(
                                    (set: any, setIdx: number) => (
                                      <div
                                        key={`${exIdx}-${setIdx}`}
                                        className="flex justify-between text-gray-700"
                                      >
                                        <div>
                                          {set.setOrder ??
                                            set.order ??
                                            setIdx + 1}
                                          세트
                                        </div>
                                        <div className="text-gray-600">
                                          {set.weight ??
                                            set.actualWeight ??
                                            set.targetWeight ??
                                            "-"}
                                          kg ·{" "}
                                          {set.reps ??
                                            set.actualReps ??
                                            set.targetReps ??
                                            "-"}
                                          회
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="font-bold mb-3">{monthLabel} 전체 운동 기록</div>
              {sessionsByDate.size === 0 ? (
                <div className="text-sm text-gray-600">
                  이번 달 운동 기록이 없습니다.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[...sessionsByDate.entries()]
                    .sort(([a], [b]) => (a < b ? -1 : 1))
                    .map(([dateKey, list]) => (
                      <div key={dateKey}>
                        <div className="text-sm font-medium text-gray-800 mb-2">
                          {formatDateHeader(dateKey)} ({getWeekdayKo(dateKey)})
                        </div>
                        <div className="flex flex-col gap-2">
                          {list.map((s, idx) => (
                            <button
                              key={s.id ?? idx}
                              type="button"
                              onClick={() => setSelectedDateKey(dateKey)}
                              className="text-left border rounded-lg p-3"
                            >
                              <div className="flex justify-between text-sm">
                                <div className="font-medium">
                                  {formatTime(s.startedAt)} ~{" "}
                                  {formatTime(s.endedAt)}
                                </div>
                                <div className="text-gray-600">
                                  {formatDuration(s.totalDurationSeconds)}
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-gray-600 line-clamp-2">
                                {s.programName || s.planTitle
                                  ? `${
                                      s.programName ? `[${s.programName}] ` : ""
                                    }${s.planTitle ?? ""}`
                                  : (getSessionExercises(s) as any[])
                                      .map(
                                        (ex) =>
                                          ex.exerciseName ??
                                          ex.name ??
                                          ex.title ??
                                          "운동"
                                      )
                                      .join(", ")}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
