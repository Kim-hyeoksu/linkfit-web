import { Program } from "@/entities/program/model/types";

export const mockPrograms: Program[] = [
  {
    id: 1,
    title: "초급자용 프로그램",
    period: "5주(30일)",
    level: "beginner",
    dayNumber: 2,
  },
  {
    id: 2,
    title: "중급자용 프로그램",
    period: "5주(30일)",
    level: "intermediate",
    dayNumber: 3,
  },
];

export const mockWorkout = [
  {
    id: 1,
    name: "스쿼트",
    restSeconds: 60,
    sets: [
      { id: 101, weight: 120, reps: 12 },
      { id: 102, weight: 120, reps: 12 },
      { id: 103, weight: 120, reps: 12 },
    ],
  },
  {
    id: 2,
    name: "벤치프레스",
    restSeconds: 90,
    sets: [
      { id: 201, weight: 80, reps: 10 },
      { id: 202, weight: 80, reps: 10 },
    ],
  },
  {
    id: 3,
    name: "데드리프트",
    restSeconds: 120,
    sets: [
      { id: 301, weight: 120, reps: 12 },
      { id: 302, weight: 120, reps: 12 },
      { id: 303, weight: 120, reps: 12 },
    ],
  },
  {
    id: 4,
    name: "플라이",
    restSeconds: 50,
    sets: [
      { id: 401, weight: 120, reps: 12 },
      { id: 402, weight: 120, reps: 12 },
      { id: 403, weight: 120, reps: 12 },
      { id: 404, weight: 120, reps: 12 },
      { id: 405, weight: 120, reps: 12 },
    ],
  },
  {
    id: 5,
    name: "레그 익스텐션",
    restSeconds: 40,
    sets: [
      { id: 501, weight: 120, reps: 12 },
      { id: 502, weight: 120, reps: 12 },
      { id: 503, weight: 120, reps: 12 },
    ],
  },
];

export const mockWorkoutDay = [
  {
    id: "1",
    name: "5주 근력 프로그램",
    weeks: [
      {
        week: 1,
        days: [
          {
            dayNumber: 1,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 2,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 3,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 4,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 5,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 6,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
        ],
      },
      {
        week: 2,
        days: [
          {
            dayNumber: 1,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 2,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 3,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 4,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 5,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 6,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
        ],
      },
      {
        week: 3,
        days: [
          {
            dayNumber: 1,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 2,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 3,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 4,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 5,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 6,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
        ],
      },
      {
        week: 4,
        days: [
          {
            dayNumber: 1,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 2,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 3,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 4,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 5,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 6,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
        ],
      },
      {
        week: 5,
        days: [
          {
            dayNumber: 1,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 2,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 3,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 4,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 5,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
          {
            dayNumber: 6,
            exercisesCount: 3,
            totalVolumeKg: 25670,
            completed: true,
            representativeExercise: "데드리프트",
          },
        ],
      },
    ],
  },
];
