import { api } from "@/shared/api";
import { FoodSearchResponse } from "../model/types";

export const searchFoodByName = async (
  keyword: string,
  page: number = 0,
  size: number = 20
): Promise<FoodSearchResponse> => {
  try {
    const response = await api.get<FoodSearchResponse>(`/api/foods/search/name`, {
      params: { keyword, page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Food search error:", error);
    throw error;
  }
};
