import { api } from "@/shared/api/axios";
import { UserGoal } from "../model/types";

/**
 * 유저 목표 목록 조회
 */
export const getGoals = async (): Promise<UserGoal[]> => {
  const response = await api.get("/api/users/me/goals");
  return response.data;
};
