export interface DailyVolume {
  date: string;
  dayOfWeek: string;
  volume: number;
}

export interface WeeklyVolumeChart {
  dailyVolumes: DailyVolume[];
  lastWeekAverageVolume: number;
  chartMessage: string;
}

export interface BodyMetricSummary {
  currentWeight: number;
  weightDiff: number;
  currentSkeletalMuscleMass: number;
  skeletalMuscleMassDiff: number;
  currentBodyFatPercentage: number;
  bodyFatPercentageDiff: number;
}

export interface DashboardSummary {
  thisMonthWorkoutCount: number;
  currentStreakDays: number;
  recentlyCompletedPlanName: string | null;
  weeklyVolumeChart: WeeklyVolumeChart;
  bodyMetricSummary: BodyMetricSummary | null;
}
