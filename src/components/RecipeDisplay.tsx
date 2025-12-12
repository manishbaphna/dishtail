import { Recipe } from "@/types/recipe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Leaf, Heart, ChefHat, ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
  const totalRecipes = recipes.length;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalRecipes - 1;

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
    </div>
  );
};
