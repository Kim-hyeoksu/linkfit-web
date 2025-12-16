import { StartSessionRequest } from "@/entities/session";
import { API_BASE_URL } from "@/shared/api/baseUrl";

export const startSession = async (body: StartSessionRequest) => {
  const res = await fetch(`${API_BASE_URL}/api/sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  console.log("Response status:", data);
  if (!res.ok) {
    throw new Error(`프로그램 조회 실패: ${res.status}`);
  }

  return data;
};
