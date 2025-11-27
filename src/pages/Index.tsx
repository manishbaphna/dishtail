import { useState } from "react";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { searchRecipes } from "@/utils/recipeSearch";
import { Recipe } from "@/types/recipe";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients added",
        description: "Please add at least one ingredient to search for recipes.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setRecipes([]);
    setSelectedRecipe(null);

    try {
      const results = await searchRecipes(ingredients);
      
      if (results.length === 0) {
        toast({
          title: "No recipes found",
          description: "We couldn't find any recipes using all your ingredients. Try different combinations!",
        });
      } else {
        setRecipes(results);
        setSelectedRecipe(results[0]);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred while searching for recipes. Please try again.";
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
            Dishtail
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tell us ingredients you fancy and we'll find a recipe for you
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <section className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <IngredientInput
              ingredients={ingredients}
              setIngredients={setIngredients}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </section>

          {isSearching && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Searching for delicious recipes...</p>
              </div>
            </div>
          )}

          {!isSearching && selectedRecipe && recipes.length > 0 && (
            <RecipeDisplay
              selectedRecipe={selectedRecipe}
              alternativeRecipes={recipes.slice(1, 6)}
              onSelectRecipe={setSelectedRecipe}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
