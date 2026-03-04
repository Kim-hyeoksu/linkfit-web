import { api } from "@/shared/api";
import { PageExerciseHistoryResponse } from "../model/types";

type GetExerciseHistoryParams = {
  exerciseId: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  page?: number;
  size?: number;
  sort?: string[];
};

export const getExerciseHistory = async ({
  exerciseId,
  startDate,
  endDate,
  page = 0,
  size = 10,
  sort,
}: GetExerciseHistoryParams): Promise<PageExerciseHistoryResponse> => {
  const response = await api.get(`/api/exercises/${exerciseId}/history`, {
    params: {
      startDate,
      endDate,
      page,
      size,
      sort,
    },
  });

  return response.data;
};
