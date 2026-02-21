export interface Exercise {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  bodyPart: string;
  equipment: string;
  description: string;
  createdAt: string;
  defaultSets?: number;
  defaultReps?: number;
  defaultWeight?: number;
  defaultRestSeconds?: number;
}

export interface ClientSet {
  id: number;
  sessionExerciseId: number;
  setOrder: number;
  reps: number;
  weight: number;
  restSeconds: number;
  targetReps: number;
  targetWeight: number;
  targetRestSeconds: number;
  completedAt?: string | null;
  status?: string;
  rpe?: number;
}

export interface ClientExercise {
  sessionExerciseId: number;
  exerciseId: number;
  exerciseName: string;
  sets: ClientSet[];
  defaultReps: number;
  defaultWeight: number;
  defaultSets: number;
  restSeconds: number;
  bodyPart?: string;
  exerciseImagePath?: string;
  orderIndex?: number;
  reps?: number;
  weight?: number;
}
