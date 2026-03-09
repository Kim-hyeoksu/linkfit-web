import { api } from "@/shared/api";
import { PlanDetailDto } from "../model/types";

export const updatePlan = async ({
  planId,
  plan,
}: {
  planId: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan: any;
}) => {
  const response = await api.put<PlanDetailDto>(`/api/plans/${planId}`, plan);
  return response.data;
};
