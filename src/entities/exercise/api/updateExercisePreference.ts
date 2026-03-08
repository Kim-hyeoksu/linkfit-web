import { api } from "@/shared/api/axios";

export interface UpdateExercisePreferenceRequest {
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetRestSeconds?: number;
}

export const updateExercisePreference = async (
  exerciseId: number,
  data: UpdateExercisePreferenceRequest,
) => {
  const response = await api.put(
    `/api/exercises/${exerciseId}/preferences`,
    data,
  );
  return response.data;
};
