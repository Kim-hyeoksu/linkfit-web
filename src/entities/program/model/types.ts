export interface Program {
  id: number;
  programName: string;
  period: string;
  level: "beginner" | "intermediate" | "advanced";
  dayNumber: number;
  likeCount: number;
}
