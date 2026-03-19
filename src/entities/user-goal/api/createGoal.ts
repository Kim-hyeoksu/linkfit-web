import { api } from "@/shared/api/axios";
import { UserGoal, UserGoalRequest } from "../model/types";

/**
 * 유저 목표 추가
 */
export const createGoal = async (data: UserGoalRequest): Promise<UserGoal> => {
  const response = await api.post("/api/users/me/goals", data);
  return response.data;
};
