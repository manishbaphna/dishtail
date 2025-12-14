import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipe, servingSize } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Analyze the nutritional content of this recipe for ${servingSize} serving(s).

Recipe: ${recipe.title}
Ingredients: ${recipe.ingredients.join(", ")}

Provide a detailed nutritional analysis including:
1. Estimated calories per serving
2. Macronutrients (protein, carbohydrates, fats)
3. Key vitamins and minerals
4. Health benefits
5. Any dietary considerations (allergens, sodium content, etc.)

Format the response as JSON with this structure:
{
  "calories": "estimated calories per serving",
  "macros": {
    "protein": "amount in grams",
    "carbs": "amount in grams",
    "fat": "amount in grams",
    "fiber": "amount in grams"
  },
  "vitamins": ["list of key vitamins"],
  "minerals": ["list of key minerals"],
  "healthBenefits": ["list of health benefits"],
  "considerations": ["dietary considerations or warnings"],
  "healthScore": "1-10 rating",
  "summary": "brief 2-3 sentence summary"
}`;

    console.log("Analyzing nutrition for:", recipe.title);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
            content: "You are a nutrition expert. Provide accurate nutritional analysis based on standard ingredient databases. Always respond with valid JSON only, no markdown or extra text." 
          },
          { role: "user", content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze nutrition");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    
    // Parse the JSON from the response
    let nutritionData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        nutritionData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON found");
      }
    } catch (parseError) {
      console.error("Failed to parse nutrition data:", parseError);
      nutritionData = {
        calories: "Unable to calculate",
        macros: { protein: "N/A", carbs: "N/A", fat: "N/A", fiber: "N/A" },
        vitamins: [],
        minerals: [],
        healthBenefits: [],
        considerations: [],
        healthScore: "N/A",
        summary: content
      };
    }

    console.log("Nutrition analysis complete");

    return new Response(JSON.stringify({ nutrition: nutritionData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Nutrition analysis error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});