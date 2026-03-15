import { api } from "@/shared/api/axios";

/**
 * 식단 기록 삭제
 */
export const deleteDiet = async (dietId: number): Promise<void> => {
  await api.delete(`/api/diets/${dietId}`);
};
