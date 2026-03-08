import { useState } from "react";
import { updatePlan, type PlanDetailDto } from "@/entities/plan";
import type { ClientExercise } from "@/entities/exercise";

export const usePlanLogic = (initialPlanDetail: PlanDetailDto | any) => {
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
          targetSets: exercise.targetSets || 0,
          targetWeight: exercise.targetWeight || 0,
          sets: exercise.sets.map((set) => ({
            setOrder: set.setOrder,
            targetReps: set.targetReps ?? set.reps,
            targetWeight: set.targetWeight ?? set.weight,
            targetRestSeconds: set.targetRestSeconds ?? set.restSeconds,
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

  return {
    isEditing,
    isUpdating,
    handleUpdatePlan,
    toggleEditMode,
    setIsEditing,
  };
};
