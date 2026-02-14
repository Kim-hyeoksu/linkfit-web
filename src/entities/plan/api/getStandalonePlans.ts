import { api } from "@/shared/api/axios";
import { PlanListItemResponse } from "../model/types";

export const getStandalonePlans = async (): Promise<PlanListItemResponse[]> => {
  try {
    const response = await api.get("/api/plans/standalone");
    return response.data.content || [];
  } catch (error) {
    console.error("플랜 조회 실패:", error);
    return [];
  }
};
