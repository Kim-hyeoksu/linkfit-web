import { api } from "@/shared/api";

export const addSessionSet = async (body: any) => {
  const response = await api.post(`/api/sessions/sets`, body);

  return response.data;
};
