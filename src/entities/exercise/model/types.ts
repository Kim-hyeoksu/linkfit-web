export interface ExerciseSet {
  id: number;
  weight: number;
  reps: number;
  isComplete?: boolean;
}

// 운동 정보 타입
export interface Exercise {
  id: number;
  name: string;
  restSeconds: number;
  sets: ExerciseSet[];
}
