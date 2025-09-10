// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { Program } from "@/entities/program/model/types";

const mockPrograms: Program[] = [
  {
    id: 1,
    title: "초급자용 프로그램",
    description: "처음 운동하는 사람들을 위한 프로그램입니다.",
    level: "beginner",
  },
  {
    id: 2,
    title: "중급자용 프로그램",
    description: "운동을 꾸준히 해온 사람들을 위한 프로그램입니다.",
    level: "intermediate",
  },
];
export const handlers = [
  http.get("/api/exercises/:routineId", ({ params }) => {
    return HttpResponse.json([
      {
        id: 1,
        name: "스쿼트",
        restSeconds: 60,
        sets: [
          { id: 101, weight: 120, reps: 12 },
          { id: 102, weight: 120, reps: 12 },
          { id: 103, weight: 120, reps: 12 },
        ],
      },
      {
        id: 2,
        name: "벤치프레스",
        restSeconds: 90,
        sets: [
          { id: 201, weight: 80, reps: 10 },
          { id: 202, weight: 80, reps: 10 },
        ],
      },
      {
        id: 3,
        name: "데드리프트",
        restSeconds: 120,
        sets: [
          { id: 301, weight: 120, reps: 12 },
          { id: 302, weight: 120, reps: 12 },
          { id: 303, weight: 120, reps: 12 },
        ],
      },
      {
        id: 4,
        name: "플라이",
        restSeconds: 50,
        sets: [
          { id: 401, weight: 120, reps: 12 },
          { id: 402, weight: 120, reps: 12 },
          { id: 403, weight: 120, reps: 12 },
          { id: 404, weight: 120, reps: 12 },
          { id: 405, weight: 120, reps: 12 },
        ],
      },
      {
        id: 5,
        name: "레그 익스텐션",
        restSeconds: 40,
        sets: [
          { id: 501, weight: 120, reps: 12 },
          { id: 502, weight: 120, reps: 12 },
          { id: 503, weight: 120, reps: 12 },
        ],
      },
      http.get("/api/programs", () => {
        return HttpResponse.json(mockPrograms, { status: 200 });
      }),

      // GET 운동 프로그램 조회
      http.get("/api/programs", () => {
        return HttpResponse.json(mockPrograms, { status: 200 });
      }),

      // POST 운동 프로그램 생성
      http.post("/api/programs", async ({ request }) => {
        const body = (await request.json()) as Omit<Program, "id">;
        const newProgram: Program = {
          ...body,
          id: mockPrograms.length + 1,
        };
        mockPrograms.push(newProgram);

        return HttpResponse.json(newProgram, { status: 201 });
      }),
    ]);
  }),
];
