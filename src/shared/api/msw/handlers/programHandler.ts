// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { Program } from "@/entities/program";
import { mockPrograms, mockWorkout, mockWorkoutDay } from "../data/programs";
export const programHandlers = [
  http.get("*/api/exercises/:routineId", () => {
    return HttpResponse.json(mockWorkout);
  }),

  // GET 운동 프로그램 조회
  http.get("*/api/programs/popular", () => {
    return HttpResponse.json(mockPrograms, { status: 200 });
  }),
  http.get("*/api/programs/:programId", () => {
    return HttpResponse.json(mockWorkoutDay, { status: 200 });
  }), // POST 운동 프로그램 생성
  http.post("/api/programs", async ({ request }) => {
    const body = (await request.json()) as Omit<Program, "id">;
    const newProgram: Program = {
      ...body,
      id: mockPrograms.content.length + 1,
    };
    (mockPrograms.content as unknown[]).push(newProgram);

    return HttpResponse.json(newProgram, { status: 201 });
  }),
];
