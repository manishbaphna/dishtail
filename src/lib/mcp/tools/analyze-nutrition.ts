import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { lovableApiKey, requireApiKey } from "../auth";

export default defineTool({
  name: "analyze_nutrition",
  title: "Analyze nutrition",
  description:
    "Estimate calories, macros, vitamins, minerals and health notes for a recipe, per serving.",
  inputSchema: {
    api_key: z.string().min(1).describe("Dishtail MCP API key."),
    title: z.string().trim().min(1).max(200).describe("Recipe name."),
    ingredients: z
      .array(z.string().trim().min(1))
      .min(1)
      .max(60)
      .describe("Ingredients with quantities."),
    serving_size: z.number().int().min(1).max(20).default(1).describe("Number of servings."),
  },
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ api_key, title, ingredients, serving_size }) => {
    const denied = requireApiKey(api_key);
    if (denied) return denied;

    const servingSize = serving_size ?? 1;
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
            content:
              "You are a nutrition expert. Provide accurate nutritional analysis based on standard ingredient databases. Always respond with valid JSON only, no markdown or extra text.",
          },
          {
            role: "user",
            content: `Analyze the nutritional content of this recipe for ${servingSize} serving(s).

Recipe: ${title}
Ingredients: ${ingredients.join(", ")}

Respond as JSON:
{
  "calories": "estimated calories per serving",
  "macros": { "protein": "g", "carbs": "g", "fat": "g", "fiber": "g" },
  "vitamins": ["..."],
  "minerals": ["..."],
  "healthBenefits": ["..."],
  "considerations": ["..."],
  "healthScore": "1-10 rating",
  "summary": "brief 2-3 sentence summary"
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const detail = response.status === 429
        ? "Rate limit exceeded, try again shortly."
        : response.status === 402
          ? "AI credits exhausted for this workspace."
          : `Nutrition analysis failed (${response.status}).`;
      return { content: [{ type: "text", text: detail }], isError: true };
    }

    const data = await response.json();
    const content: string = data.choices?.[0]?.message?.content ?? "";
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return { content: [{ type: "text", text: "Could not parse nutrition results." }], isError: true };
    }
    let nutrition: unknown;
    try {
      nutrition = JSON.parse(match[0]);
    } catch {
      return { content: [{ type: "text", text: "Could not parse nutrition results." }], isError: true };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(nutrition, null, 2) }],
      structuredContent: { nutrition, servingSize },
    };
  },
});
