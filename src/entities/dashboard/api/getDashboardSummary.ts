import { api } from "@/shared/api";
import { DashboardSummary } from "../model/types";

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get(`/api/dashboard/summary`);
  return response.data;
};
