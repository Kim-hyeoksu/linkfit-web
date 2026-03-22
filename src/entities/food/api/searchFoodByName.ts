import { api } from "@/shared/api";
import { Food } from "../model/types";

export const searchFoodByName = async (name: string): Promise<Food[]> => {
  try {
    const response = await api.get<Food[]>(`/api/foods/searchByName`, {
      params: { name },
    });
    return response.data;
  } catch (error) {
    console.error("Food search error:", error);
    throw error;
  }
};
