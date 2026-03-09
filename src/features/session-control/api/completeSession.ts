import { api } from "@/shared/api";

export const completeSession = async (
  sessionId: number,
  body: Record<string, unknown>,
) => {
  const response = await api.patch(`/api/sessions/${sessionId}/complete`, body);

  return response.data;
};
