import { API_BASE_URL } from "@/shared/api/baseUrl";

export const getSession = async (sessionId: number) => {
  const res = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  console.log("Response status:", data);
  if (!res.ok) {
    throw new Error(`프로그램 조회 실패: ${res.status}`);
  }

  return data;
};
