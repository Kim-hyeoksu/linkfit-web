import { api } from "@/shared/api/axios";
import { User } from "../model/types";

/**
 * 내 정보를 조회합니다.
 * @returns User 객체 또는 null
 */
export const getUserMe = async (): Promise<User | null> => {
  try {
    const response = await api.get("/api/users/me");
    return response.data as User;
  } catch (error) {
    console.error("내 정보 조회 실패:", error);
    return null;
  }
};
