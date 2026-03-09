import { useState } from "react";
import { updatePlan, type PlanDetailDto } from "@/entities/plan";
import type { ClientExercise } from "@/entities/exercise";
import type { ActiveSessionDto } from "@/entities/session";

export const usePlanLogic = (
  initialPlanDetail: PlanDetailDto | ActiveSessionDto,
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

  return {
    isEditing,
    isUpdating,
    handleUpdatePlan,
    toggleEditMode,
    setIsEditing,
  };
};
