import { api } from "@/shared/api";

export const deleteSession = async (sessionId: number) => {
  const response = await api.delete(`/api/sessions/${sessionId}`);
  return response.data;
};
