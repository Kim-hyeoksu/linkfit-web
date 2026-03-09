import { api } from "@/shared/api";

export const updateSessionSet = async (
  sessionSetId: number | string,
  body: Record<string, unknown>,
) => {
  const response = await api.patch(`/api/sessions/sets/${sessionSetId}`, body);

  return response.data;
};
