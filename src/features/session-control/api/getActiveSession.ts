import { API_BASE_URL } from "@/shared/api/baseUrl";

type GetActiveSessionParams = {
  userId: number | string;
  planId: number | string;
};

export const getActiveSession = async ({
  userId,
  planId,
}: GetActiveSessionParams) => {
  const url = new URL(`${API_BASE_URL}/api/sessions/active`);
  url.searchParams.set("userId", String(userId));
  url.searchParams.set("planId", String(planId));

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
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
    const error: any = new Error(`세션 조회 실패: ${res.status}`);
    error.status = res.status;
    error.body = data;
    throw error;
  }

  return data;
};
