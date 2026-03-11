import { useState } from "react";
import { updatePlan, type PlanDetailDto } from "@/entities/plan";
import type { ClientExercise, ClientSet, Exercise } from "@/entities/exercise";
import type { ActiveSessionDto } from "@/entities/session";

export const usePlanLogic = (
  initialPlanDetail: PlanDetailDto | ActiveSessionDto,
  setExercises: React.Dispatch<React.SetStateAction<ClientExercise[]>>,
) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdatePlan = async (exercises: ClientExercise[]) => {
    setIsUpdating(true);
    try {
      // PlanDetailDto 타입인지 확인 (간단한 체크)
      const planDetail = initialPlanDetail as PlanDetailDto;

      const planUpdatePayload = {
        title: planDetail.title,
        dayOrder: planDetail.dayOrder,
        weekNumber: planDetail.weekNumber,
        weekDay: planDetail.weekDay,
        exercises: exercises.map((exercise, index) => ({
          exerciseId: exercise.exerciseId,
          orderIndex: exercise.orderIndex ?? index,
          targetReps: exercise.targetReps || 0,
          targetSets: exercise.sets.length,
          targetWeight: exercise.targetWeight || 0,
          targetRestSeconds: exercise.targetRestSeconds || 60,
          sets: exercise.sets.map((set) => ({
            setOrder: set.setOrder,
            targetReps: set.reps || set.targetReps || 0,
            targetWeight: set.weight || set.targetWeight || 0,
            targetRestSeconds: set.restSeconds || set.targetRestSeconds || 0,
          })),
        })),
      };

      await updatePlan({
        planId: planDetail.id,
        plan: planUpdatePayload,
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update plan:", error);
      alert("플랜 수정에 실패했습니다.");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  // 플랜 모드: 운동 추가 (로컬 상태만 업데이트)
  const handleAddExerciseToPlan = (
    exercise: Exercise,
    currentExercisesLength: number,
  ) => {
    const tempSessionExerciseId = -(
      Date.now() + Math.floor(Math.random() * 1000)
    );

    const targetSets = exercise.targetSets || 3;
    const targetReps = exercise.targetReps || 10;
    const targetWeight = exercise.targetWeight || 0;
    const targetRestSeconds = exercise.targetRestSeconds || 60;

    const newClientExercise: ClientExercise = {
      sessionExerciseId: tempSessionExerciseId,
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      bodyPart: exercise.bodyPart,
      targetSets,
      targetReps,
      targetWeight,
      restSeconds: targetRestSeconds,
      orderIndex: currentExercisesLength,
      sets: [],
    };

    const initialSets: ClientSet[] = Array.from(
      { length: targetSets },
      (_, i) => ({
        id: -(Date.now() + i + Math.floor(Math.random() * 1000)),
        sessionExerciseId: tempSessionExerciseId,
        setOrder: i + 1,
        reps: targetReps,
        weight: targetWeight,
        restSeconds: targetRestSeconds,
        targetReps,
        targetWeight,
        targetRestSeconds,
        status: "IN_PROGRESS",
      }),
    );

    newClientExercise.sets = initialSets;
    setExercises((prev) => [...prev, newClientExercise]);
  };

  // 플랜 모드: 세트 추가 (로컬 상태만 업데이트)
  const handleAddSetToPlan = (exerciseId: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.sessionExerciseId !== exerciseId) return ex;

        const lastSet = ex.sets[ex.sets.length - 1];
        const newSetOrder = ex.sets.length + 1;
        const targetReps = lastSet?.targetReps ?? ex.targetReps ?? 0;
        const targetWeight = lastSet?.targetWeight ?? ex.targetWeight ?? 0;
        const targetRestSeconds = ex.restSeconds ?? 60;

        const newSet: ClientSet = {
          id: -(Date.now() + Math.floor(Math.random() * 1000)),
          sessionExerciseId: ex.sessionExerciseId,
          setOrder: newSetOrder,
          reps: targetReps,
          weight: targetWeight,
          restSeconds: targetRestSeconds,
          targetReps,
          targetWeight,
          targetRestSeconds,
          status: "IN_PROGRESS",
        };

        return {
          ...ex,
          sets: [...ex.sets, newSet],
        };
      }),
    );
  };

  // 플랜 모드: 세트 삭제 (로컬 상태만 업데이트)
  const handleDeleteSetFromPlan = (
    exerciseId: number | string,
    setId: number | string,
  ) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.sessionExerciseId !== exerciseId) return exercise;
        return {
          ...exercise,
          sets: exercise.sets.filter((set) => set.id !== setId),
        };
      }),
    );
  };

  return {
    isEditing,
    isUpdating,
    handleUpdatePlan,
    toggleEditMode,
    setIsEditing,
    handleAddExerciseToPlan,
    handleAddSetToPlan,
    handleDeleteSetFromPlan,
  };
};
