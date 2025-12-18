import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, X, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CUISINE_OPTIONS = [
  { value: "any", label: "Any Cuisine" },
  { value: "indian", label: "Indian" },
  { value: "continental", label: "Continental" },
  { value: "mexican", label: "Mexican" },
  { value: "lebanese", label: "Lebanese" },
  { value: "chinese", label: "Chinese" },
  { value: "italian", label: "Italian" },
  { value: "thai", label: "Thai" },
  { value: "japanese", label: "Japanese" },
  { value: "mediterranean", label: "Mediterranean" },
];

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  onSearch: (cuisine: string, servingSize: number) => void;
  isSearching: boolean;
}

export const IngredientInput = ({
  ingredients,
  setIngredients,
  onSearch,
  isSearching,
}: IngredientInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [cuisine, setCuisine] = useState("any");
  const [servingSize, setServingSize] = useState(1);

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

  const handleSearch = () => {
    onSearch(cuisine === "any" ? "" : cuisine, servingSize);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <label className="text-sm font-medium text-foreground">
            Add ingredients
          </label>
          <span className="text-xs text-muted-foreground">
            (press Enter to add each)
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type an ingredient (e.g., chicken)"
            className="flex-1"
          />
          <Button
            onClick={addIngredient}
            variant="outline"
            disabled={!inputValue.trim()}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
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

      {/* Optional Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Cuisine Type <span className="text-muted-foreground">(optional)</span>
          </label>
          <Select value={cuisine} onValueChange={setCuisine}>
            <SelectTrigger>
              <SelectValue placeholder="Select cuisine" />
            </SelectTrigger>
            <SelectContent>
              {CUISINE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Serving Size
          </label>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <Input
              type="number"
              min={1}
              max={20}
              value={servingSize}
              onChange={(e) => setServingSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20"
            />
            <span className="text-sm text-muted-foreground">
              {servingSize === 1 ? "person" : "people"}
            </span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSearch}
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
