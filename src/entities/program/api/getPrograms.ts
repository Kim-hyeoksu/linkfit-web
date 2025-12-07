import { Program } from "@/entities/program";
import { API_BASE_URL } from "@/shared/api/baseUrl";

export const getPrograms = async () => {
  const res = await fetch(`${API_BASE_URL}/api/programs/popular`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  console.log("Response status:", data);
  if (!res.ok) {
    throw new Error(`프로그램 조회 실패: ${res.status}`);
  }

  return data.content as Program[];
};
