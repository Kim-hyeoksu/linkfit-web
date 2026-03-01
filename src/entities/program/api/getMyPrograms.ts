import { Program } from "@/entities/program";
import { api } from "@/shared/api/axios";

/**
 * 내가 생성한 운동 프로그램을 조회합니다.
 */
export const getMyPrograms = async ({
  page = 0,
  size = 10,
}: { page?: number; size?: number } = {}) => {
  try {
    const response = await api.get("/api/programs/my", {
      params: { page, size },
    });
    return {
      content: (response.data.content || []) as Program[],
      last: response.data.last ?? true,
    };
  } catch (error) {
    console.error("나의 프로그램 조회 실패:", error);
    return { content: [], last: true };
  }
};
