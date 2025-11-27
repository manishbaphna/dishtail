import { Recipe } from "@/types/recipe";
import { supabase } from "@/integrations/supabase/client";

export const searchRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    // Call the backend function to search for real recipes
    const { data, error } = await supabase.functions.invoke('search-recipes', {
      body: { ingredients }
    });

    if (error) {
      console.error("Error calling search-recipes function:", error);
      throw error;
    }

    if (!data || !data.recipes || data.recipes.length === 0) {
      return [];
    }

    return data.recipes as Recipe[];
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
};
