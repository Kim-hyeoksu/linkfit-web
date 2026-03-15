import { api } from "@/shared/api/axios";
import { DietRequest, DietResponse } from "../model/types";

/**
 * 식단 기록 생성
 */
export const postDiet = async (data: DietRequest): Promise<DietResponse> => {
  const response = await api.post("/api/diets", data);
  return response.data;
};
