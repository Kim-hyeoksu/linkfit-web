import { API_BASE_URL } from "@/shared/api/baseUrl";

export const getActiveSessionServer = async (
  userId: number | string,
  planId: number | string
) => {
  const url = `${API_BASE_URL}/api/sessions/active?userId=${userId}&planId=${planId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    return null; // 활성 세션 없음
  }

  if (!res.ok) {
    throw new Error(`getActiveSession failed: ${res.status}`);
  }

  return res.json();
};
