import { api } from "@/shared/api";

/**
 * 특정 근육의 운동 세션 이력 조회 파라미터
 */
type GetMuscleSessionsParams = {
  muscleName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
};

/**
 * 근육 세션 내 개별 운동 정보
 */
export interface MuscleSessionExercise {
  exerciseName: string;
  muscleRole: string;
  contributionRatio: number;
  volume: number;
}

/**
 * 특정 근육과 관련된 세션 정보
 */
export interface MuscleSession {
  sessionId: number;
  sessionDate: string;
  totalVolume: number;
  totalScore: number;
  exercises: MuscleSessionExercise[];
}

/**
 * 특정 근육의 운동 세션 이력을 조회합니다.
 * GET /api/statistics/muscle-sessions
 */
export const getMuscleSessions = async ({
  muscleName,
  startDate,
  endDate,
}: GetMuscleSessionsParams) => {
  const response = await api.get<MuscleSession[]>(
    "/api/statistics/muscle-sessions",
    {
      params: { muscleName, startDate, endDate },
    },
  );

  return response.data;
};
