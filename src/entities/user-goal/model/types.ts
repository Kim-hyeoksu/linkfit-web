/**
 * 유저 목표 타입
 */
export type GoalType =
  | "WEIGHT_LOSS"
  | "BULK_UP"
  | "FITNESS_IMPROVEMENT"
  | "REHABILITATION"
  | "STRENGTH";

/**
 * 유저 목표 정보
 */
export interface UserGoal {
  id: number;
  goalType: GoalType;
  targetValue: number;
  targetText: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

/**
 * 유저 목표 생성/수정 요청
 */
export interface UserGoalRequest {
  goalType: GoalType;
  targetValue: number;
  targetText: string;
  startDate: string;
  endDate: string;
}
