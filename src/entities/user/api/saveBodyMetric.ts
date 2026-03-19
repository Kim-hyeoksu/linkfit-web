import { api } from "@/shared/api/axios";
import { BodyMetric } from "../model/types";

export interface BodyMetricRequest {
  measuredDate: string; // YYYY-MM-DD
  height: number;
  weight: number;
  skeletalMuscleMass?: number;
  bodyFatPercentage?: number;
  bmr?: number;
  amr?: number;
}

/**
 * 신체 기록을 추가하거나 수정합니다.(당일 기록 덮어쓰기)
 * @param data 신체 기록 데이터
 * @returns 통신 성공 시 반환된 BodyMetric 객체, 실패 시 null
 */
export const saveBodyMetric = async (
  data: BodyMetricRequest,
): Promise<BodyMetric | null> => {
  try {
    const response = await api.post("/api/users/me/body-metrics", data);
    return response.data as BodyMetric;
  } catch (error) {
    console.error("신체 기록 저장 실패:", error);
    return null;
  }
};
