import { api } from "@/shared/api";
import { Exercise } from "../model/types";

export const getExerciseDetail = async (
  exerciseId: number,
): Promise<Exercise> => {
  const response = await api.get(`/api/exercises/${exerciseId}`);
  return response.data;
};
