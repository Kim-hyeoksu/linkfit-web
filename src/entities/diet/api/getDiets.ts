import { api } from "@/shared/api/axios";
import { DietsByDateResponse } from "../model/types";

/**
 * 기간별 식단 기록 및 요약 조회
 */
export const getDiets = async (startDate: string, endDate: string): Promise<DietsByDateResponse> => {
  const response = await api.get(`/api/diets?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};
