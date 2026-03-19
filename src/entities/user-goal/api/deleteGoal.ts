import { api } from "@/shared/api/axios";

/**
 * 유저 목표 삭제
 */
export const deleteGoal = async (goalId: number): Promise<void> => {
  await api.delete(`/api/users/me/goals/${goalId}`);
};
