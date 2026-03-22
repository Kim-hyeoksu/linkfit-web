export interface Food {
  id: number;
  name: string;
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  servingSize?: number;
  unit?: string;
}
