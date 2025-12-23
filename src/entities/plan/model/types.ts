import type { SessionSet } from "@/entities/session";

export interface PlanResponse {
  id: number;
  planId: number;
  programId: number | null;
  programName: string;
  userId: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  sessionDate: string; // ISO
  startedAt?: string; // ISO
  endedAt?: string; // ISO
  totalDurationSeconds: number;
  memo: string | null;
  exercises?: PlanExerciseItem[] | null; // 단건 조회 시 채워짐
}
export interface PlanExerciseItem {
  sessionExerciseId: number;
  exerciseId: number;
  exerciseName: string;
  defaultSets?: number | null;
  defaultReps?: number | null;
  defaultWeight?: number | null;
  defaultRestSeconds?: number | null;
  targetSets?: number | null;
  targetReps?: number | null;
  targetWeight?: number | null;
  targetRestSeconds?: number | null;
  orderIndex: number;
  sets: SessionSet[]; // 세트별 타깃 값
}

export interface PlanExerciseSetItem {
  id: number | null; // 템플릿 세트면 null일 수도 있음
  setOrder: number;
  reps: number | null;
  weight: number | null;
  restSeconds: number | null;
}
export interface PlanListResponse {
  programId: number;
  programName: string | null;
  maxWeekNumber: number | null;
  plans: PlanResponse[];
}
