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
  reps: number;
  weight: number;
  restSeconds: number;
}

export interface ProgramPlanExerciseCreateRequest {
  exerciseId: number;
  orderIndex: number;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number;
  defaultRestSeconds: number;
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
