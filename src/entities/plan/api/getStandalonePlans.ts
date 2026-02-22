import { api } from "@/shared/api/axios";
import { PlanListItemResponse } from "../model/types";

export const getStandalonePlans = async ({
  page = 0,
  size = 10,
}: { page?: number; size?: number } = {}): Promise<PlanListItemResponse[]> => {
  try {
    const response = await api.get("/api/plans/standalone", {
      params: { page, size },
    });
    return response.data.content || [];
  } catch (error) {
    console.error("플랜 조회 실패:", error);
    return [];
  }
};
