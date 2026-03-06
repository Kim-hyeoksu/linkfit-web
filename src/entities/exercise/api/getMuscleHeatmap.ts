import { api } from "@/shared/api";

type GetMuscleHeatmapParams = {
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
};

export const getMuscleHeatmap = async ({
  startDate,
  endDate,
}: GetMuscleHeatmapParams) => {
  const response = await api.get<Record<string, number>>(
    "/api/statistics/muscle-heatmap",
    {
      params: { startDate, endDate },
    },
  );

  return response.data;
};
