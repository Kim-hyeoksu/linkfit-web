// src/entities/plan/api/types.ts
export type PlanDetailDto = {
  id: number;
  userId: number;
  programId: number;
  programName: string;
  dayOrder: number;
  weekNumber: number;
  weekDay: number;
  title: string;
  createdAt: string; // ISO
  exerciseCount: number;
  totalVolume: number;
  exercises: PlanDetailExerciseDto[];
};

export type PlanDetailExerciseDto = {
  exerciseId: number;
  sessionExerciseId?: number;
  exerciseName: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
  defaultRestSeconds: number;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  targetRestSeconds: number;
  orderIndex: number;
  bodyPart: string;
  exerciseImagePath: string;
  sets: PlanDetailSetDto[];
};

export type PlanDetailSetDto = {
  id: number;
  sessionExerciseId?: number;
  setOrder: number;
  reps: number;
  weight: number;
  restSeconds: number;
  completedAt?: string;
};

export type PlanListItemResponse = {
  id: number;
  dayOrder: number;
  title: string;
  exerciseCount: number;
  totalVolume: number;
  programId: number;
  weekNumber: number;
};
export interface PlanListResponse {
  programId: number;
  programName: string | null;
  maxWeekNumber: number | null;
  plans: PlanListItemResponse[];
  lastExercisedPlanId: number | null;
}
