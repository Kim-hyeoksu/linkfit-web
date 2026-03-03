import { api } from "@/shared/api/axios";
import { BodyMetric } from "../model/types";

/**
 * 내 신체 기록 목록을 조회합니다.
 * @returns BodyMetric 배열 또는 null
 */
export const getBodyMetrics = async (): Promise<BodyMetric[] | null> => {
  try {
    const response = await api.get("/api/users/me/body-metrics");
    return response.data as BodyMetric[];
  } catch (error) {
    console.error("신체 기록 목록 조회 실패:", error);
    return null;
  }
};
