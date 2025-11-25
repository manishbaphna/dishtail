export interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  isVegetarian: boolean;
  isHealthy: boolean;
  source?: string;
  url?: string;
}
