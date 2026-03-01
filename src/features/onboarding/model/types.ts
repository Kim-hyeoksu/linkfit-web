export interface OnboardingData {
  name: string;
  birth_date: string;
  gender: "MALE" | "FEMALE" | "";
  height: number | "";
  weight: number | "";
  exercise_level: "LOW" | "MIDDLE" | "HIGH" | "";
}
