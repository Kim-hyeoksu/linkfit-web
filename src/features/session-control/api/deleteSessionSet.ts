import { api } from "@/shared/api";

export const deleteSessionSet = async (sessionSetId: number | string) => {
  const response = await api.delete(`/api/sessions/sets/${sessionSetId}`);
  return response.data;
};
