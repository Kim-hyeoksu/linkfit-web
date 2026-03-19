import { api } from "@/shared/api/axios";
import { DietRequest, DietResponse } from "../model/types";

/**
 * 식단 기록 생성
 */
export const createDiet = async (data: DietRequest): Promise<number> => {
  const response = await api.post("/api/diets", data);
  return response.data;
};
