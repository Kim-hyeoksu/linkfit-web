export interface PlanResponse {
  id: number;
  userId: number;
  programId: number | null;
  programName: string;
  dayOrder: number | null;
  weekNumber: number | null;
  weekDay: number | null;
  title: string;
  createdAt: string; // ISO
  exerciseCount: number;
  totalVolume: number;
  exercises?: PlanExerciseItem[] | null; // 단건 조회 시 채워짐
}
export interface PlanExerciseItem {
  exerciseId: number;
  exerciseName: string;
  defaultSets: number | null;
  defaultReps: number | null;
  defaultWeight: number | null;
  defaultRestSeconds: number | null;
  orderIndex: number;
  sets: PlanExerciseSetItem[]; // 세트별 타깃 값
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
