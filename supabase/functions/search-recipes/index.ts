import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  isVegetarian: boolean;
  isHealthy: boolean;
  source: string;
  url?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header provided");
      return new Response(
        JSON.stringify({ error: 'Unauthorized: No authorization header' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error("Authentication failed:", authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Authenticated user:", user.id);

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
    - Whether it's vegetarian
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
              "isVegetarian": true/false,
              "isHealthy": true/false,
              "source": "Web Search"
            }
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
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Return empty array if parsing fails
      return new Response(
        JSON.stringify({ recipes: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sort recipes by priority:
    // 1. Vegetarian first
    // 2. Healthy second
    // 3. Prep time third (ascending)
    const sortedRecipes = recipes.sort((a, b) => {
      if (a.isVegetarian !== b.isVegetarian) return a.isVegetarian ? -1 : 1;
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
