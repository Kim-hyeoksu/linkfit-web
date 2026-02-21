import { api } from "@/shared/api/axios";

export interface UpdateExercisePreferenceRequest {
  defaultSets?: number;
  defaultReps?: number;
  defaultWeight?: number;
  defaultRestSeconds?: number;
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
