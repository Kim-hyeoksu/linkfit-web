// 각 일차 정보
export type WorkoutDay = {
  id: string;
  dayNumber: number; // 몇 번째 날인지
  exercisesCount: number; // 운동 종목 개수
  totalVolumeKg: number; // 총 볼륨
  completed: boolean; // 완료 여부
  representativeExercise: string; // 대표 운동 이름
};

// 주차 정보
export type WorkoutWeek = {
  week: number;
  days: WorkoutDay[];
};

// 프로그램 정보
export type WorkoutProgram = {
  id: string; // 프로그램 id
  name: string; // 프로그램 이름
  weeks: WorkoutWeek[];
};
