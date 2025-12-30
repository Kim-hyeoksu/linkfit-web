import { api } from "@/shared/api";

export const getExercises = async () => {
  const response = await api.get(`/api/exercises`);

  return response.data;
};
