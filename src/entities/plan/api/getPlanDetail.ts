import { api } from "@/shared/api/axios";

export const getPlanDetail = async (planId: string) => {
  console.log("🚀 [getPlanDetail] 요청 URL:", `/api/plans/${planId}`);

  try {
    const response = await api.get(`/api/plans/${planId}`);
    console.log("✅ [getPlanDetail] 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [getPlanDetail] 요청 실패:", error);
    throw error;
  }
};
