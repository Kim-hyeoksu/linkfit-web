import { useState, useRef, useEffect } from "react";

import { useAtom } from "jotai";
import {
  startSession,
  updateSessionSet,
  addSessionSet,
  deleteSessionSet,
  completeSession,
} from "@/features/session-control";
import type { ActiveSessionDto, StartSessionRequest } from "@/entities/session";
import type { PlanDetailDto } from "@/entities/plan";
import type { ClientExercise, ClientSet, Exercise } from "@/entities/exercise";
import { normalizeExercises } from "./normalize";
import { sessionStateAtom, sessionReturnUrlAtom } from "@/entities/session";

export const useSessionLogic = (
  initialPlanDetail: PlanDetailDto | ActiveSessionDto,
  initialExercises: ClientExercise[],
) => {
  // Recoil Global State -> Jotai Global State
  const [sessionState, setSessionState] = useAtom(sessionStateAtom);
  const [, setReturnUrl] = useAtom(sessionReturnUrlAtom);

  // Local UI State
  // exercises는 세션 로직에서 빈번하게 업데이트되므로 여기서 메인으로 관리
  const [exercises, setExercises] =
    useState<ClientExercise[]>(initialExercises);

  const [totalExerciseMs, setTotalExerciseMs] = useState(0);
  const [startTrigger, setStartTrigger] = useState(0);

  // 현재 운동/세트 포커스 관리
  const [currentExerciseId, setCurrentExerciseId] = useState<number>(
    exercises[0]?.sessionExerciseId ?? -1,
  );
  const [currentExerciseSetId, setCurrentExerciseSetId] = useState<number>(
    exercises[0]?.sets?.[0]?.id ?? -1,
  );
  const [pendingExerciseId, setPendingExerciseId] = useState<number>(-1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from Server Data and Sync to Recoil
  useEffect(() => {
    const startedAt = (initialPlanDetail as Record<string, unknown>)?.startedAt;

    if (startedAt && typeof startedAt === "string") {
      // If server says session is active, sync to global state
      setSessionState((prev) => ({
        ...prev,
        sessionId: initialPlanDetail.id,
        isSessionStarted: true,
        startedAt: startedAt,
        planId: initialPlanDetail.id,
      }));
      setReturnUrl(window.location.pathname);

      // Initialize local timer display
      const startedMs = new Date(startedAt).getTime();
      const nowMs = Date.now();
      const elapsed = Math.max(nowMs - startedMs, 0);
      setTotalExerciseMs(elapsed);
    }
  }, [initialPlanDetail, setSessionState, setReturnUrl]);

  // Timer Logic (Based on Global startedAt)
  useEffect(() => {
    if (sessionState.isSessionStarted && sessionState.startedAt) {
      if (timerRef.current) clearInterval(timerRef.current);

      // Update immediately
      const startedMs = new Date(sessionState.startedAt).getTime();
      setTotalExerciseMs(Math.max(Date.now() - startedMs, 0));

      timerRef.current = setInterval(() => {
        const now = Date.now();
        setTotalExerciseMs(Math.max(now - startedMs, 0));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [sessionState.isSessionStarted, sessionState.startedAt]);

  // 운동 시작
  const handleStartWorkout = async () => {
    if (sessionState.isSessionStarted) return;
    try {
      const now = new Date().toISOString();
      const body: StartSessionRequest = {
        planId: initialPlanDetail.id,
        sessionDate: now,
        memo: "",
      };

      const session = await startSession(body);

      // Update Global State
      setSessionState({
        sessionId: session.id,
        isSessionStarted: true,
        startedAt: session.startedAt,
        planId: initialPlanDetail.id,
        totalExerciseMs: 0,
      });
      setReturnUrl(window.location.pathname);

      const normalized = normalizeExercises(session);
      setExercises(normalized); // 데이터 갱신

      // 첫 번째 운동 정보가 있으면 포커스(펼치기)
      if (normalized.length > 0) {
        const firstEx = normalized[0];
        setCurrentExerciseId(firstEx.sessionExerciseId);

        if (firstEx.sets && firstEx.sets.length > 0) {
          setCurrentExerciseSetId(firstEx.sets[0].id);
        }
      }
    } catch (e) {
      console.error("세션 시작 실패", e);
      alert("운동 시작에 실패했습니다.");
    }
  };

  // 세트 완료 토글 (체크)
  const toggleSetCompletion = async (
    sessionExerciseId: number,
    set: ClientSet,
  ) => {
    if (!sessionState.isSessionStarted) return; // Use Global State Check

    const reps = set.reps || set.targetReps || 0;
    const weight = set.weight || set.targetWeight || 0;

    // 현재 완료 유무에 따라 토글 분기
    const isCurrentlyCompleted = set.status === "COMPLETED";
    const newStatus = isCurrentlyCompleted ? "IN_PROGRESS" : "COMPLETED";
    const newCompletedAt = isCurrentlyCompleted
      ? null
      : new Date().toISOString();

    let updatedSet;

    if (set.id && Number(set.id) > 0) {
      // 기존 세트 업데이트
      const body = {
        reps,
        weight,
        rpe: set.rpe,
        restSeconds: set.restSeconds,
        status: newStatus,
        completedAt: newCompletedAt,
      };
      updatedSet = await updateSessionSet(set.id, body);
    } else {
      // 새 세트 추가 (ID가 음수거나 없을 때)
      const body = {
        sessionExerciseId: set.sessionExerciseId,
        setOrder: set.setOrder,
        reps,
        weight,
        restSeconds: set.restSeconds,
        status: newStatus,
        completedAt: newCompletedAt,
      };
      updatedSet = await addSessionSet(body);
    }

    // 상태 업데이트
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((s) => {
            if (s.id === set.id) {
              return {
                ...s,
                ...updatedSet,
                status: newStatus,
                completedAt: newCompletedAt,
              };
            }
            return s;
          }),
        };
      }),
    );

    // 다음 세트 준비
    setPendingExerciseId(sessionExerciseId);
    setCurrentExerciseId(sessionExerciseId);
    setCurrentExerciseSetId(set.id ?? -1);

    if (newStatus === "COMPLETED") {
      setStartTrigger((prev) => prev + 1);
    }
  };

  // 세트 추가 (서버 연동)
  const addSets = async (exerciseId: number) => {
    const exercise = exercises.find(
      (ex) => ex.sessionExerciseId === exerciseId,
    );
    if (!exercise) return;

    const lastSet = exercise.sets[exercise.sets.length - 1];
    const reps = lastSet?.reps ?? exercise.targetReps ?? 0;
    const weight = lastSet?.weight ?? exercise.targetWeight ?? 0;

    try {
      // 서버에 세트 생성 요청
      const body = {
        sessionExerciseId: exerciseId,
        reps,
        weight,
        restSeconds: exercise.restSeconds,
      };
      const realSet = await addSessionSet(body);

      // 로컬 상태 업데이트 (진짜 ID 반영)
      setExercises((prev) =>
        prev.map((ex) => {
          if (ex.sessionExerciseId !== exerciseId) return ex;
          return {
            ...ex,
            sets: [
              ...ex.sets,
              {
                ...realSet,
                id: realSet.id,
                sessionExerciseId: ex.sessionExerciseId,
                status: realSet.status || "IN_PROGRESS",
                reps: realSet.reps || reps,
                weight: realSet.weight || weight,
                targetReps: reps,
                targetWeight: weight,
                targetRestSeconds: ex.restSeconds,
              },
            ],
          };
        }),
      );
    } catch (e) {
      console.error("세트 추가 실패", e);
      alert("세트 추가에 실패했습니다.");
    }
  };

  // 세트 삭제
  const handleDeleteSet = async (
    exerciseId: number | string,
    setId: number | string,
  ) => {
    try {
      if (setId && Number(setId) > 0) {
        await deleteSessionSet(setId);
      }
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.sessionExerciseId !== exerciseId) return exercise;
          return {
            ...exercise,
            sets: exercise.sets.filter((set) => set.id !== setId),
          };
        }),
      );
    } catch (e) {
      console.error("세트 삭제 실패", e);
      alert("세트 삭제에 실패했습니다.");
    }
  };

  // 단순 로컬 업데이트 (입력값 변경 등)
  const handleUpdateSet = (
    exerciseId: number | string,
    setId: number | string,
    values: { weight: number; reps: number },
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId
              ? {
                  ...set,
                  ...values,
                  targetWeight: values.weight,
                  targetReps: values.reps,
                }
              : set,
          ),
        };
      }),
    );
  };

  // 세트 데이터 서버 저장
  const handleSaveSet = async (sessionExerciseId: number, setId: number) => {
    if (!sessionState.isSessionStarted) return;
    if (!setId || Number(setId) < 0) return;

    const exercise = exercises.find(
      (ex) => ex.sessionExerciseId === sessionExerciseId,
    );
    if (!exercise) return;

    const set = exercise.sets.find((s) => s.id === setId);
    if (!set) return;

    try {
      await updateSessionSet(setId, {
        reps: set.reps,
        weight: set.weight,
        status: set.status,
        restSeconds: set.restSeconds,
        rpe: set.rpe,
      });
    } catch (e) {
      console.error("세트 실시간 저장 실패", e);
    }
  };

  const handleUpdateDefault = (
    sessionExerciseId: number,
    weight: number,
    reps: number,
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;
        return {
          ...exercise,
          targetWeight: weight,
          targetReps: reps,
          weight: weight,
          reps: reps,
        };
      }),
    );
  };

  // 운동 추가
  const handleAddExercise = (exercise: Exercise) => {
    const tempSessionExerciseId = -(
      Date.now() + Math.floor(Math.random() * 1000)
    );

    const newClientExercise: ClientExercise = {
      sessionExerciseId: tempSessionExerciseId,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      targetSets: exercise.targetSets || 3,
      targetReps: exercise.targetReps || 10,
      targetWeight: exercise.targetWeight || 0,
      restSeconds: exercise.targetRestSeconds || 60,
      orderIndex: exercises.length,
      sets: [],
    };

    // 기본 세트 생성
    const initialSets: ClientSet[] = Array.from(
      { length: newClientExercise.targetSets },
      (_, i) => ({
        id: -(Date.now() + i + Math.floor(Math.random() * 1000)),
        sessionExerciseId: tempSessionExerciseId,
        setOrder: i + 1,
        reps: newClientExercise.targetReps,
        weight: newClientExercise.targetWeight,
        restSeconds: newClientExercise.restSeconds,
        targetReps: newClientExercise.targetReps,
        targetWeight: newClientExercise.targetWeight,
        targetRestSeconds: newClientExercise.restSeconds,
        status: "PENDING",
      }),
    );

    newClientExercise.sets = initialSets;
    setExercises((prev) => [...prev, newClientExercise]);
  };

  // 운동 종료
  const handleSave = async () => {
    if (!sessionState.sessionId) return;

    let duration = 0;
    if (sessionState.startedAt) {
      duration = Math.floor(
        (Date.now() - new Date(sessionState.startedAt).getTime()) / 1000,
      );
    }

    const body = {
      endedAt: new Date().toISOString(),
      status: "COMPLETED",
      totalDuraionSeconds: duration,
      memo: "",
    };
    const response = await completeSession(sessionState.sessionId, body);

    // Reset Global State
    setSessionState({
      sessionId: null,
      isSessionStarted: false,
      startedAt: null,
      planId: null,
      totalExerciseMs: 0,
    });
    setReturnUrl(null);

    return response;
  };

  return {
    exercises,
    setExercises, // 필요 시 외부 주입
    sessionId: sessionState.sessionId,
    isSessionStarted: sessionState.isSessionStarted,
    totalExerciseMs,
    startTrigger,
    currentExerciseId,
    setCurrentExerciseId,
    currentExerciseSetId,
    setCurrentExerciseSetId,
    pendingExerciseId,
    setPendingExerciseId,
    handleStartWorkout,
    toggleSetCompletion,
    addSets,
    handleDeleteSet,
    handleUpdateSet,
    handleSave,
    handleUpdateDefault,
    handleAddExercise,
    handleSaveSet,
  };
};
