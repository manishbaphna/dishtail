import { Recipe } from "@/types/recipe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Leaf, Heart, ChefHat } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RecipeDisplayProps {
  selectedRecipe: Recipe;
  alternativeRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeDisplay = ({
  selectedRecipe,
  alternativeRecipes,
  onSelectRecipe,
}: RecipeDisplayProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-soft">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl font-bold">{selectedRecipe.title}</CardTitle>
              <CardDescription className="text-base">
                {selectedRecipe.description}
              </CardDescription>
            </div>
            <div className="flex gap-2">
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
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{selectedRecipe.prepTime}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Ingredients
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedRecipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-foreground">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-lg mb-3">Instructions</h3>
            <ol className="space-y-3">
              {selectedRecipe.instructions.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-foreground pt-0.5">{step}</span>
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

      {alternativeRecipes.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Other Great Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alternativeRecipes.map((recipe, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-soft transition-all hover:border-primary/30"
                onClick={() => onSelectRecipe(recipe)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{recipe.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex gap-2">
                    {recipe.isVegetarian && (
                      <Badge variant="outline" className="text-xs bg-accent/10 border-accent">
                        <Leaf className="w-3 h-3 mr-1" />
                        Veg
                      </Badge>
                    )}
                    {recipe.isHealthy && (
                      <Badge variant="outline" className="text-xs bg-accent/10 border-accent">
                        <Heart className="w-3 h-3 mr-1" />
                        Healthy
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
