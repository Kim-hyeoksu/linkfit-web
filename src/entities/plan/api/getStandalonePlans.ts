import { API_BASE_URL } from "@/shared/api/baseUrl";
import { PlanListItemResponse } from "../model/types";

export const getStandalonePlans = async (): Promise<PlanListItemResponse[]> => {
  const res = await fetch(`${API_BASE_URL}/api/plans/standalone`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // 최신 상태 유지
  });

  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`플랜 조회 실패: ${res.status}`);
  }

  const data = await res.json();
  return data.content || [];
};
