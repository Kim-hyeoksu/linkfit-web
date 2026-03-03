import { api } from "@/shared/api/axios";
import { BodyMetric } from "../model/types";

/**
 * 가장 최근 신체 기록을 조회합니다.
 * @returns BodyMetric 객체 또는 null
 */
export const getLatestBodyMetric = async (): Promise<BodyMetric | null> => {
  try {
    const response = await api.get("/api/users/me/body-metrics/latest");
    return response.data as BodyMetric;
  } catch (error) {
    console.error("최근 신체 기록 조회 실패:", error);
    return null;
  }
};
