export interface Food {
  id: number;
  foodCode: string;
  foodName: string;
  makerName: string;
  category: string;
  totalWeight: number;
  servingSize: number;
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  sugars: number;
  sodium: number;
  transFat: number;
}

export interface FoodSearchResponse {
  content: Food[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  empty: boolean;
}
