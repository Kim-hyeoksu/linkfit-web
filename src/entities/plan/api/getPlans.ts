import { api } from "@/shared/api/axios";

export const getPlans = async (id: number) => {
  const url = `/api/plans?programId=${id}&page=0&size=50&sort=createdAt`;
  console.log("🚀 [getPlans] 요청 URL:", url);

  try {
    const response = await api.get(url);
    console.log("✅ [getPlans] 응답 데이터:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ [getPlans] 실패:", error);
    throw error;
  }
};
