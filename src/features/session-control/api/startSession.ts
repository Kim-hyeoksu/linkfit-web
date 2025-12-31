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
  const parseResponse = async () => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  };

  const data = await parseResponse();

  if (!res.ok) {
    const error: any = new Error(`세션 생성 실패: ${res.status}`);
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data;
};
