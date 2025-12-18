import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { searchRecipes } from "@/utils/recipeSearch";
import { Recipe } from "@/types/recipe";
import { Loader2, ChefHat, Sparkles, Clock, Leaf, Search, Bookmark, LogIn, LogOut, Globe, Lightbulb, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import dish images
import bombaySandwichImg from "@/assets/bombay-sandwich.jpg";
import chickenTikkaMasalaImg from "@/assets/chicken-tikka-masala.jpg";
import mexicanQuesadillaImg from "@/assets/mexican-quesadilla.jpg";
import leftoverChapatiImg from "@/assets/leftover-chapati.jpg";
import avocadoJapaneseImg from "@/assets/avocado-japanese.jpg";
import chineseChickpeasImg from "@/assets/chinese-chickpeas.jpg";

const sampleRecipes = [
  { name: "Bombay Sandwich", ingredients: ["bread", "potato", "tomato", "cucumber", "green chutney"], image: bombaySandwichImg },
  { name: "Chicken Tikka Masala", ingredients: ["chicken", "yogurt", "tomato", "cream", "garam masala"], image: chickenTikkaMasalaImg },
  { name: "Mexican Quesadilla", ingredients: ["tortilla", "cheese", "chicken", "bell pepper", "onion"], image: mexicanQuesadillaImg },
];

const cuisineExplorations = [
  { 
    title: "Leftover Chapati Magic", 
    description: "Did you know there are 12+ delicious recipes you can make with leftover chapatis or rotis? From crispy chips to savory rolls!",
    image: leftoverChapatiImg,
    searchIngredients: ["chapati", "onion", "vegetables"],
    highlight: "12+ recipes"
  },
  { 
    title: "Avocado Goes Japanese", 
    description: "Avocado isn't just for guacamole! Discover how it's used in Japanese cuisine - from sushi rolls to creamy onigiri fillings.",
    image: avocadoJapaneseImg,
    searchIngredients: ["avocado", "rice", "nori"],
    highlight: "Japanese fusion"
  },
  { 
    title: "Chickpeas in Chinese Cuisine", 
    description: "Surprised? Chickpeas are used in authentic Chinese dishes! Explore stir-fries, soups, and more.",
    image: chineseChickpeasImg,
    searchIngredients: ["chickpeas", "soy sauce", "ginger"],
    highlight: "Unexpected twist"
  },
];

const features = [
  { icon: Search, title: "Smart Recipe Matching", description: "Enter your ingredients and get recipes that use all of them" },
  { icon: Leaf, title: "Healthy Options First", description: "We prioritize vegetarian and healthy recipes automatically" },
  { icon: Clock, title: "Quick & Easy", description: "Recipes sorted by prep time so you can cook faster" },
  { icon: Sparkles, title: "Nutrition Analysis", description: "Get detailed calorie and nutrient information for any recipe" },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [servingSize, setServingSize] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);
  const { toast } = useToast();

  const handleSearch = async (cuisine: string, size: number) => {
    if (ingredients.length === 0) {
      toast({
        title: "No ingredients added",
        description: "Please add at least one ingredient to search for recipes.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setRecipes([]);
    setCurrentRecipeIndex(0);
    setServingSize(size);
    setHasSearched(true);

    try {
      const results = await searchRecipes(ingredients, cuisine, size);
      
      if (results.length === 0) {
        toast({
          title: "No recipes found",
          description: "We couldn't find any recipes using all your ingredients. Try different combinations!",
        });
      } else {
        setRecipes(results);
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An error occurred while searching for recipes. Please try again.";
      toast({
        title: "Search failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigate = (direction: "prev" | "next") => {
    if (direction === "next" && currentRecipeIndex < recipes.length - 1) {
      setCurrentRecipeIndex(currentRecipeIndex + 1);
    } else if (direction === "prev" && currentRecipeIndex > 0) {
      setCurrentRecipeIndex(currentRecipeIndex - 1);
    }
  };

  const handleSampleSearch = (recipeIngredients: string[]) => {
    setIngredients(recipeIngredients);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
  };

  const selectedRecipe = recipes[currentRecipeIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent flex items-center gap-2">
                <ChefHat className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                Dishtail
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Find Recipes by Ingredients
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/saved">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Bookmark className="w-4 h-4" />
                  <span className="hidden sm:inline">Saved</span>
                </Button>
              </Link>
              {user ? (
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="flex items-center gap-1">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        {/* Hero Section - Only show before first search */}
        {!hasSearched && (
          <section className="text-center py-6 sm:py-10 mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Got Ingredients?
              <br />
              <span className="bg-gradient-warm bg-clip-text text-transparent">Find Your Perfect Dish!</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-6">
              Solve your ingredient cravings! Enter what you have, and Dishtail spins it into bold, cross-cuisine 
              recipes that use <strong>all</strong> of them. Plus, explore 'surprise' cuisines you never heard of—like 
              Chinese recipes starring Indian chickpeas, Avocado-based Indian dishes, or Continental dishes with Paneer.
            </p>
          </section>
        )}

        {/* Search Section */}
        <section className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-border mb-6 sm:mb-8">
          <IngredientInput
            ingredients={ingredients}
            setIngredients={setIngredients}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
        </section>

        {/* Loading State */}
        {isSearching && (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-10 sm:w-12 h-10 sm:h-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground text-sm sm:text-base">Searching for delicious recipes...</p>
            </div>
          </div>
        )}

        {/* Recipe Results */}
        {!isSearching && selectedRecipe && recipes.length > 0 && (
          <RecipeDisplay
            selectedRecipe={selectedRecipe}
            recipes={recipes}
            currentIndex={currentRecipeIndex}
            onNavigate={handleNavigate}
            servingSize={servingSize}
          />
        )}

        {/* Content Sections - Only show before search */}
        {!hasSearched && (
          <>


            {/* Cuisine Exploration Section */}
            <section className="py-8 sm:py-12 border-t border-border">
              <div className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-foreground flex items-center justify-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Discover Surprise Cuisines
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  What if your everyday ingredients could create dishes from unexpected cuisines? 
                  Indian dishes with avocado? Chinese recipes with chickpeas? Prepare to be surprised!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cuisineExplorations.map((exploration, index) => (
                  <Card 
                    key={index}
                    className="bg-card border-border overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleSampleSearch(exploration.searchIngredients)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={exploration.image} 
                        alt={exploration.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute top-3 right-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {exploration.highlight}
                      </span>
                      <h4 className="absolute bottom-3 left-4 right-4 font-bold text-white text-lg">
                        {exploration.title}
                      </h4>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        {exploration.description}
                      </p>
                      <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Explore Recipes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Features Section */}
            <section className="py-8 sm:py-12 border-t border-border">
              <h3 className="text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8 text-foreground">
                How Dishtail Works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6 text-center">
                      <feature.icon className="w-10 h-10 text-primary mx-auto mb-3" />
                      <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* SEO Content Section */}
            <section className="py-8 sm:py-12 border-t border-border">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground">
                  Your Personal Recipe Finder & Cuisine Explorer
                </h3>
                <p className="text-muted-foreground mb-4">
                  Dishtail is your smart kitchen companion that transforms the ingredients in your pantry 
                  into delicious meals from around the world. Whether you have leftover rice, some chicken, 
                  or just a few vegetables, we'll help you discover recipes you never knew existed.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Solve ingredient cravings:</strong> Don't know what to cook? Just enter what you have, 
                  and we'll show you the possibilities. <strong>Explore world cuisines:</strong> Learn how 
                  your everyday ingredients are used in Indian, Japanese, Mexican, Chinese, and Mediterranean cooking.
                </p>
                <p className="text-muted-foreground">
                  Our intelligent search prioritizes <strong>healthy</strong> and <strong>vegetarian</strong> options, 
                  sorts by <strong>prep time</strong> so you can cook quickly, and even provides 
                  <strong> nutrition analysis</strong> for health-conscious cooks. Stop wasting food and 
                  start your culinary adventure with Dishtail!
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Dishtail — Find Recipes by Ingredients | Explore World Cuisines</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;