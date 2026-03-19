import { api } from "@/shared/api/axios";
import { UserGoal, UserGoalRequest } from "../model/types";

/**
 * 유저 목표 수정
 */
export const updateGoal = async (
  goalId: number,
  data: UserGoalRequest
): Promise<UserGoal> => {
  const response = await api.put(`/api/users/me/goals/${goalId}`, data);
  return response.data;
};
