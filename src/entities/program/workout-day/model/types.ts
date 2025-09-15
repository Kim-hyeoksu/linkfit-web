export type WorkoutDay = {
  id: number;
  dayNumber: number; // 몇 번째 날인지
  exercisesCount: number; // 운동 종목 개수
  totalVolumeKg: number; // 총 볼륨
  completed: boolean; // 완료 여부
  representativeExercise: string; // 대표 운동 이름
};
