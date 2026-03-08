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
  ArrowUpDown,
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
  return Boolean(set.status === "COMPLETED");
};

const SessionCard = ({
  session,
  onClick,
}: {
  session: SessionLike;
  onClick: () => void;
}) => {
  const duration = session.totalDurationSeconds;
  const exercises = getSessionExercises(session);
  const planTitle = session.planTitle;
  const programName = session.programName;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:border-main/30 hover:shadow-md transition-all active:scale-[0.98] flex items-center"
    >
      <div className="flex-1 flex flex-col gap-1.5">
        <div className="text-[15px] font-extrabold text-slate-800 line-clamp-1">
          {programName || planTitle ? (
            <>
              {programName ? (
                <span className="text-main mr-1">[{programName}]</span>
              ) : (
                ""
              )}
              {planTitle ?? "완료된 운동"}
            </>
          ) : (
            (exercises as any[])
              .map((ex) => ex.exerciseName ?? ex.name ?? "운동")
              .join(", ")
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          <div className="text-[12px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock size={12} />
            <span>
              {formatTime(session.startedAt)} - {formatTime(session.endedAt)}
            </span>
          </div>
          <div className="text-[12px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">
            {formatDuration(duration)} 소요
          </div>
          <div className="text-[12px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            {Math.round(getSessionTotalVolumeKg(session)).toLocaleString()} kg
          </div>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
        <ChevronRight size={18} />
      </div>
    </button>
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
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

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
    <div className="pb-12">
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
                <div className="flex flex-col gap-3">
                  {selectedSessions.map((s, idx) => (
                    <SessionCard
                      key={s.id ?? idx}
                      session={s}
                      onClick={() => {
                        if (s?.id) {
                          window.location.href = `/workout/sessions/${s.id}/complete`;
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center justify-between gap-2 mb-4 px-1">
                <div className="flex items-center gap-2">
                  <Activity size={20} className="text-main" />
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    {monthCursor.getMonth() + 1}월 전체 요약
                  </h3>
                </div>
                <button
                  onClick={() =>
                    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-100 shadow-sm text-[11px] font-bold text-slate-500 hover:text-main hover:border-main transition-all active:scale-95"
                >
                  <ArrowUpDown size={12} />
                  {sortOrder === "desc" ? "최신순" : "오래된순"}
                </button>
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
                    .sort(([a], [b]) =>
                      sortOrder === "desc" ? (a < b ? 1 : -1) : a < b ? -1 : 1,
                    )
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
                            <SessionCard
                              key={s.id ?? idx}
                              session={s}
                              onClick={() => {
                                if (s?.id) {
                                  window.location.href = `/workout/sessions/${s.id}/complete`;
                                } else {
                                  setSelectedDateKey(dateKey);
                                }
                              }}
                            />
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
