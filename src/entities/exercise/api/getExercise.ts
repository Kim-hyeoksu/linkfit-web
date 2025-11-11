import { Exercise } from "@/entities/exercise";
import { API_BASE_URL } from "@/shared/api/baseUrl";

export const getExercise = async (
  workoutdayId: string
): Promise<Exercise[]> => {
  const res = await fetch(`${API_BASE_URL}/api/exercises/${workoutdayId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`프로그램 조회 실패: ${res.status}`);
  }

  return res.json();
};
