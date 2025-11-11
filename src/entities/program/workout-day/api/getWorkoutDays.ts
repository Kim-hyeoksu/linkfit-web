import { WorkoutDay } from "@/entities/program/workout-day";
import { API_BASE_URL } from "@/shared/api/baseUrl";
// export const getWorkoutDays = async (id: number): Promise<WorkoutDay[]> => {
//   console.log(`${API_BASE_URL}/api/programs/${id}`);
//   const res = await fetch(`${API_BASE_URL}/api/programs/${id}`, {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!res.ok) {
//     throw new Error(`프로그램 조회 실패: ${res.status}`);
//   }

//   return res.json();
// };
export const getWorkoutDays = async (id: number): Promise<WorkoutDay[]> => {
  const url = `${API_BASE_URL}/api/programs/${id}`;
  console.log("🚀 [getWorkoutDays] 요청 URL:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log("📡 [getWorkoutDays] 응답 status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ [getWorkoutDays] 실패 응답:", text);
    throw new Error(`프로그램 조회 실패: ${res.status}`);
  }

  const data = await res.json();
  console.log("✅ [getWorkoutDays] 응답 데이터:", data);

  return data;
};
