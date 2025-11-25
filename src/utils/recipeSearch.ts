import { Recipe } from "@/types/recipe";

export const searchRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  // Create a search query that requires ALL ingredients
  const searchQuery = `recipes using all these ingredients: ${ingredients.join(", ")} complete recipe with instructions`;
  
  try {
    // Note: This is a mock implementation. In a real app, you would:
    // 1. Use a recipe API (like Spoonacular, Edamam, etc.)
    // 2. Or implement web scraping with proper recipe websites
    // 3. Or use a database of recipes
    
    // For now, we'll return mock data that demonstrates the prioritization logic
    const mockRecipes: Recipe[] = [
      {
        title: "Fresh Garden Vegetable Pasta",
        description: "A light and healthy vegetarian pasta dish featuring fresh seasonal vegetables in a garlic olive oil sauce.",
        ingredients: ingredients.map(ing => `Fresh ${ing}`).concat(["olive oil", "garlic", "salt", "pepper", "pasta"]),
        instructions: [
          "Bring a large pot of salted water to boil for the pasta.",
          "While water heats, prep all your vegetables by washing and chopping them into bite-sized pieces.",
          "Heat olive oil in a large pan over medium heat and sauté minced garlic until fragrant.",
          "Add your vegetables starting with the firmest ones, cooking for 5-7 minutes until tender-crisp.",
          "Cook pasta according to package directions, then drain reserving 1 cup pasta water.",
          "Toss pasta with vegetables, adding pasta water as needed to create a light sauce.",
          "Season with salt and pepper to taste, and serve immediately with fresh herbs if desired."
        ],
        prepTime: "25 minutes",
        isVegetarian: true,
        isHealthy: true,
        source: "Mock Recipe",
      },
      {
        title: "Mediterranean Vegetable Stir-Fry",
        description: "A quick and colorful vegetarian stir-fry with Mediterranean flavors.",
        ingredients: ingredients.concat(["olive oil", "lemon juice", "oregano", "salt"]),
        instructions: [
          "Heat olive oil in a wok or large skillet over high heat.",
          "Add vegetables in order of cooking time, starting with the hardest.",
          "Stir-fry for 8-10 minutes until vegetables are tender but still crisp.",
          "Add lemon juice and oregano in the last minute.",
          "Season with salt to taste and serve hot."
        ],
        prepTime: "15 minutes",
        isVegetarian: true,
        isHealthy: true,
        source: "Mock Recipe",
      },
      {
        title: "Roasted Vegetable Medley",
        description: "Simple roasted vegetables that bring out natural sweetness.",
        ingredients: ingredients.concat(["olive oil", "rosemary", "salt", "pepper"]),
        instructions: [
          "Preheat oven to 425°F (220°C).",
          "Cut all vegetables into similar-sized pieces.",
          "Toss vegetables with olive oil, salt, pepper, and fresh rosemary.",
          "Spread on a baking sheet in a single layer.",
          "Roast for 25-30 minutes, stirring halfway through, until golden and tender."
        ],
        prepTime: "35 minutes",
        isVegetarian: true,
        isHealthy: true,
        source: "Mock Recipe",
      },
    ];

    // Sort recipes by priority:
    // 1. Vegetarian first
    // 2. Healthy second
    // 3. Prep time third (ascending)
    const sortedRecipes = mockRecipes.sort((a, b) => {
      if (a.isVegetarian !== b.isVegetarian) return a.isVegetarian ? -1 : 1;
      if (a.isHealthy !== b.isHealthy) return a.isHealthy ? -1 : 1;
      
      const timeA = parseInt(a.prepTime);
      const timeB = parseInt(b.prepTime);
      return timeA - timeB;
    });

    return sortedRecipes;
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
};
