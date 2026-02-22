"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/shared";
import { getSessions } from "@/entities/session";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Activity,
  Dumbbell,
} from "lucide-react";
type SessionLike = any;

const pad2 = (n: number) => String(n).padStart(2, "0");

const toDateKeyLocal = (value: string | Date) => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate(),
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

const getSessionTotalVolumeKg = (session: SessionLike) => {
  if (typeof session.totalVolumeKg === "number") return session.totalVolumeKg;
  if (typeof session.totalVolume === "number") return session.totalVolume;

  const exercises = getSessionExercises(session) as any[];
  const total = exercises.reduce((acc: number, ex: any) => {
    const sets = getExerciseSets(ex) as any[];
    const completedSets = sets.filter(isCompletedSet);
    const volume = completedSets.reduce((sum: number, s: any) => {
      const reps = Number(s.reps ?? s.actualReps ?? s.targetReps ?? 0);
      const weight = Number(s.weight ?? s.actualWeight ?? s.targetWeight ?? 0);
      return sum + reps * weight;
    }, 0);
    return acc + volume;
  }, 0);

  return total;
};

const getExerciseSets = (exercise: any) => {
  return exercise.sets ?? exercise.sessionSets ?? exercise.exerciseSets ?? [];
};

const isCompletedSet = (set: any) => {
  return Boolean(
    set.completedAt || set.isComplete || set.status === "COMPLETED",
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
        monthCursor.getMonth() + 1,
      )}-01`;
      const lastDay = new Date(
        monthCursor.getFullYear(),
        monthCursor.getMonth() + 1,
        0,
      ).getDate();
      const to = `${monthCursor.getFullYear()}-${pad2(
        monthCursor.getMonth() + 1,
      )}-${pad2(lastDay)}`;

      try {
        const data = await getSessions({
          userId,
          from,
          to,
          status: "COMPLETED",
        });
        const list = Array.isArray(data) ? data : (data?.content ?? []);
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
    monthCursor.getMonth() + 1,
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
    ? (sessionsByDate.get(selectedDateKey) ?? [])
    : [];

  return (
    <div>
      <Header showBackButton={true} title="운동 캘린더">
        <div />
      </Header>

      <div className="px-5 pt-5 pb-10 bg-[#F7F8F9] min-h-screen">
        {/* 캘린더 영역 */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
              onClick={() =>
                setMonthCursor(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
            >
              <ChevronLeft size={20} />
            </button>
            <div className="text-lg font-extrabold tracking-tight text-slate-800">
              {monthLabel}
            </div>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"
              onClick={() =>
                setMonthCursor(
                  (prev) =>
                    new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mt-3 text-center text-[13px] font-semibold text-slate-400">
            {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
              <div
                key={d}
                className={`py-2 ${i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : ""}`}
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-3 gap-x-1 mt-2">
            {calendarCells.map((cell, idx) => {
              const hasWorkout =
                cell.dateKey != null &&
                (sessionsByDate.get(cell.dateKey)?.length ?? 0) > 0;
              const isSelected =
                cell.dateKey != null && cell.dateKey === selectedDateKey;

              const isToday = cell.dateKey === toDateKeyLocal(new Date());

              return (
                <button
                  key={`${cell.dateKey ?? "empty"}-${idx}`}
                  type="button"
                  disabled={!cell.dateKey}
                  onClick={() => {
                    if (!cell.dateKey) return;
                    setSelectedDateKey((prev) =>
                      prev === cell.dateKey ? null : cell.dateKey,
                    );
                  }}
                  className={`relative h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                    !cell.dateKey
                      ? "bg-transparent cursor-default"
                      : isSelected
                        ? "bg-main text-white shadow-md shadow-blue-500/20 font-bold"
                        : hasWorkout
                          ? "bg-blue-50 text-slate-700 font-semibold hover:bg-blue-100"
                          : "bg-transparent text-slate-600 hover:bg-slate-50 font-medium"
                  } ${isToday && !isSelected ? "ring-2 ring-main ring-inset text-main font-bold" : ""}`}
                >
                  <span className="text-[15px] z-10 leading-none mt-0.5">
                    {cell.day ?? ""}
                  </span>

                  {/* 작은 점 표시 (기록이 있고 선택되지 않았을 때만 보이거나, 조금 다르게 처리) */}
                  <div className="h-1.5 w-full flex justify-center items-center mt-1">
                    {hasWorkout && (
                      <div
                        className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-main"}`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {/* 리스트 영역 */}
        <div className="px-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-main rounded-full animate-spin mb-4" />
              <span className="text-sm font-medium text-slate-500">
                운동 기록을 불러오는 중...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-sm font-medium text-red-500 bg-red-50 rounded-2xl">
              {error}
            </div>
          ) : selectedDateKey ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-4 px-1">
                <CalendarIcon size={20} className="text-main" />
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  {formatDateHeader(selectedDateKey)} (
                  {getWeekdayKo(selectedDateKey)})
                </h3>
              </div>

              {selectedSessions.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Dumbbell size={28} className="text-slate-300" />
                  </div>
                  <div className="text-[15px] font-bold text-slate-600 mb-1">
                    빈 캘린더네요!
                  </div>
                  <div className="text-sm text-slate-400">
                    선택한 날짜에는 아직 운동 완료 기록이 없어요.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {selectedSessions.map((s, idx) => {
                    const duration = s.totalDurationSeconds;
                    const exercises = getSessionExercises(s);
                    const planTitle = s.planTitle;
                    const programName = s.programName;
                    return (
                      <button
                        type="button"
                        onClick={() => {
                          if (s?.id) {
                            window.location.href = `/workout/sessions/${s.id}/complete`;
                          }
                        }}
                        key={s.id ?? idx}
                        className="w-full text-left bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-blue-100 hover:shadow-[0_8px_30px_rgba(59,130,246,0.08)] transition-all active:scale-[0.98] group relative overflow-hidden flex flex-col gap-4"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-main rounded-l-3xl opacity-80" />

                        {/* Header Info */}
                        <div className="pl-3">
                          <div className="flex justify-between items-start mb-1.5">
                            {planTitle || programName ? (
                              <h4 className="text-base font-extrabold text-slate-800 line-clamp-1 pr-4">
                                {programName ? (
                                  <span className="text-main mr-1">
                                    [{programName}]
                                  </span>
                                ) : (
                                  ""
                                )}
                                {planTitle ?? "완료된 운동"}
                              </h4>
                            ) : (
                              <h4 className="text-base font-extrabold text-slate-800">
                                자유 운동
                              </h4>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                              <Clock size={14} className="text-slate-400" />
                              <span>
                                {formatTime(s.startedAt)} ~{" "}
                                {formatTime(s.endedAt)}
                              </span>
                              <span className="text-slate-300">|</span>
                              <span className="text-slate-700 font-bold">
                                {formatDuration(duration)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 bg-blue-50 px-2.5 py-1 rounded-lg">
                              <Activity size={14} className="text-blue-400" />
                              <span>총 볼륨</span>
                              <span className="text-blue-600 font-bold">
                                {Math.round(
                                  getSessionTotalVolumeKg(s),
                                ).toLocaleString()}{" "}
                                <span className="text-[11px] font-medium">
                                  kg
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Exercise Summary Preview (Only show first 3) */}
                        <div className="pl-3 mt-1 pt-4 border-t border-slate-50 flex flex-col gap-2.5">
                          {(exercises as any[]).slice(0, 3).map((ex, exIdx) => {
                            const name =
                              ex.exerciseName ?? ex.name ?? ex.title ?? "운동";
                            const sets = getExerciseSets(ex);
                            const completedSets = (sets as any[]).filter(
                              isCompletedSet,
                            );

                            if (completedSets.length === 0) return null;

                            // Simple summary for the card: "Squat (3 sets)"
                            return (
                              <div
                                key={`${name}-${exIdx}`}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-blue-300 transition-colors" />
                                <span className="font-bold text-slate-700">
                                  {name}
                                </span>
                                <span className="text-slate-400 text-[13px] font-medium ml-1">
                                  {completedSets.length}세트 완료
                                </span>
                              </div>
                            );
                          })}
                          {(exercises as any[]).length > 3 && (
                            <div className="text-[13px] font-bold text-slate-400 pl-3 mt-1">
                              + {(exercises as any[]).length - 3}개의 운동
                              더보기
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4 px-1">
                <Activity size={20} className="text-slate-400" />
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                  {monthCursor.getMonth() + 1}월 전체 요약
                </h3>
              </div>

              {sessionsByDate.size === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon size={28} className="text-slate-300" />
                  </div>
                  <div className="text-[15px] font-bold text-slate-600 mb-1">
                    이번 달은 아직 운동 기록이 없네요!
                  </div>
                  <div className="text-sm text-slate-400">
                    루틴을 시작하고 멋지게 캘린더를 채워보세요.
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-8">
                  {[...sessionsByDate.entries()]
                    .sort(([a], [b]) => (a < b ? -1 : 1)) // 오름차순
                    .map(([dateKey, list]) => (
                      <div key={dateKey} className="relative">
                        <div className="sticky top-[64px] z-10 bg-[#f8fafc]/95 backdrop-blur-sm py-2 px-1 mb-2 border-b border-slate-100">
                          <div className="text-[15px] font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-main" />
                            {formatDateHeader(dateKey)}{" "}
                            <span className="text-slate-400 text-[13px] font-medium ml-0.5">
                              ({getWeekdayKo(dateKey)})
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 px-1 mt-3">
                          {list.map((s, idx) => (
                            <button
                              key={s.id ?? idx}
                              type="button"
                              onClick={() => {
                                if (s?.id) {
                                  window.location.href = `/workout/sessions/${s.id}/complete`;
                                } else {
                                  setSelectedDateKey(dateKey);
                                }
                              }}
                              className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-main/30 hover:shadow-md transition-all active:scale-[0.98] flex gap-4 items-center"
                            >
                              <div className="flex-1 flex flex-col gap-1.5">
                                <div className="text-[15px] font-extrabold text-slate-800 line-clamp-1">
                                  {s.programName || s.planTitle
                                    ? `${s.programName ? `[${s.programName}] ` : ""}${s.planTitle ?? ""}`
                                    : (getSessionExercises(s) as any[])
                                        .map(
                                          (ex) =>
                                            ex.exerciseName ??
                                            ex.name ??
                                            "운동",
                                        )
                                        .join(", ")}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <div className="text-[12px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>
                                      {formatTime(s.startedAt)} -{" "}
                                      {formatTime(s.endedAt)}
                                    </span>
                                  </div>
                                  <div className="text-[12px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
                                    {formatDuration(s.totalDurationSeconds)}{" "}
                                    소요
                                  </div>
                                  <div className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                    {Math.round(
                                      getSessionTotalVolumeKg(s),
                                    ).toLocaleString()}{" "}
                                    kg
                                  </div>
                                </div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                                <ChevronRight size={18} />
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
