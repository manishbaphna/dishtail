export type DietType = "Vegetarian" | "Eggetarian" | "Vegan" | "Non-Vegetarian";

export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  dietType: DietType;
  isHealthy: boolean;
  source?: string;
  url?: string;
  // Legacy support - deprecated
  isVegetarian?: boolean;
}
