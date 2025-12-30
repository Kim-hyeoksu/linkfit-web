import { api } from "@/shared/api";
import { Exercise } from "../model/types";

export const getExercises = async (): Promise<Exercise[]> => {
  const response = await api.get(`/api/exercises`);
  const data = response.data;

  // API 응답 구조에 따라 배열 처리 (직접 배열이거나 content 속성에 배열이 있는 경우)
  if (Array.isArray(data)) {
    return data;
  }

  return data?.content || [];
};
