import { api } from "@/shared/api/axios";
import { DietRequest, DietResponse } from "../model/types";

/**
 * 식단 기록 수정
 */
export const updateDiet = async (dietId: number, data: Partial<DietRequest>): Promise<DietResponse> => {
  const response = await api.put(`/api/diets/${dietId}`, data);
  return response.data;
};
