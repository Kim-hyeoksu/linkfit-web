export interface Program {
  id: number;
  programName: string;
  period: string;
  level: "beginner" | "intermediate" | "advanced";
  dayNumber: number;
  likeCount: number;
}

export interface ProgramPlanSetCreateRequest {
  setOrder: number;
  targetReps: number;
  targetWeight: number;
  targetRestSeconds: number;
}

export interface ProgramPlanExerciseCreateRequest {
  exerciseId: number;
  orderIndex: number;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  targetRestSeconds: number;
  sets: ProgramPlanSetCreateRequest[];
}

export interface ProgramPlanCreateRequest {
  title: string;
  dayOrder: number;
  weekNumber: number;
  description: string;
  exercises: ProgramPlanExerciseCreateRequest[];
}

export interface ProgramCreateRequest {
  categoryId: number;
  programName: string;
  description: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "";
  programType: "PERSONAL";
  status: "DRAFT";
  plans: ProgramPlanCreateRequest[];
}
