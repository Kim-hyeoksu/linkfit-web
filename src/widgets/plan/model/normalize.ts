import type { PlanDetailDto, PlanDetailExerciseDto } from "@/entities/plan";
import type { ActiveSessionDto, SessionExerciseDto } from "@/entities/session";
import type { ClientExercise } from "@/entities/exercise";

export const normalizeExercises = (
  plan: PlanDetailDto | ActiveSessionDto | null,
): ClientExercise[] => {
  if (!plan?.exercises || !Array.isArray(plan.exercises)) return [];

  return plan.exercises.map(
    (exercise: PlanDetailExerciseDto | SessionExerciseDto) => {
      const isSessionMode = "sessionExerciseId" in exercise;
      const sessionExerciseId = isSessionMode
        ? (exercise as SessionExerciseDto).sessionExerciseId
        : (exercise as PlanDetailExerciseDto).exerciseId;

      return {
        sessionExerciseId,
        exerciseId: (exercise as any).exerciseId, // Common field
        exerciseName: exercise.exerciseName,
        bodyPart: exercise.bodyPart,
        exerciseImagePath: exercise.exerciseImagePath,
        restSeconds:
          exercise.targetRestSeconds ??
          (exercise as any).targetRestSeconds ??
          0,
        orderIndex: exercise.orderIndex,
        reps: exercise.targetReps ?? 0,
        weight: exercise.targetWeight ?? 0,
        targetReps: exercise.targetReps ?? 0,
        targetSets: exercise.targetSets ?? 0,
        targetWeight: exercise.targetWeight ?? 0,
        sets: exercise.sets.map((set: any, index: number) => ({
          id: set.id ?? -(Date.now() + index),
          sessionExerciseId,
          setOrder: set.setOrder ?? index + 1,
          reps: set.reps ?? set.targetReps ?? 0,
          weight: set.weight ?? set.targetWeight ?? 0,
          restSeconds: set.restSeconds ?? set.targetRestSeconds ?? 0,
          targetReps: set.targetReps ?? 0,
          targetWeight: set.targetWeight ?? 0,
          targetRestSeconds: set.targetRestSeconds ?? 0,
          completedAt: set.completedAt ?? null,
          status: set.status ?? "PENDING",
          rpe: set.rpe,
        })),
      };
    },
  );
};
