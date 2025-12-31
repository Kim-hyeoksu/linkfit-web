import { api } from "@/shared/api";
import { Program } from "@/entities/program";

export const addProgram = async (
  program: Omit<Program, "id">
): Promise<Program> => {
  const { data } = await api.post<Program>("/api/programs", program);
  return data;
};
