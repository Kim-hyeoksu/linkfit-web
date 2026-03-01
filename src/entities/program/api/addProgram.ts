import { api } from "@/shared/api";
import { Program, ProgramCreateRequest } from "@/entities/program";

export const addProgram = async (
  program: ProgramCreateRequest,
): Promise<Program> => {
  const { data } = await api.post<Program>("/api/programs", program);
  return data;
};
