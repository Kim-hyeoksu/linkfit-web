import { api } from "@/shared/api/axios";

export const importProgram = async (programId: number, userId: number) => {
  const res = await api.post(
    `/api/programs/${programId}/import?userId=${userId}`,
  );
  return res.data;
};
