import { api } from "@/shared/api";

export const completeSession = async (sessionId: number, body: any) => {
  const response = await api.patch(`/api/sessions/${sessionId}/complete`, body);

  return response.data;
};
