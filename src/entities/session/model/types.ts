export interface StartSessionRequest {
  planId: number;
  sessionDate?: string; // YYYY-MM-DD
  memo?: string;
}
export interface SessionSet {
  id: number;
  sessionExerciseId?: number;
  setOrder: number;
  targetReps?: number;
  targetWeight?: number;
  targetRestSeconds?: number;
  reps: number;
  weight: number;
  rpe?: number;
  restSeconds: number;
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
}

// src/entities/session/api/types.ts
export type ActiveSessionDto = {
  id: number;
  planId: number;
  programId: number;
  programName: string;
  userId: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  sessionDate: string; // YYYY-MM-DD
  startedAt?: string;
  endedAt?: string;
  totalDurationSeconds: number;
  memo: string | null;
  exercises: SessionExerciseDto[];
};

export type SessionExerciseDto = {
  sessionExerciseId: number;
  exerciseId: number;
  exerciseName: string;
  orderIndex: number;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  targetRestSeconds: number;
  bodyPart: string;
  exerciseImagePath: string;
  sets: SessionSetDto[];
};

export type SessionSetDto = {
  id: number;
  sessionExerciseId: number;
  setOrder: number;
  targetReps: number;
  targetWeight: number;
  targetRestSeconds: number;

  reps: number;
  weight: number;
  rpe: number;
  restSeconds: number;

  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  completedAt?: string;
};
