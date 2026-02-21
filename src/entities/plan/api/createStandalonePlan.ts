import { api } from "@/shared/api/axios";

export interface CreatePlanRequest {
  title: string;
  description?: string;
  exercises: ExercisePayload[];
}

export interface ExercisePayload {
  exerciseId: number;
  orderIndex: number;
  defaultSets: number;
  defaultReps: number;
  defaultWeight?: number;
  defaultRestSeconds?: number;
  sets?: SetPayload[];
}

export interface SetPayload {
  targetSets?: number;
  targetReps?: number;
  targetWeight?: number;
  targetRestSeconds?: number;
}

export const createStandalonePlan = async (data: CreatePlanRequest) => {
  const response = await api.post("/api/plans/standalone", data);
  return response.data;
};
