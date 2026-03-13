"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { PlanDetailDto } from "@/entities/plan";
import type { ActiveSessionDto } from "@/entities/session";
import {
  ExerciseCard,
  type ClientSet,
  type ClientExercise,
  ExerciseList,
  type Exercise,
  getExercises,
} from "@/entities/exercise";
import { Timer } from "@/entities/exercise";
import { ConfirmModal, Header, Modal } from "@/shared";
import { formatTime } from "@/shared";
import { PlusCircle } from "lucide-react";

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

  const {
    exercises,
    setExercises,
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
    handleDiscard,
    handleUpdateDefault,
    handleAddExercise,
    handleDeleteExercise,
    handleSaveSet,
  } = useSessionLogic(initialPlanDetail, initialExercises);

  // ✅ Custom Hooks 사용
  const {
    isEditing,
    isUpdating,
    handleUpdatePlan,
    toggleEditMode,
    setIsEditing,
    handleAddExerciseToPlan,
    handleAddSetToPlan,
    handleDeleteSetFromPlan,
    handleDeleteExerciseFromPlan,
  } = usePlanLogic(initialPlanDetail, setExercises);

  const [isExerciseSelectorOpen, setIsExerciseSelectorOpen] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (isExerciseSelectorOpen) {
      const loadExercises = async () => {
        try {
          const data = await getExercises();
          setAvailableExercises(data);
        } catch (error) {
          console.error("운동 목록 조회 실패:", error);
        }
      };
      loadExercises();
    }
  }, [isExerciseSelectorOpen]);

  const handleExerciseSelect = (exercise: Exercise) => {
    if (isSessionStarted) {
      handleAddExercise(exercise);
    } else {
      handleAddExerciseToPlan(exercise, exercises.length);
    }
    setIsExerciseSelectorOpen(false);
  };

  const handleAddSetsCombined = (exerciseId: number) => {
    if (isSessionStarted) {
      addSets(exerciseId);
    } else {
      handleAddSetToPlan(exerciseId);
    }
  };

  const handleDeleteSetCombined = (
    exerciseId: number | string,
    setId: number | string,
  ) => {
    if (isSessionStarted) {
      handleDeleteSet(exerciseId, setId);
    } else {
      handleDeleteSetFromPlan(exerciseId, setId);
    }
  };

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<number | null>(null);

  const handleDeleteExerciseCombined = (exerciseId: number) => {
    setExerciseToDelete(exerciseId);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteExercise = () => {
    if (exerciseToDelete === null) return;
    if (isSessionStarted) {
      handleDeleteExercise(exerciseToDelete);
    } else {
      handleDeleteExerciseFromPlan(exerciseToDelete);
    }
    setIsDeleteConfirmOpen(false);
    setExerciseToDelete(null);
  };

  // UI 상태 관리
  const [showType, setShowType] = useState<"bar" | "full">("bar");

  const handleShowTypeChange = React.useCallback((newType: "bar" | "full") => {
    setShowType(newType);
  }, []);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEndConfirmOpen, setIsEndConfirmOpen] = useState(false);
  const [isEndConfirmLoading, setIsEndConfirmLoading] = useState(false);

  const exerciseRefs = useRef<Map<number | string, HTMLDivElement>>(new Map());
  const wrapperRef = useRef<HTMLDivElement>(null);

  // ✅ View Helper Logic
  const handleExerciseClick = React.useCallback(
    (id: number) => {
      setCurrentExerciseId(id);
    },
    [setCurrentExerciseId],
  );

  const nextExercise = (exerciseId: number) => {
    const currentIndex = exercises.findIndex(
      (item) => item.sessionExerciseId === exerciseId,
    );
    if (currentIndex !== -1 && currentIndex + 1 < exercises.length) {
      const nextExerciseId = exercises[currentIndex + 1].sessionExerciseId;
      setCurrentExerciseId(nextExerciseId);
    }
  };

  // 현재 운동이 바뀌면 해당 위치로 스무스하게 스크롤
  useEffect(() => {
    if (currentExerciseId !== -1) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = exerciseRefs.current.get(currentExerciseId);
          if (el && wrapperRef.current) {
            wrapperRef.current.scrollTo({
              top: el.offsetTop - 70,
              behavior: "smooth",
            });
          }
        });
      });
    }
  }, [currentExerciseId]);

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

  const [allCompletedTriggered, setAllCompletedTriggered] = useState(false);

  useEffect(() => {
    if (!isSessionStarted || exercises.length === 0) return;

    const isAllCompleted = exercises.every((ex) =>
      ex.sets.every((set) => set.status === "COMPLETED"),
    );

    if (isAllCompleted && !allCompletedTriggered) {
      setAllCompletedTriggered(true);
      setIsEndConfirmOpen(true);
    } else if (!isAllCompleted && allCompletedTriggered) {
      setAllCompletedTriggered(false);
    }
  }, [exercises, isSessionStarted, allCompletedTriggered]);

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

  const handleDiscardWorkout = () => {
    handleDiscard();
    setIsEndConfirmOpen(false);
    router.replace('/workout/plans');
  };

  const totalVolume = exercises.reduce((acc, ex) => {
    return acc + (ex.sets ?? []).reduce((setAcc, set) => {
      if (set.status === "COMPLETED") {
        return setAcc + (Number(set.reps) || 0) * (Number(set.weight) || 0);
      }
      return setAcc;
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header
        showBackButton={true}
        title={
          isSessionStarted
            ? formatTime(totalExerciseMs)
            : (initialPlanDetail as PlanDetailDto).title
        }
        className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-slate-200/50"
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInfoModalOpen(true);
            }}
            className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 px-3.5 h-[36px] rounded-xl font-bold text-[13px] transition-all active:scale-95 whitespace-nowrap"
          >
            정보
          </button>
          {isSessionStarted ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEndConfirmOpen(true);
              }}
              className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 px-4 h-[36px] rounded-xl font-black text-[13px] transition-all active:scale-95 shadow-sm shadow-red-100 whitespace-nowrap"
            >
              운동 종료
            </button>
          ) : (
            <button
              onClick={handleEditButtonClick}
              disabled={isUpdating}
              className={`flex items-center justify-center px-4 h-[36px] rounded-xl font-black text-[13px] transition-all active:scale-95 shadow-sm whitespace-nowrap ${
                isEditing
                  ? "bg-blue-600 text-white shadow-blue-100 hover:shadow-md"
                  : "bg-main text-white shadow-blue-100 hover:shadow-md"
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
        className="overflow-y-auto px-4 pt-4 scroll-smooth scrollbar-hide"
        style={{
          height: `calc(100vh - 60px - ${
            showType === "full" ? TIMER_HEIGHT : 0
          }px)`,
        }}
      >
        <div className="flex flex-col gap-[14px] pb-[110px] max-w-2xl mx-auto">
          {exercises.map((exercise, index) => {
            const exerciseSets = exercise.sets ?? [];
            return (
              <div
                key={`${exercise.sessionExerciseId}-${index}`}
                className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out"
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
                  isSessionStarted={isSessionStarted}
                  currentExerciseSetId={currentExerciseSetId}
                  onClickExercise={handleExerciseClick}
                  onClickSetCheckBtn={toggleSetCompletion}
                  addSets={handleAddSetsCombined}
                  onUpdateSet={handleUpdateSet}
                  onSaveSet={handleSaveSet}
                  onDeleteSet={handleDeleteSetCombined}
                  onDeleteExercise={handleDeleteExerciseCombined}
                  onUpdateDefault={handleUpdateDefault}
                  onToggleEdit={() => setIsEditing((prev: boolean) => !prev)}
                />
              </div>
            );
          })}

          {(isSessionStarted || isEditing) && (
            <button
              onClick={() => setIsExerciseSelectorOpen(true)}
              className="w-full py-4 mt-2 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-2 text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
            >
              <PlusCircle size={20} />
              운동 추가하기
            </button>
          )}
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
          onShowTypeChange={handleShowTypeChange}
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
        title="운동 종료"
        description={
          <div className="flex flex-col gap-4">
            <p className="text-slate-600">운동을 종료하고 기록을 저장할까요?</p>
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">총 운동 시간</span>
                <span className="text-[16px] text-slate-700 font-black">{formatTime(totalExerciseMs)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">총 볼륨 (kg)</span>
                <span className="text-[16px] text-slate-700 font-black">{totalVolume.toLocaleString()} kg</span>
              </div>
            </div>
          </div>
        }
        confirmText="기록 저장"
        cancelText="운동 삭제"
        confirmButtonClassName="bg-main text-white"
        cancelButtonClassName="bg-red-50 text-red-500 hover:bg-red-100 border-none"
        isConfirmLoading={isEndConfirmLoading}
        onConfirm={handleConfirmEndWorkout}
        onCancel={handleDiscardWorkout}
        onClose={() => setIsEndConfirmOpen(false)}
        hideCloseButton={false}
      />
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setExerciseToDelete(null);
        }}
        onConfirm={confirmDeleteExercise}
        title="운동 삭제"
        description="이 운동을 삭제하시겠습니까? 등록된 모든 세트 기록이 사라집니다."
        confirmText="삭제"
        confirmButtonClassName="bg-red-500 text-white"
      />
      <Modal
        isOpen={isExerciseSelectorOpen}
        onClose={() => setIsExerciseSelectorOpen(false)}
        title="운동 선택"
      >
        <div className="h-[60vh] overflow-y-auto pr-2 scrollbar-hide py-2">
          <ExerciseList
            exercises={availableExercises}
            onSelect={handleExerciseSelect}
          />
        </div>
      </Modal>
    </div>
  );
}
