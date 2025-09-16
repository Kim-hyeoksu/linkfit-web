import { Program } from "@/entities/program/model/types";
import { API_BASE_URL } from "@/shared/api/baseUrl";

export const getPrograms = async (): Promise<Program[]> => {
  console.log(`${API_BASE_URL}/api/programs`);
  const res = await fetch(`${API_BASE_URL}/api/programs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`프로그램 조회 실패: ${res.status}`);
  }

  return res.json();
};
