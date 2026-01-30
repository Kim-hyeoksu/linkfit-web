import type { PlanDetailDto, PlanDetailExerciseDto } from "@/entities/plan";
import type { ActiveSessionDto, SessionExerciseDto } from "@/entities/session";
import type { ClientExercise } from "@/entities/exercise";

export const normalizeExercises = (
  plan: PlanDetailDto | ActiveSessionDto | null
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
          exercise.targetRestSeconds ?? (exercise as any).defaultRestSeconds ?? 0,
        orderIndex: exercise.orderIndex,
        reps: exercise.targetReps ?? (exercise as any).defaultReps,
        weight: exercise.targetWeight ?? (exercise as any).defaultWeight,
        defaultReps: exercise.targetReps ?? (exercise as any).defaultReps ?? 0,
        defaultSets: exercise.targetSets ?? (exercise as any).defaultSets ?? 0,
        defaultWeight:
          exercise.targetWeight ?? (exercise as any).defaultWeight ?? 0,
        sets: exercise.sets.map((set: any, index: number) => ({
          id: set.id ?? -(Date.now() + index),
          sessionExerciseId,
          setOrder: set.setOrder ?? index + 1,
          reps: set.reps ?? 0,
          weight: set.weight ?? 0,
          restSeconds:
            set.restSeconds ??
            set.defaultRestSeconds ??
            set.targetRestSeconds ??
            0,
          targetReps: set.targetReps ?? set.defaultReps ?? 0,
          targetWeight: set.targetWeight ?? set.defaultWeight ?? 0,
          targetRestSeconds:
            set.targetRestSeconds ?? set.defaultRestSeconds ?? 0,
          completedAt: set.completedAt ?? null,
          status: set.status ?? "PENDING",
          rpe: set.rpe,
        })),
      };
    }
  );
};
