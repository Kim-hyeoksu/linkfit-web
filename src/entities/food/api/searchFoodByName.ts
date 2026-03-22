import { api } from "@/shared/api";
import { FoodSearchResponse } from "../model/types";

export const searchFoodByName = async (keyword: string): Promise<FoodSearchResponse> => {
  try {
    const response = await api.get<FoodSearchResponse>(`/api/foods/search/name`, {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Food search error:", error);
    throw error;
  }
};
