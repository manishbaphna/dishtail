import { defineMcp } from "@lovable.dev/mcp-js";
import searchRecipesTool from "./tools/search-recipes";
import analyzeNutritionTool from "./tools/analyze-nutrition";

export default defineMcp({
  name: "dishtail",
  title: "Dishtail",
  version: "0.1.0",
  instructions:
    "Tools for Dishtail, a recipe finder. Use `search_recipes` to find recipes from a list of ingredients and `analyze_nutrition` to estimate a recipe's nutrition per serving. Every tool requires the `api_key` argument holding the Dishtail MCP API key.",
  tools: [searchRecipesTool, analyzeNutritionTool],
});
