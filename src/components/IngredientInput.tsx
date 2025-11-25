import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, X } from "lucide-react";

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  onSearch: () => void;
  isSearching: boolean;
}

export const IngredientInput = ({
  ingredients,
  setIngredients,
  onSearch,
  isSearching,
}: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed.toLowerCase()]);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Add your ingredients
        </label>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., tomatoes, pasta, garlic..."
            className="flex-1"
          />
          <Button
            onClick={addIngredient}
            variant="outline"
            size="icon"
            disabled={!inputValue.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {ingredients.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""} added:
          </p>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="secondary"
                className="px-3 py-1.5 text-sm capitalize"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-2 hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={onSearch}
        disabled={ingredients.length === 0 || isSearching}
        className="w-full bg-gradient-warm hover:opacity-90 transition-opacity"
        size="lg"
      >
        {isSearching ? (
          <>Searching...</>
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            Find Recipes
          </>
        )}
      </Button>
    </div>
  );
};
