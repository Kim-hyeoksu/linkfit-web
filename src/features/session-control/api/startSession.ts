import { StartSessionRequest } from "@/entities/session";
import { api } from "@/shared/api/axios";

export const startSession = async (body: StartSessionRequest) => {
  try {
    const { data } = await api.post("/api/sessions", body);
    return data;
  } catch (error: unknown) {
    const err = error as { response?: { status: number; data: unknown } };
    if (err.response) {
      const customError = new Error(
        `세션 생성 실패: ${err.response.status}`,
      ) as Error & { status?: number; body?: unknown };
      customError.status = err.response.status;
      customError.body = err.response.data;
      throw customError;
    }
    throw error;
  }
};
