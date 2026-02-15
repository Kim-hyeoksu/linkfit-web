import { api } from "@/shared/api/axios";

export const getActiveSessionServer = async (
  userId: number | string,
  planId: number | string,
) => {
  const url = `/api/sessions/active?userId=${userId}&planId=${planId}`;

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return null; // 활성 세션 없음
    }
    console.error("❌ [getActiveSessionServer] 요청 실패:", error);
    throw error;
  }
};
