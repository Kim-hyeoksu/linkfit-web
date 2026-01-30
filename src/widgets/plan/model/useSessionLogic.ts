import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  startSession,
  updateSessionSet,
  addSessionSet,
  deleteSessionSet,
  completeSession,
} from "@/features/session-control";
import type {
  ActiveSessionDto,
  StartSessionRequest,
} from "@/entities/session";
import type { PlanDetailDto } from "@/entities/plan";
import type { ClientExercise, ClientSet } from "@/entities/exercise";

// 정규화 함수도 Logic 내로 이동 또는 Utils로 분리 가능하나, 
// 여기서는 Hook 내부 로직에서 상태 초기화에 쓰이므로 인자로 받거나 내부 정의
export const useSessionLogic = (
  initialPlanDetail: PlanDetailDto | ActiveSessionDto,
  normalizeExercises: (data: any) => ClientExercise[]
) => {
  const router = useRouter();
  
  // 상태 관리
  // exercises는 세션 로직에서 빈번하게 업데이트되므로 여기서 메인으로 관리
  const [exercises, setExercises] = useState<ClientExercise[]>(
    normalizeExercises(initialPlanDetail)
  );
  
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [totalExerciseMs, setTotalExerciseMs] = useState(0);
  const [startTrigger, setStartTrigger] = useState(0);
  
  // 현재 운동/세트 포커스 관리
  const [currentExerciseId, setCurrentExerciseId] = useState<number>(
    exercises[0]?.sessionExerciseId ?? -1
  );
  const [currentExerciseSetId, setCurrentExerciseSetId] = useState<number>(
    exercises[0]?.sets?.[0]?.id ?? -1
  );
  const [pendingExerciseId, setPendingExerciseId] = useState<number>(-1);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 초기 상태 로드 (이미 진행 중인 세션인 경우)
  useEffect(() => {
    const startedAt = (initialPlanDetail as any)?.startedAt;
    if (!startedAt) return;

    const startedMs = new Date(startedAt).getTime();
    const nowMs = Date.now();
    const elapsed = Math.max(nowMs - startedMs, 0);

    setTotalExerciseMs(elapsed);
    setIsSessionStarted(true);
    setSessionId(initialPlanDetail.id ?? null);
    if (startTrigger === 0) {
      startExerciseTimer();
      setStartTrigger(1);
    }
  }, [initialPlanDetail]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // 타이머 로직
  const startExerciseTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTotalExerciseMs((prev) => prev + 1000);
    }, 1000);
  };

  // 운동 시작
  const handleStartWorkout = async () => {
    if (isSessionStarted) return;
    try {
      const body: StartSessionRequest = {
        planId: initialPlanDetail.id,
        userId: 1, // TODO: 실제 유저 ID
        sessionDate: new Date().toISOString(),
        memo: "",
      };

      const session = await startSession(body);
      startExerciseTimer();

      setSessionId(session.id);
      setIsSessionStarted(true);
      setExercises(normalizeExercises(session)); // 데이터 갱신
    } catch (e) {
      console.error("세션 시작 실패", e);
      alert("운동 시작에 실패했습니다.");
    }
  };

  // 세트 완료 토글 (체크)
  const toggleSetCompletion = async (
    sessionExerciseId: number,
    set: ClientSet
  ) => {
    if (!isSessionStarted) return;

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
      })
    );

    // 다음 세트 준비
    setPendingExerciseId(sessionExerciseId);
    setCurrentExerciseId(sessionExerciseId);
    setCurrentExerciseSetId(set.id ?? -1);
    
    if (startTrigger === 0) {
      startExerciseTimer();
    }
    setStartTrigger((t) => t + 1);
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
      })
    );
  };

  // 세트 삭제
  const handleDeleteSet = async (
    exerciseId: number | string,
    setId: number | string
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
        })
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
    values: { weight: number; reps: number }
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.id === setId ? { ...set, ...values } : set
          ),
        };
      })
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
    const body = {
      endedAt: new Date().toISOString(),
      status: "COMPLETED",
      totalDuraionSeconds: Math.floor(totalExerciseMs / 1000),
      memo: "",
    };
    const response = await completeSession(sessionId as number, body);
    return response;
  };

  return {
    exercises,
    setExercises, // 필요 시 외부 주입
    sessionId,
    isSessionStarted,
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
    handleUpdateDefault
  };
};
