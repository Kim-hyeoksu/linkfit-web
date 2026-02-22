import { StartSessionRequest } from "@/entities/session";
import { api } from "@/shared/api/axios";

export const startSession = async (body: StartSessionRequest) => {
  try {
    const { data } = await api.post("/api/sessions", body);
    return data;
  } catch (error: any) {
    if (error.response) {
      const customError: any = new Error(
        `세션 생성 실패: ${error.response.status}`,
      );
      customError.status = error.response.status;
      customError.body = error.response.data;
      throw customError;
    }
    throw error;
  }
};
