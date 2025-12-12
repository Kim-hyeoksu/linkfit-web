import { API_BASE_URL } from "@/shared/api/baseUrl";

export const getPlanDetail = async (planId: string) => {
  const res = await fetch(`${API_BASE_URL}/api/plans/${planId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`프로그램 조회 실패: ${res.status}`);
  }
  const data = await res.json();
  console.log("✅ [getPlanDetail] 응답 데이터:", data);

  return data;
};
