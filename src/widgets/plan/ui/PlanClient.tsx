"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { PlanDetailDto, PlanDetailExerciseDto } from "@/entities/plan";
import type { ActiveSessionDto, SessionExerciseDto } from "@/entities/session";
import {
  ExerciseCard,
  type ClientSet,
  type ClientExercise,
} from "@/entities/exercise";
import { Timer } from "@/entities/exercise";
import { ConfirmModal, Header, Modal } from "@/shared";
import { formatTime } from "@/shared";

import { usePlanLogic } from "../model/usePlanLogic";
import { useSessionLogic } from "../model/useSessionLogic";

// ... imports

export default function PlanClient({
  initialPlanDetail,
  initialExercises,
}: {
  initialPlanDetail: PlanDetailDto | ActiveSessionDto;
  initialExercises: ClientExercise[];
}) {
  const TIMER_HEIGHT = 375;
  const router = useRouter();

  // ✅ Custom Hooks 사용
  const {
    isEditing,
    isUpdating,
    handleUpdatePlan,
    toggleEditMode,
    setIsEditing,
  } = usePlanLogic(initialPlanDetail);

  const {
    exercises,
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
    handleUpdateDefault,
  } = useSessionLogic(initialPlanDetail, initialExercises);

  // UI 상태 관리
  const [showType, setShowType] = useState<"bar" | "full">("bar");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [isEndConfirmLoading, setIsEndConfirmLoading] = useState(false);

  const exerciseRefs = useRef<Map<number | string, HTMLDivElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ✅ View Helper Logic
  const handleExerciseClick = (id: number) => {
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

  const handleNextSet = (exerciseId: number) => {
    const exercise = exercises.find(
      (ex) => ex.sessionExerciseId === exerciseId,
    );
    if (!exercise) return;
    const nextIncompleteSet = exercise.sets.find((set) => !set.completedAt);

    if (nextIncompleteSet) {
      setCurrentExerciseSetId(nextIncompleteSet.sessionExerciseId ?? -1);
    } else {
      const currentExerciseIndex = exercises.findIndex(
        (item) => item.sessionExerciseId === exerciseId,
      );
      const nextExercise = exercises[currentExerciseIndex + 1];

      if (nextExercise) {
        const nextExerciseFirstIncompleteSet = nextExercise.sets.find(
          (set) => !set.completedAt,
        );

        if (nextExerciseFirstIncompleteSet) {
          setCurrentExerciseSetId(
            nextExerciseFirstIncompleteSet.sessionExerciseId ?? -1,
          );
        } else {
          setCurrentExerciseSetId(-1);
        }
        handleExerciseClick(nextExercise.sessionExerciseId);
      } else {
        setCurrentExerciseSetId(-1);
      }
    }
  };

  const nextExercise = (exerciseId: number) => {
    const currentIndex = exercises.findIndex(
      (item) => item.sessionExerciseId === exerciseId,
    );
    if (currentIndex !== -1 && currentIndex + 1 < exercises.length) {
      const nextExerciseId = exercises[currentIndex + 1].sessionExerciseId;
      handleExerciseClick(nextExerciseId);
    }
  };

  const handleCompleteCurrentSetFromTimer = async (
    sessionExerciseId: number,
    sessionSetId: number,
  ) => {
    const exercise = exercises.find(
      (ex) => ex.sessionExerciseId === sessionExerciseId,
    );
    if (!exercise) return;

    const set = (exercise.sets ?? []).find(
      (s: ClientSet) => s.id === sessionSetId,
    );
    if (!set) return;
    await toggleSetCompletion(Number(sessionExerciseId), set);
  };

  useEffect(() => {
    if (pendingExerciseId !== -1) {
      handleNextSet(pendingExerciseId);
      setPendingExerciseId(-1);
    }
  }, [exercises, pendingExerciseId]);

  const handleEditButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isEditing) {
      handleUpdatePlan(exercises);
    } else {
      toggleEditMode();
    }
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
              onClick={handleEditButtonClick}
              disabled={isUpdating}
              className={`w-[124px] h-[32px] rounded-lg ${
                isEditing
                  ? "bg-light-gray text-dark-gray"
                  : "bg-main text-white"
              }`}
            >
              {isUpdating
                ? "저장 중..."
                : isEditing
                  ? "수정 완료"
                  : "운동 수정"}
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
        <div className="flex flex-col gap-[10px] pb-[72px]">
          {exercises.map((exercise) => {
            const exerciseSets = exercise.sets ?? [];
            return (
              <div
                key={exercise.sessionExerciseId}
                className="bg-white px-5 "
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
                  onUpdateDefault={handleUpdateDefault}
                  onToggleEdit={() => setIsEditing((prev: boolean) => !prev)}
                />
              </div>
            );
          })}
        </div>
        <Timer
          startTrigger={startTrigger}
          restSeconds={
            exercises.find(
              (exercise) => exercise.sessionExerciseId === currentExerciseId,
            )?.restSeconds || 60
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
