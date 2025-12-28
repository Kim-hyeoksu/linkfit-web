"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { PlanDetailDto } from "@/entities/plan";
import type { ActiveSessionDto, SessionExerciseDto } from "@/entities/session";

import type { StartSessionRequest, SessionSet } from "@/entities/session";
import {
  startSession,
  updateSessionSet,
  addSessionSet,
  deleteSessionSet,
  completeSession,
} from "@/features/session-control";
import { ExerciseCard } from "@/entities/exercise";
import { Timer } from "@/entities/exercise";
import { ConfirmModal, Header, Modal } from "@/shared";
import { formatTime } from "@/shared";

export default function PlanClient({
  initialPlanDetail,
}: {
  initialPlanDetail: PlanDetailDto | ActiveSessionDto;
}) {
  const TIMER_HEIGHT = 375;
  const router = useRouter();

  const initialExercisesState = Array.isArray(initialPlanDetail?.exercises)
    ? initialPlanDetail.exercises
    : [];

  const [exercises, setExercises] = useState(initialExercisesState);

  const [currentExerciseId, setCurrentExerciseId] = useState<number>(
    initialExercisesState[0]?.sessionExerciseId ?? -1
  );

  const [currentExerciseSetId, setCurrentExerciseSetId] = useState<number>(
    initialExercisesState[0]?.sets?.[0]?.id ?? -1
  );
  const exerciseRefs = useRef<Map<number | string, HTMLDivElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [showType, setShowType] = useState<"bar" | "full">("bar");
  const [startTrigger, setStartTrigger] = useState(0);

  const [totalExerciseMs, setTotalExerciseMs] = useState(0);
  const [pendingExerciseId, setPendingExerciseId] = useState<number>(-1);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [isEndConfirmLoading, setIsEndConfirmLoading] = useState(false);

  // 활성 세션으로 진입한 경우 startedAt 기준 경과 시간 복구
  useEffect(() => {
    const startedAt = (initialPlanDetail as any)?.startedAt;
    if (!startedAt) return;

    const startedMs = new Date(startedAt).getTime();
    const nowMs = Date.now();
    const elapsed = Math.max(nowMs - startedMs, 0);

    setTotalExerciseMs(elapsed);
    setIsSessionStarted(true);
    setSessionId((initialPlanDetail as any)?.id ?? null);
    if (startTrigger === 0) {
      startExerciseTimer();
      setStartTrigger(1);
    }
  }, [initialPlanDetail, startTrigger]);

  const handleStartWorkout = async () => {
    if (isSessionStarted) return; // 🔒 중복 호출 방지

    try {
      const body: StartSessionRequest = {
        planId: initialPlanDetail.id,
        userId: 1,
        sessionDate: new Date().toISOString(),
        memo: "",
      };

      const session = await startSession(body);
      startExerciseTimer();

      setSessionId(session.id); // 서버에서 내려준 sessionId
      setIsSessionStarted(true);
      setExercises(session.exercises);
    } catch (e) {
      console.error("세션 시작 실패", e);
      alert("운동 시작에 실패했습니다.");
    }
  };

  const startExerciseTimer = () => {
    if (timerRef.current) return; // 이미 동작 중이면 중복 시작 방지

    timerRef.current = setInterval(() => {
      setTotalExerciseMs((prev) => {
        return prev + 1000;
      });
    }, 1000);
  };

  const toggleSetCompletion = async (
    sessionExerciseId: number,
    set: SessionSet
  ) => {
    if (set.id) {
      const body = {
        reps: set.reps,
        weight: set.weight,
        rpe: set.rpe,
        restSeconds: set.restSeconds,
        status: set.status,
        completedAt: new Date().toISOString(),
      };
      const response = await updateSessionSet(set.id, body);
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;

          return {
            ...exercise,
            sets: exercise.sets.map((s: SessionSet) =>
              s.id === set.id ? response : s
            ),
          };
        })
      );
    } else {
      const body = {
        sessionExerciseId: set.sessionExerciseId,
        setOrder: set.setOrder,
        reps: set.reps,
        weight: set.weight,
        restSeconds: set.restSeconds,
      };
      const response = await addSessionSet(body);
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;

          return {
            ...exercise,
            sets: [
              ...exercise.sets.slice(0, exercise.sets.length - 1),
              response,
            ],
          };
        })
      );
    }

    setPendingExerciseId(sessionExerciseId); // ✅ 다음 세트 계산 예약
    setCurrentExerciseId(sessionExerciseId);
    setCurrentExerciseSetId(set.id);
    if (startTrigger === 0) {
      startExerciseTimer();
    }
    setStartTrigger((t) => t + 1);
  };

  const handleCompleteCurrentSetFromTimer = async (
    sessionExerciseId: number,
    sessionSetId: number
  ) => {
    const exercise = exercises.find(
      (ex: any) => ex.sessionExerciseId === sessionExerciseId
    );
    console.log("exercise", exercise);
    if (!exercise) return;

    const set = (exercise.sets ?? []).find(
      (s: any) => s.id === sessionSetId
    ) as SessionSet | undefined;
    if (!set) return;
    console.log("set", set);
    await toggleSetCompletion(Number(sessionExerciseId), set);
  };

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  useEffect(() => {
    if (pendingExerciseId !== -1) {
      handleNextSet(pendingExerciseId);
      // handleExerciseClick(pendingExerciseId);
      setPendingExerciseId(-1);
    }
  }, [exercises, pendingExerciseId]);
  const handleExerciseClick = (id: number | string) => {
    console.log("handleExerciseClick", id);
    if (startTrigger === 0) return;
    setCurrentExerciseId(id);
    setTimeout(() => {
      const el = exerciseRefs.current.get(id);
      if (el && wrapperRef.current) {
        wrapperRef.current.scrollTo({
          top: el.offsetTop - 56,
          behavior: "smooth",
        });
      }
    }, 50);
  };
  // 다음 세트로 이동
  // const handleNextSet = (exerciseId: number) => {
  //   const exercise = exercises.find((ex) => ex.id === exerciseId);
  //   if (!exercise) return;
  //   const currentSetIndex = exercise.sets.findIndex(
  //     (set) => set.id === currentExerciseSetId
  //   );
  //   // 다음 세트로 이동, 마지막이면 null로 초기화
  //   const nextSet = exercise.sets[currentSetIndex + 1];
  //   // 다음 세트가 없다면 다음 종목의 첫 세트로 이동
  //   if (!nextSet) {
  //     const currentExerciseIndex = exercises.findIndex(
  //       (item) => item.id === exerciseId
  //     );
  //     const nextExerciseFirstSet = exercises[currentExerciseIndex + 1];
  //     setCurrentExerciseSetId(
  //       nextExerciseFirstSet ? nextExerciseFirstSet.sets[0].id : -1
  //     );
  //     nextExercise(exerciseId);
  //   } else {
  //     setCurrentExerciseSetId(nextSet ? nextSet.id : 0);
  //   }
  // };
  const handleNextSet = (exerciseId: number | string) => {
    const exercise = exercises.find(
      (ex) => ex.sessionExerciseId === exerciseId
    );
    if (!exercise) return;
    // 아직 완료되지 않은 세트를 찾음
    const nextIncompleteSet = exercise.sets.find(
      (set: SessionSet) => !set.completedAt
    );
    console.log("nextIncompleteSet", nextIncompleteSet);

    if (nextIncompleteSet) {
      // 완료되지 않은 세트가 있으면 거기로 이동
      setCurrentExerciseSetId(nextIncompleteSet.sessionExerciseId);
    } else {
      // 현재 운동의 모든 세트를 완료한 경우 다음 운동으로 이동
      const currentExerciseIndex = exercises.findIndex(
        (item) => item.sessionExerciseId === exerciseId
      );
      const nextExercise = exercises[currentExerciseIndex + 1];

      if (nextExercise) {
        const nextExerciseFirstIncompleteSet = nextExercise.sets.find(
          (set) => !set.completedAt
        );

        // 다음 운동의 첫 미완료 세트로 이동
        if (nextExerciseFirstIncompleteSet) {
          setCurrentExerciseSetId(
            nextExerciseFirstIncompleteSet.sessionExerciseId
          );
        } else {
          // 다음 운동의 세트가 모두 완료된 경우 -1로 설정
          setCurrentExerciseSetId(-1);
        }

        handleExerciseClick(nextExercise.sessionExerciseId);
      } else {
        // 모든 운동이 끝난 경우
        setCurrentExerciseSetId(-1);
      }
    }
  };

  const nextExercise = (exerciseId: number) => {
    const currentIndex = exercises.findIndex(
      (item) => item.sessionExerciseId === exerciseId
    );
    if (currentIndex !== -1 && currentIndex + 1 < exercises.length) {
      const nextExerciseId = exercises[currentIndex + 1].sessionExerciseId;
      handleExerciseClick(nextExerciseId);
    }
  };

  const addSets = async (sessionExerciseId: number) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;

        return {
          ...exercise,
          sets: [
            ...exercise.sets,
            {
              id: null, // 아직 서버에 저장되지 않음
              sessionExerciseId: exercise.sessionExerciseId,
              reps: exercise.defaultReps ?? exercise.targetReps ?? 0,
              weight: exercise.defaultWeight ?? exercise.targetWeight ?? 0,
              restSeconds:
                exercise.defaultRestSeconds ?? exercise.targetRestSeconds ?? 0,
              setOrder: exercise.sets.length + 1,
            },
          ],
        };
      })
    );
  };

  const handleUpdateSet = (
    sessionExerciseId: number | string,
    setId: number | string,
    values: { weight: number; reps: number }
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;

        return {
          ...exercise,
          sets: exercise.sets.map((set: SessionSet) =>
            set.id === setId ? { ...set, ...values } : set
          ),
        };
      })
    );
  };

  const handleDeleteSet = async (
    sessionExerciseId: number | string,
    setId: number | string
  ) => {
    try {
      const response = await deleteSessionSet(setId);
      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.sessionExerciseId !== sessionExerciseId) return exercise;

          return {
            ...exercise,
            sets: exercise.sets.filter((set: SessionSet) => set.id !== setId),
          };
        })
      );
    } catch (e) {
      console.error("세트 삭제 실패", e);
      alert("세트 삭제에 실패했습니다.");
      return;
    }
  };

  const handleSave = async () => {
    const body = {
      endedAt: new Date().toISOString(),
      status: "COMPLETED",
      totalDuraionSeconds: Math.floor(totalExerciseMs / 1000),
      memo: "",
    };
    const response = await completeSession(sessionId as number, body);
    console.log("세션 완료 성공", response);
    return response;
  };

  const handleConfirmEndWorkout = async () => {
    setIsEndConfirmLoading(true);
    try {
      await handleSave();

      if (sessionId) {
        router.push(`/workout/sessions/${sessionId}/complete`);
      }
      setIsEndConfirmOpen(false);
    } catch (e) {
      console.error("세션 완료 실패", e);
      alert("운동 종료에 실패했습니다.");
    } finally {
      setIsEndConfirmLoading(false);
    }
  };

  return (
    <div>
      <Header showBackButton={true} title={formatTime(totalExerciseMs)}>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInfoModalOpen(true);
            }}
            className="bg-light-gray text-dark-gray w-[60px] h-[32px] rounded-lg"
          >
            정보
          </button>
          {totalExerciseMs > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEndConfirmOpen(true);
              }}
              className="bg-light-gray text-dark-gray w-[124px] h-[32px] rounded-lg"
            >
              운동 종료
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing((prev) => !prev);
              }}
              className={`w-[124px] h-[32px] rounded-lg ${
                isEditing
                  ? "bg-light-gray text-dark-gray"
                  : "bg-main text-white"
              }`}
            >
              {isEditing ? "수정 완료" : "운동 수정"}
            </button>
          )}
        </div>
      </Header>
      <div
        ref={wrapperRef}
        className="overflow-y-auto"
        style={{
          height: `calc(100vh - 60px - ${
            showType === "full" ? TIMER_HEIGHT : 0
          }px)`,
        }}
      >
        currentExerciseId:{currentExerciseId}/currentExerciseSetId:{" "}
        {currentExerciseSetId}/startTrigger:{startTrigger}
        <div className="flex flex-col gap-[10px] bg-[#F7F8F9]">
          {exercises.map((exercise) => {
            const exerciseSets = exercise.sets ?? [];

            return (
              <div
                key={exercise?.sessionExerciseId}
                className="bg-white"
                ref={(el) => {
                  if (el)
                    exerciseRefs.current.set(exercise.sessionExerciseId, el);
                }}
              >
                <ExerciseCard
                  exercise={exercise}
                  sets={exerciseSets}
                  isCurrent={exercise.sessionExerciseId === currentExerciseId}
                  isEditing={isEditing}
                  currentExerciseSetId={currentExerciseSetId}
                  onClickExercise={handleExerciseClick}
                  onClickSetCheckBtn={toggleSetCompletion}
                  addSets={addSets}
                  onUpdateSet={handleUpdateSet}
                  onDeleteSet={handleDeleteSet}
                  onToggleEdit={() => setIsEditing((prev) => !prev)}
                />
              </div>
            );
          })}
        </div>
        <Timer
          startTrigger={startTrigger}
          restSeconds={
            exercises.find(
              (exercise) => exercise.sessionExerciseId === currentExerciseId
            )?.targetRestSeconds || 60
          }
          nextExercise={nextExercise}
          showType={showType}
          onShowTypeChange={(newType) => setShowType(newType)}
          onCompleteSet={handleCompleteCurrentSetFromTimer}
          currentExerciseId={currentExerciseId}
          currentExerciseSetId={currentExerciseSetId}
          onStartWorkout={handleStartWorkout}
          isSessionStarted={isSessionStarted}
        />
      </div>
      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        title="세션 정보"
      >
        <div className="text-sm text-gray-700 space-y-2">
          <div>sessionId: {sessionId ?? "-"}</div>
          <div>isSessionStarted: {String(isSessionStarted)}</div>
          <div>isEditing: {String(isEditing)}</div>
          <div>currentExerciseId: {String(currentExerciseId)}</div>
          <div>currentExerciseSetId: {String(currentExerciseSetId)}</div>
        </div>
        <div className="mt-5">
          <button
            className="w-full h-[42px] rounded-lg bg-main text-white"
            onClick={() => setIsInfoModalOpen(false)}
          >
            닫기
          </button>
        </div>
      </Modal>
      <ConfirmModal
        isOpen={isEndConfirmOpen}
        onClose={() => setIsEndConfirmOpen(false)}
        title="운동 종료"
        description="운동을 종료하고 기록을 저장할까요?"
        confirmText="종료"
        cancelText="취소"
        isConfirmLoading={isEndConfirmLoading}
        onConfirm={handleConfirmEndWorkout}
      />
    </div>
  );
}
