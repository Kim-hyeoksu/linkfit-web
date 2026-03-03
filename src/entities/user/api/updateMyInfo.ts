import { api } from "@/shared/api/axios";
import { User } from "../model/types";

export interface UpdateUserRequest {
  name?: string;
  birthDate?: string;
  gender?: "MALE" | "FEMALE";
  exerciseLevel?: "LOW" | "MIDDLE" | "HIGH";
  profileImage?: string;
}

/**
 * 내 정보를 수정합니다.
 * @param data UpdateUserRequest 객체
 * @returns 수정된 User 객체 또는 null
 */
export const updateMyInfo = async (
  data: UpdateUserRequest,
): Promise<User | null> => {
  try {
    const response = await api.patch("/api/users/me", data);
    return response.data as User;
  } catch (error) {
    console.error("내 정보 수정 실패:", error);
    return null;
  }
};
