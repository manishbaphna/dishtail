import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type DietType = "Vegetarian" | "Eggetarian" | "Vegan" | "Non-Vegetarian";

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  dietType: DietType;
  isHealthy: boolean;
  source: string;
  url?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients, cuisine, servingSize = 1 } = await req.json();
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide ingredients" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Searching for recipes with:", { ingredients, cuisine, servingSize });

    // Use Lovable AI to search for recipes
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const cuisineInstruction = cuisine 
      ? `Focus on ${cuisine} cuisine recipes.` 
      : "You can suggest recipes from any cuisine.";

    const searchQuery = `Find complete cooking recipes that use ALL of these ingredients: ${ingredients.join(", ")}. 
    ${cuisineInstruction}
    The recipe should serve ${servingSize} ${servingSize === 1 ? 'person' : 'people'} - adjust all ingredient quantities accordingly.
    
    For each recipe found, provide:
    - Title
    - Brief description (1-2 sentences)
    - Complete list of all ingredients with quantities for ${servingSize} ${servingSize === 1 ? 'serving' : 'servings'}
    - Step-by-step cooking instructions
    - Preparation time
    - Diet type classification (IMPORTANT: Follow these rules exactly!)
    - Whether it's healthy (low sugar, not too oily)
    
    Return 5-7 different recipes. Make sure each recipe uses ALL the provided ingredients.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a recipe expert. Respond with a JSON array of recipes. Each recipe must be a JSON object with these exact fields:
            {
              "title": "Recipe name",
              "description": "Brief description",
              "ingredients": ["ingredient 1 with quantity", "ingredient 2 with quantity", ...],
              "instructions": ["step 1", "step 2", ...],
              "prepTime": "time in minutes format like '25 minutes'",
              "dietType": "one of: Vegetarian, Eggetarian, Vegan, Non-Vegetarian",
              "isHealthy": true/false,
              "source": "Web Search"
            }
            
            CRITICAL DIET TYPE CLASSIFICATION RULES:
            - "Vegan": No animal products at all (no meat, fish, eggs, dairy, honey)
            - "Vegetarian": No meat or fish, but may include dairy products like milk, cheese, butter, paneer. NO EGGS!
            - "Eggetarian": Vegetarian diet PLUS eggs. If a recipe contains eggs but no meat/fish, it MUST be "Eggetarian", NOT "Vegetarian"
            - "Non-Vegetarian": Contains meat, poultry, fish, or seafood
            
            EXAMPLES:
            - Recipe with eggs and vegetables = "Eggetarian" (NOT Vegetarian!)
            - Recipe with cheese and vegetables = "Vegetarian"
            - Recipe with only vegetables and plant-based ingredients = "Vegan"
            - Recipe with chicken = "Non-Vegetarian"
            - Egg curry, omelette, egg fried rice = "Eggetarian"
            
            IMPORTANT: All ingredient quantities should be for ${servingSize} ${servingSize === 1 ? 'serving' : 'servings'}.
            Return ONLY valid JSON array, no markdown or extra text.`
          },
          { role: "user", content: searchQuery }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "No credits available. Please add credits to your Lovable AI workspace to continue using recipe search." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("Failed to search recipes");
    }

    const aiData = await aiResponse.json();
    let recipes: Recipe[];

    try {
      const content = aiData.choices[0].message.content;
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recipes = JSON.parse(cleanContent);
      
      if (!Array.isArray(recipes)) {
        throw new Error("AI did not return an array");
      }

      // Validate and fix diet types
      recipes = recipes.map(recipe => {
        const ingredientsLower = recipe.ingredients.map(i => i.toLowerCase()).join(' ');
        const titleLower = recipe.title.toLowerCase();
        const descLower = recipe.description.toLowerCase();
        const allText = `${ingredientsLower} ${titleLower} ${descLower}`;
        
        // Check for egg-related keywords
        const hasEgg = /\begg[s]?\b|\begg\b|\bomelette\b|\bomelet\b|\bscrambled\b|\bfried egg\b|\bpoached egg\b|\begg curry\b|\begg bhurji\b/.test(allText);
        
        // Check for meat-related keywords
        const hasMeat = /\bchicken\b|\bmutton\b|\blamb\b|\bbeef\b|\bpork\b|\bfish\b|\bprawn\b|\bshrimp\b|\bcrab\b|\blobster\b|\bturkey\b|\bduck\b|\bbacon\b|\bham\b|\bsausage\b|\bseafood\b/.test(allText);
        
        let dietType: DietType = recipe.dietType;
        
        // Override if our checks reveal issues
        if (hasMeat) {
          dietType = "Non-Vegetarian";
        } else if (hasEgg && dietType === "Vegetarian") {
          // Fix incorrect classification - eggs should be Eggetarian
          dietType = "Eggetarian";
          console.log(`Fixed diet type for "${recipe.title}": Vegetarian -> Eggetarian (contains eggs)`);
        }
        
        return { ...recipe, dietType };
      });
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return empty array if parsing fails
      return new Response(
        JSON.stringify({ recipes: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sort recipes by priority:
    // 1. Vegan first, then Vegetarian, Eggetarian, Non-Vegetarian
    // 2. Healthy second
    // 3. Prep time third (ascending)
    const dietOrder: Record<DietType, number> = {
      "Vegan": 0,
      "Vegetarian": 1,
      "Eggetarian": 2,
      "Non-Vegetarian": 3
    };

    const sortedRecipes = recipes.sort((a, b) => {
      const dietA = dietOrder[a.dietType] ?? 4;
      const dietB = dietOrder[b.dietType] ?? 4;
      if (dietA !== dietB) return dietA - dietB;
      if (a.isHealthy !== b.isHealthy) return a.isHealthy ? -1 : 1;
      
      const timeA = parseInt(a.prepTime);
      const timeB = parseInt(b.prepTime);
      return timeA - timeB;
    });

    console.log(`Found ${sortedRecipes.length} recipes for ${servingSize} servings`);

    return new Response(
      JSON.stringify({ recipes: sortedRecipes }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in search-recipes function:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to search recipes";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
