export interface Exercise {
  id: number;
  name: string;
  nameEn: string;
  category: string;
  bodyPart: string;
  targetMuscles?: Record<string, number>;
  equipment: string;
  description: string;
  imagePath?: string;
  createdAt: string;
  isCustom?: boolean;
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetRestSeconds?: number;
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
  targetReps: number;
  targetWeight: number;
  targetSets: number;
  targetRestSeconds: number;
  restSeconds: number;
  bodyPart?: string;
  exerciseImagePath?: string;
  orderIndex?: number;
  reps?: number;
  weight?: number;
}

export interface SetRecord {
  setOrder: number;
  targetReps: number;
  targetWeight: number;
  actualReps: number;
  actualWeight: number;
  rpe?: number;
  status: "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
}

export interface ExerciseHistoryResponse {
  sessionDate: string;
  planTitle: string;
  programName: string | null;
  calculated1Rm: number;
  totalVolume: number;
  sets: SetRecord[];
}

export interface PageExerciseHistoryResponse {
  totalElements: number;
  totalPages: number;
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    offset: number;
    sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  };
  numberOfElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: ExerciseHistoryResponse[];
  number: number;
  sort: { sorted: boolean; unsorted: boolean; empty: boolean };
  empty: boolean;
}
