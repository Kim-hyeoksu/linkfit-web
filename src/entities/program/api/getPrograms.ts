import { Program } from "@/entities/program";
import { api } from "@/shared/api/axios";

export const getPrograms = async ({
  page = 0,
  size = 10,
}: { page?: number; size?: number } = {}) => {
  try {
    const response = await api.get("/api/programs/popular", {
      params: { page, size },
    });
    return (response.data.content || []) as Program[];
  } catch (error) {
    console.error("프로그램 조회 실패:", error);
    return [];
  }
};
