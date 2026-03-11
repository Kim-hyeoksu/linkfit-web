import { api } from "@/shared/api";

export interface AddSessionExerciseRequest {
  sessionId: number;
  exerciseId: number;
  orderIndex: number;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  targetRestSeconds: number;
}

export const addSessionExercise = async (body: AddSessionExerciseRequest) => {
  const response = await api.post(`/api/sessions/exercises`, body);
  return response.data;
};
