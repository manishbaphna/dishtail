import { useState } from "react";
import { Recipe } from "@/types/recipe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, Leaf, Heart, ChefHat, ChevronLeft, ChevronRight, Users, 
  Bookmark, ShoppingCart, UtensilsCrossed, Activity, Loader2, X 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NutritionData {
  calories: string;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  vitamins: string[];
  minerals: string[];
  healthBenefits: string[];
  considerations: string[];
  healthScore: string;
  summary: string;
}

interface RecipeDisplayProps {
  selectedRecipe: Recipe;
  recipes: Recipe[];
  currentIndex: number;
  onNavigate: (direction: "prev" | "next") => void;
  servingSize: number;
}

export const RecipeDisplay = ({
  selectedRecipe,
  recipes,
  currentIndex,
  onNavigate,
  servingSize,
}: RecipeDisplayProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [showNutrition, setShowNutrition] = useState(false);
  const { toast } = useToast();

  const totalRecipes = recipes.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalRecipes - 1;

  const handleSaveRecipe = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ 
          title: "Sign in to save recipes", 
          description: "Create a free account to save your favorite recipes.",
          action: (
            <a href="/auth" className="text-primary underline text-sm">
              Sign In
            </a>
          )
        });
        setIsSaving(false);
        return;
      }

      const { error } = await supabase.from("saved_recipes").insert({
        user_id: user.id,
        title: selectedRecipe.title,
        description: selectedRecipe.description,
        ingredients: selectedRecipe.ingredients,
        instructions: selectedRecipe.instructions,
        prep_time: selectedRecipe.prepTime,
        is_vegetarian: selectedRecipe.isVegetarian,
        is_healthy: selectedRecipe.isHealthy,
        source: selectedRecipe.source,
        url: selectedRecipe.url,
        serving_size: servingSize,
      });

      if (error) throw error;

      toast({ title: "Recipe saved!", description: "You can find it in your saved recipes." });
    } catch (error: any) {
      toast({ title: "Failed to save recipe", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBuyIngredients = () => {
    const ingredientsList = selectedRecipe.ingredients.join(", ");
    const instacartUrl = `https://www.instacart.com/store/search/${encodeURIComponent(ingredientsList)}`;
    window.open(instacartUrl, "_blank");
  };

  const handleOrderFood = () => {
    const uberEatsUrl = `https://www.ubereats.com/search?q=${encodeURIComponent(selectedRecipe.title)}`;
    window.open(uberEatsUrl, "_blank");
  };

  const handleAnalyzeNutrition = async () => {
    setIsAnalyzing(true);
    try {
      const response = await supabase.functions.invoke("analyze-nutrition", {
        body: { recipe: selectedRecipe, servingSize },
      });

      if (response.error) throw response.error;

      setNutritionData(response.data.nutrition);
      setShowNutrition(true);
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Controls */}
      <div className="flex items-center justify-between bg-card rounded-xl p-3 sm:p-4 border border-border">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("prev")}
          disabled={!hasPrev}
          className="flex items-center gap-1 sm:gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        
        <div className="text-center">
          <span className="text-sm font-medium text-foreground">
            Recipe {currentIndex + 1} of {totalRecipes}
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hasNext ? "Try 'Next' for more options" : "Last recipe"}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate("next")}
          disabled={!hasNext}
          className="flex items-center gap-1 sm:gap-2"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <Card className="border-2 border-primary/20 shadow-soft">
        <CardHeader className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-xl sm:text-2xl font-bold">{selectedRecipe.title}</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {selectedRecipe.description}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedRecipe.isVegetarian && (
                <Badge variant="outline" className="bg-accent/10 border-accent text-accent-foreground">
                  <Leaf className="w-3 h-3 mr-1" />
                  Vegetarian
                </Badge>
              )}
              {selectedRecipe.isHealthy && (
                <Badge variant="outline" className="bg-accent/10 border-accent text-accent-foreground">
                  <Heart className="w-3 h-3 mr-1" />
                  Healthy
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{selectedRecipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>Serves {servingSize}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveRecipe}
              disabled={isSaving}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
              <span className="hidden sm:inline">Save Recipe</span>
              <span className="sm:hidden">Save</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleBuyIngredients}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Buy Ingredients</span>
              <span className="sm:hidden">Buy</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleAnalyzeNutrition}
              disabled={isAnalyzing}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              <span className="hidden sm:inline">Nutrition</span>
              <span className="sm:hidden">Health</span>
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              onClick={handleOrderFood}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span className="hidden sm:inline">Order Instead</span>
              <span className="sm:hidden">Order</span>
            </Button>
          </div>

          {/* Order Banner */}
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">
              🍽️ <span className="font-medium">Too tired to cook?</span>{" "}
              <button onClick={handleOrderFood} className="text-primary hover:underline">
                Order this dish from a local restaurant
              </button>
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Ingredients
              {servingSize > 1 && (
                <span className="text-xs font-normal text-muted-foreground">
                  (for {servingSize} {servingSize === 1 ? "person" : "people"})
                </span>
              )}
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground text-sm sm:text-base">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-3">Instructions</h3>
            <ol className="space-y-3">
              {selectedRecipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-foreground text-sm sm:text-base pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {selectedRecipe.url && (
            <Button variant="outline" asChild className="w-full">
              <a href={selectedRecipe.url} target="_blank" rel="noopener noreferrer">
                View Original Recipe
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Recipe Quick Select */}
      {recipes.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">All Recipes</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {recipes.map((recipe, index) => (
              <button
                key={index}
                onClick={() => {
                  const diff = index - currentIndex;
                  if (diff > 0) {
                    for (let i = 0; i < diff; i++) onNavigate("next");
                  } else if (diff < 0) {
                    for (let i = 0; i < Math.abs(diff); i++) onNavigate("prev");
                  }
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition-all ${
                  index === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {index + 1}. {recipe.title.length > 20 ? recipe.title.slice(0, 20) + "..." : recipe.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nutrition Analysis Dialog */}
      <Dialog open={showNutrition} onOpenChange={setShowNutrition}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Nutrition Analysis
            </DialogTitle>
            <DialogDescription>
              Estimated nutritional information for {selectedRecipe.title} ({servingSize} serving{servingSize > 1 ? "s" : ""})
            </DialogDescription>
          </DialogHeader>
          
          {nutritionData && (
            <div className="space-y-4">
              {/* Calories and Health Score */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{nutritionData.calories}</p>
                  <p className="text-sm text-muted-foreground">Calories</p>
                </div>
                <div className="bg-accent/10 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-accent-foreground">{nutritionData.healthScore}/10</p>
                  <p className="text-sm text-muted-foreground">Health Score</p>
                </div>
              </div>

              {/* Macros */}
              <div>
                <h4 className="font-semibold mb-2">Macronutrients</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-secondary rounded-lg p-2 text-center">
                    <p className="font-medium">{nutritionData.macros.protein}</p>
                    <p className="text-xs text-muted-foreground">Protein</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-2 text-center">
                    <p className="font-medium">{nutritionData.macros.carbs}</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-2 text-center">
                    <p className="font-medium">{nutritionData.macros.fat}</p>
                    <p className="text-xs text-muted-foreground">Fat</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-2 text-center">
                    <p className="font-medium">{nutritionData.macros.fiber}</p>
                    <p className="text-xs text-muted-foreground">Fiber</p>
                  </div>
                </div>
              </div>

              {/* Health Benefits */}
              {nutritionData.healthBenefits.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-green-600">Health Benefits</h4>
                  <ul className="space-y-1">
                    {nutritionData.healthBenefits.map((benefit, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-green-600">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Considerations */}
              {nutritionData.considerations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-amber-600">Considerations</h4>
                  <ul className="space-y-1">
                    {nutritionData.considerations.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-amber-600">⚠</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary */}
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm">{nutritionData.summary}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};