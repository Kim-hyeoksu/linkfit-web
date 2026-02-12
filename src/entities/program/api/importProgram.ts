import { api } from "@/shared/api/axios";

export const importProgram = async (programId: number) => {
  const res = await api.post(`/programs/${programId}/import`);
  return res.data;
};
