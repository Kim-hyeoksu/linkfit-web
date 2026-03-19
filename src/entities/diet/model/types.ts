export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export interface DietItem {
  id?: number;
  foodName: string;
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
}

export interface DietRequest {
  mealType: MealType;
  mealDate: string;
  items: Omit<DietItem, "id">[];
  memo?: string;
  imagePath?: string;
}

export interface DietResponse {
  id: number;
  mealType: MealType;
  mealDate: string;
  items: DietItem[];
  totalCalories: number;
  totalCarbohydrate: number;
  totalProtein: number;
  totalFat: number;
  memo?: string;
  imagePath?: string;
}

export interface DietsByDateResponse {
  totalCalories: number;
  totalCarbohydrate: number;
  totalProtein: number;
  totalFat: number;
  amr: number;
  bmr: number;
  goalCalories: number;
  diets: DietResponse[];
}

/**
 * 전역 대시보드에서 사용하는 요약 정보
 */
export interface DietSummary {
  totalCalories: number;
  totalCarbohydrate: number;
  totalProtein: number;
  totalFat: number;
  targetCalories: number;
  targetCarbohydrate: number;
  targetProtein: number;
  targetFat: number;
}
