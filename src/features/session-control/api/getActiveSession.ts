import { api } from "@/shared/api";

type GetActiveSessionParams = {
  userId: number | string;
  planId: number | string;
};

export const getActiveSession = async ({
  userId,
  planId,
}: GetActiveSessionParams) => {
  const response = await api.get("/api/sessions/active", {
    params: {
      userId,
      planId,
    },
  });

  return response.data;
};
