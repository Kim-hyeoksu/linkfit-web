import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import type { ClientExercise, ClientSet } from "@/entities/exercise";
import { normalizeExercises } from "./normalize";
import { sessionStateAtom, sessionReturnUrlAtom } from "@/entities/session";

export const useSessionLogic = (
  initialPlanDetail: PlanDetailDto | ActiveSessionDto,
  initialExercises: ClientExercise[],
) => {
  const router = useRouter();

  // Recoil Global State -> Jotai Global State
  const [sessionState, setSessionState] = useAtom(sessionStateAtom);
  const [returnUrl, setReturnUrl] = useAtom(sessionReturnUrlAtom);

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
    const startedAt = (initialPlanDetail as any)?.startedAt;

    if (startedAt) {
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

      if (startTrigger === 0) {
        setStartTrigger(1);
      }
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

      setExercises(normalizeExercises(session)); // 데이터 갱신
      setStartTrigger(1);
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

    let updatedSet;

    if (set.id && Number(set.id) > 0) {
      // 기존 세트 업데이트
      const body = {
        reps,
        weight,
        rpe: set.rpe,
        restSeconds: set.restSeconds,
        status: set.status,
        completedAt: new Date().toISOString(),
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
      };
      updatedSet = await addSessionSet(body);
    }

    // 상태 업데이트
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((s) => (s.id === set.id ? updatedSet : s)),
        };
      }),
    );

    // 다음 세트 준비
    setPendingExerciseId(sessionExerciseId);
    setCurrentExerciseId(sessionExerciseId);
    setCurrentExerciseSetId(set.id ?? -1);

    // Start trigger logic is now handled by effect, but we can double check
    // Actually startTrigger isn't critical for global timer, but local feedback
  };

  // 세트 추가 (낙관적 업데이트)
  const addSets = async (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== exerciseId) return exercise;

        const lastSet = exercise.sets[exercise.sets.length - 1];
        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: -(Date.now() + Math.floor(Math.random() * 1000)),
              sessionExerciseId: exercise.sessionExerciseId,
              setOrder: exercise.sets.length + 1,
              reps: 0,
              weight: 0,
              restSeconds: exercise.restSeconds,
              targetReps: lastSet?.targetReps ?? exercise.reps ?? 0,
              targetWeight: lastSet?.targetWeight ?? exercise.weight ?? 0,
              targetRestSeconds: exercise.restSeconds,
              status: "PENDING",
            },
          ],
        };
      }),
    );
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
            set.id === setId ? { ...set, ...values } : set,
          ),
        };
      }),
    );
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
          defaultWeight: weight,
          defaultReps: reps,
          weight: weight,
          reps: reps,
        };
      }),
    );
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
  };
};
