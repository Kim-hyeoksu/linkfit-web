export interface StartSessionRequest {
  planId: number;
  userId: number;
  sessionDate?: string; // YYYY-MM-DD
  memo?: string;
}
export interface SessionSet {
  id: number | null;
  sessionExerciseId: number;
  setOrder: number;
  targetReps?: number;
  targeWeight?: number;
  targetResetSeconds?: number;
  defaultReps?: number | null;
  defaultWeight?: number | null;
  defaultRestSeconds?: number | null;
  reps: number;
  weight: number;
  rpe?: number;
  restSeconds: number;
  status?: "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
}
