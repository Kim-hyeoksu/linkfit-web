import { api } from "@/shared/api/axios";

export const getSession = async (sessionId: number) => {
  const { data } = await api.get(`/api/sessions/${sessionId}`);
  return data;
};
