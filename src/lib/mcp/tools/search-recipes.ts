import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { lovableApiKey, requireApiKey } from "../auth";

type DietType = "Vegetarian" | "Eggetarian" | "Vegan" | "Non-Vegetarian";

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  dietType: DietType;
  isHealthy: boolean;
  source?: string;
}

export default defineTool({
  name: "search_recipes",
  title: "Search recipes",
  description:
    "Find complete cooking recipes that use a given list of ingredients, optionally scoped to a cuisine and scaled to a serving size.",
  inputSchema: {
    api_key: z.string().min(1).describe("Dishtail MCP API key."),
    ingredients: z
      .array(z.string().trim().min(1))
      .min(1)
      .max(25)
      .describe("Ingredients the recipe must use."),
    cuisine: z.string().trim().min(1).max(60).optional().describe("Optional cuisine, e.g. 'Italian'."),
    serving_size: z.number().int().min(1).max(20).default(1).describe("Number of people to serve."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ api_key, ingredients, cuisine, serving_size }) => {
    const denied = requireApiKey(api_key);
    if (denied) return denied;

    const servingSize = serving_size ?? 1;
    const cuisineInstruction = cuisine
      ? `Focus on ${cuisine} cuisine recipes.`
      : "You can suggest recipes from any cuisine.";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a recipe expert. Respond with ONLY a valid JSON array of recipes, no markdown. Each recipe object has: title, description, ingredients (array of strings with quantities), instructions (array of steps), prepTime (e.g. "25 minutes"), dietType (one of Vegetarian, Eggetarian, Vegan, Non-Vegetarian), isHealthy (boolean), source ("Web Search").

DIET TYPE RULES:
- "Vegan": no animal products at all.
- "Vegetarian": no meat, fish or eggs; dairy allowed.
- "Eggetarian": vegetarian plus eggs. Any recipe with eggs and no meat/fish is Eggetarian, never Vegetarian.
- "Non-Vegetarian": contains meat, poultry, fish or seafood.

All ingredient quantities must be for ${servingSize} serving(s).`,
          },
          {
            role: "user",
            content: `Find complete cooking recipes that use ALL of these ingredients: ${ingredients.join(", ")}.
${cuisineInstruction}
Serve ${servingSize} ${servingSize === 1 ? "person" : "people"}. Return 5-7 different recipes.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = response.status === 429
        ? "Rate limit exceeded, try again shortly."
        : response.status === 402
          ? "AI credits exhausted for this workspace."
          : `Recipe search failed (${response.status}).`;
      return { content: [{ type: "text", text: detail }], isError: true };
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    let recipes: Recipe[];
    try {
      recipes = JSON.parse(content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
      if (!Array.isArray(recipes)) throw new Error("not an array");
    } catch {
      return { content: [{ type: "text", text: "Could not parse recipe results." }], isError: true };
    }

    // Correct diet types the model commonly mislabels.
    recipes = recipes.map((recipe) => {
      const allText = `${recipe.ingredients?.join(" ") ?? ""} ${recipe.title} ${recipe.description}`.toLowerCase();
      const hasEgg = /\begg[s]?\b|\bomelette\b|\bomelet\b|\bbhurji\b/.test(allText);
      const hasMeat = /\bchicken\b|\bmutton\b|\blamb\b|\bbeef\b|\bpork\b|\bfish\b|\bprawn\b|\bshrimp\b|\bcrab\b|\blobster\b|\bturkey\b|\bduck\b|\bbacon\b|\bham\b|\bsausage\b|\bseafood\b/.test(allText);
      let dietType = recipe.dietType;
      if (hasMeat) dietType = "Non-Vegetarian";
      else if (hasEgg && dietType === "Vegetarian") dietType = "Eggetarian";
      return { ...recipe, dietType };
    });

    return {
      content: [{ type: "text", text: JSON.stringify(recipes, null, 2) }],
      structuredContent: { recipes, servingSize },
    };
  },
});
