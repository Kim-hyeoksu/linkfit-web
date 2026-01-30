import { api } from "@/shared/api";
import { PlanDetailDto } from "../model/types";

interface UpdatePlanParams {
  planId: number;
  plan: Partial<PlanDetailDto>;
}

export const updatePlan = async ({ planId, plan }) => {
  const response = await api.put<PlanDetailDto>(`/api/plans/${planId}`, plan);
  return response.data;
};
