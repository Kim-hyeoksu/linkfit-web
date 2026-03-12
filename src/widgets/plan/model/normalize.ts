import type { PlanDetailDto, PlanDetailExerciseDto } from "@/entities/plan";
import type { ActiveSessionDto, SessionExerciseDto } from "@/entities/session";
import type { ClientExercise } from "@/entities/exercise";

export const normalizeExercises = (
  plan: PlanDetailDto | ActiveSessionDto | null,
): ClientExercise[] => {
  if (!plan?.exercises || !Array.isArray(plan.exercises)) return [];

  return plan.exercises
    .map((exercise: PlanDetailExerciseDto | SessionExerciseDto, index) => {
      const isSessionMode = "sessionExerciseId" in exercise;
      const sessionExerciseId =
        isSessionMode && (exercise as SessionExerciseDto).sessionExerciseId
          ? (exercise as SessionExerciseDto).sessionExerciseId
          : (exercise as PlanDetailExerciseDto).exerciseId * 10000 + index;

      return {
        sessionExerciseId,
        exerciseId: (exercise as { exerciseId: number }).exerciseId, // Common field
        exerciseName: exercise.exerciseName,
        bodyPart: exercise.bodyPart,
        exerciseImagePath: exercise.exerciseImagePath,
        restSeconds:
          exercise.targetRestSeconds ??
          (exercise as { targetRestSeconds?: number }).targetRestSeconds ??
          0,
        orderIndex: exercise.orderIndex,
        reps: exercise.targetReps ?? 0,
        weight: exercise.targetWeight ?? 0,
        targetReps: exercise.targetReps ?? 0,
        targetSets: exercise.targetSets ?? 0,
        targetWeight: exercise.targetWeight ?? 0,
        targetRestSeconds:
          exercise.targetRestSeconds ??
          (exercise as { targetRestSeconds?: number }).targetRestSeconds ??
          0,
        sets: exercise.sets.map(
          (s: Record<string, unknown>, index: number) => ({
            id: (s.id as number) ?? -(Date.now() + index),
            sessionExerciseId,
            setOrder: (s.setOrder as number) ?? index + 1,
            reps: (s.reps as number) ?? (s.targetReps as number) ?? 0,
            weight: (s.weight as number) ?? (s.targetWeight as number) ?? 0,
            restSeconds:
              (s.restSeconds as number) ?? (s.targetRestSeconds as number) ?? 0,
            targetReps: (s.targetReps as number) ?? 0,
            targetWeight: (s.targetWeight as number) ?? 0,
            targetRestSeconds: (s.targetRestSeconds as number) ?? 0,
            completedAt: (s.completedAt as string) ?? null,
            status: (s.status as string) ?? "PENDING",
            rpe: s.rpe as number | undefined,
          }),
        ),
      };
    })
    .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
};
