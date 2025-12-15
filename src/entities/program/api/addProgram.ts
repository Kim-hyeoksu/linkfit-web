import { Program } from "@/entities/program";

export const addProgram = async (
  program: Omit<Program, "id">
): Promise<Program> => {
  const res = await fetch("/api/programs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(program),
  });

  if (!res.ok) {
    throw new Error(`프로그램 추가 실패: ${res.status}`);
  }

  return res.json();
};
