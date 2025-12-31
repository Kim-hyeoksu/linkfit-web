import { api } from "@/shared/api";

type GetSessionsParams = {
  userId: number | string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  status?: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};

export const getSessions = async ({
  userId,
  from,
  to,
  status,
}: GetSessionsParams) => {
  const response = await api.get("/api/sessions", {
    params: { userId, from, to, status },
  });

  return response.data;
};
