import { api } from "@/shared/api";

/**
 * 세션 운동 삭제 API
 * @param sessionExerciseId 삭제할 세션 운동 ID
 * @returns 업데이트된 세션 정보 (WorkoutSessionResponse)
 */
export const deleteSessionExercise = async (sessionExerciseId: number) => {
  const response = await api.delete(
    `/api/sessions/exercises/${sessionExerciseId}`,
  );
  return response.data;
};
