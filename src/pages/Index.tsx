import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ClockWithPlateIcon, WeighScaleIcon, MagicJarIcon, SparkEffect } from "@/components/CulinaryIcons";
import { searchRecipes } from "@/utils/recipeSearch";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Recipe } from "@/types/recipe";
import { Loader2, Sparkles, Clock, Leaf, Search, Bookmark, LogIn, LogOut, Lightbulb, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Import logo and dish images
import dishtailLogo from "@/assets/dishtail-logo.jpg";
import bombaySandwichImg from "@/assets/bombay-sandwich.jpg";
import chickenTikkaMasalaImg from "@/assets/chicken-tikka-masala.jpg";
import mexicanQuesadillaImg from "@/assets/mexican-quesadilla.jpg";
import leftoverChapatiImg from "@/assets/leftover-chapati.jpg";
import avocadoJapaneseImg from "@/assets/avocado-japanese.jpg";
import chineseChickpeasImg from "@/assets/chinese-chickpeas.jpg";

const sampleRecipes = [
  {
    name: "Bombay Sandwich",
    ingredients: ["bread", "potato", "tomato", "cucumber", "green chutney"],
    image: bombaySandwichImg,
  },
  {
    name: "Chicken Tikka Masala",
    ingredients: ["chicken", "yogurt", "tomato", "cream", "garam masala"],
    image: chickenTikkaMasalaImg,
  },
  {
    name: "Mexican Quesadilla",
    ingredients: ["tortilla", "cheese", "chicken", "bell pepper", "onion"],
    image: mexicanQuesadillaImg,
  },
];

const cuisineExplorations = [
  {
    title: "Leftover Chapati Magic",
    description:
      "Did you know there are 12+ delicious recipes you can make with leftover chapatis or rotis? From crispy chips to savory rolls!",
    image: leftoverChapatiImg,
    searchIngredients: ["chapati", "onion", "vegetables"],
    highlight: "12+ recipes",
  },
  {
    title: "Avocado Goes Japanese",
    description:
      "Avocado isn't just for guacamole! Discover how it's used in Japanese cuisine - from sushi rolls to creamy onigiri fillings.",
    image: avocadoJapaneseImg,
    searchIngredients: ["avocado", "rice", "nori"],
    highlight: "Japanese fusion",
  },
  {
    title: "Chickpeas in Chinese Cuisine",
    description: "Surprised? Chickpeas are used in authentic Chinese dishes! Explore stir-fries, soups, and more.",
    image: chineseChickpeasImg,
    searchIngredients: ["chickpeas", "soy sauce", "ginger"],
    highlight: "Unexpected twist",
  },
];

// Fun rotating messages for when no recipes are found
const noRecipeMessages = [
  "Hmm… you're definitely more adventurous than our current algorithm. 🧪",
  "Your ingredient combo is out of this world! 🚀 Got a secret recipe to share via Contact Us?",
  "DishTail is scratching its head on this one. 🤔 Maybe you just invented something new!",
  "No recipes (yet)… but your creativity just gave our AI imposter syndrome. 🤖",
  "We couldn't find a match – if you have a wild idea in mind, send it through Contact Us! 💡",
  "Your culinary bravery is inspiring! Even our recipe wizards are stumped. 🧙‍♂️",
  "This combo is so unique, it might need its own cooking show! 📺",
];

// Features with both regular and culinary-themed icons
const getFeatureIcon = (index: number, isCulinary: boolean) => {
  const regularIcons = [Search, Leaf, Clock, Sparkles];
  const culinaryIcons = [MagicJarIcon, WeighScaleIcon, ClockWithPlateIcon, Sparkles];

  if (isCulinary) {
    const CulinaryIcon = culinaryIcons[index];
    if (index < 3) {
      return <CulinaryIcon className="w-12 h-12 mx-auto mb-3" />;
    }
    return <Sparkles className="w-10 h-10 text-culinary-orange mx-auto mb-3" />;
  }

  const RegularIcon = regularIcons[index];
  return <RegularIcon className="w-10 h-10 text-primary mx-auto mb-3" />;
};

const features = [
  { title: "Smart Recipe Matching", description: "Enter your ingredients and get recipes that use all of them" },
  { title: "Healthy Options First", description: "We prioritize vegetarian and healthy recipes automatically" },
  { title: "Quick & Easy", description: "Recipes sorted by prep time so you can cook faster" },
  { title: "Nutrition Analysis", description: "Get detailed calorie and nutrient information for any recipe" },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [servingSize, setServingSize] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastCuisine, setLastCuisine] = useState("");
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isCulinaryTheme, setIsCulinaryTheme] = useState(false);

  // Check if culinary theme is active
  useEffect(() => {
    const checkTheme = () => {
      setIsCulinaryTheme(document.documentElement.classList.contains("theme-festive"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  // Click spark effect for culinary theme
  const handleClick = useCallback((e: MouseEvent) => {
    if (!document.documentElement.classList.contains("theme-festive")) return;

    const id = Date.now();
    setSparks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((spark) => spark.id !== id));
    }, 400);
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  const { trackSearch, trackRecipeView } = useAnalytics();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
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
    setLastCuisine(cuisine);

    // Track search analytics
    trackSearch(ingredients, cuisine);

    try {
      const results = await searchRecipes(ingredients, cuisine, size);

      if (results.length === 0) {
        const randomMessage = noRecipeMessages[Math.floor(Math.random() * noRecipeMessages.length)];
        toast({
          title: "No recipes found",
          description: randomMessage,
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

  const handleNewSearch = () => {
    setHasSearched(false);
    setRecipes([]);
    setIngredients([]);
    setCurrentRecipeIndex(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedRecipe = recipes[currentRecipeIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Spark effects for Culinary theme */}
      {sparks.map((spark) => (
        <SparkEffect key={spark.id} x={spark.x} y={spark.y} />
      ))}
      {/* Hero Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleNewSearch}>
              <img src={dishtailLogo} alt="Dishtail" className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                  Dishtail
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm">Find Recipes by Ingredients</p>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {hasSearched && (
                <Button variant="outline" size="sm" onClick={handleNewSearch} className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">New Search</span>
                </Button>
              )}
              <ThemeSwitcher />
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
              <span className={isCulinaryTheme ? "text-culinary-green" : ""}>Got </span>
              <span className={isCulinaryTheme ? "text-culinary-orange" : ""}>Ingredients</span>
              <span className={isCulinaryTheme ? "text-culinary-red" : ""}>?</span>
              <br />
              <span className="bg-gradient-warm bg-clip-text text-transparent">Find Your Perfect Dish!</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-6">
              Solve your ingredient cravings! Enter what you have, and Dishtail spins it into bold, cross-cuisine
              recipes that use <strong className={isCulinaryTheme ? "text-culinary-green" : ""}>all</strong> of them.
              Plus, explore{" "}
              <span className={isCulinaryTheme ? "text-culinary-orange font-medium" : ""}>'surprise' cuisines</span> you
              never heard of—like Chinese recipes starring Indian chickpeas, Avocado-based Indian dishes, or Continental
              dishes with Paneer.
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
                <h3
                  className={`text-xl sm:text-2xl font-semibold mb-2 flex items-center justify-center gap-2 ${isCulinaryTheme ? "text-culinary-orange" : "text-foreground"}`}
                >
                  <Sparkles className={`w-6 h-6 ${isCulinaryTheme ? "text-culinary-red" : "text-primary"}`} />
                  <span className={isCulinaryTheme ? "text-culinary-green" : ""}>Discover</span>{" "}
                  <span className={isCulinaryTheme ? "text-culinary-orange" : ""}>Surprise</span>{" "}
                  <span className={isCulinaryTheme ? "text-culinary-red" : ""}>Cuisines</span>
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  What if your everyday ingredients could create dishes from unexpected cuisines?
                  <span className={isCulinaryTheme ? " text-culinary-green font-medium" : ""}>
                    {" "}
                    Indian dishes with avocado?
                  </span>
                  <span className={isCulinaryTheme ? " text-culinary-orange font-medium" : ""}>
                    {" "}
                    Chinese recipes with chickpeas?
                  </span>
                  <span className={isCulinaryTheme ? " text-culinary-red font-medium" : ""}>
                    {" "}
                    Prepare to be surprised!
                  </span>
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
                      <p className="text-sm text-muted-foreground mb-4">{exploration.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Explore Recipes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="py-8 sm:py-12 border-t border-border">
              <h3
                className={`text-xl sm:text-2xl font-semibold text-center mb-6 sm:mb-8 ${isCulinaryTheme ? "" : "text-foreground"}`}
              >
                <span className={isCulinaryTheme ? "text-culinary-red" : ""}>How </span>
                <span className={isCulinaryTheme ? "text-culinary-green" : ""}>Dishtail </span>
                <span className={isCulinaryTheme ? "text-culinary-orange" : ""}>Works</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6 text-center">
                      {getFeatureIcon(index, isCulinaryTheme)}
                      <h4
                        className={`font-semibold mb-2 ${isCulinaryTheme ? (index % 3 === 0 ? "text-culinary-red" : index % 3 === 1 ? "text-culinary-green" : "text-culinary-orange") : "text-foreground"}`}
                      >
                        {feature.title}
                      </h4>
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
                  Dishtail is your smart kitchen companion that transforms the ingredients in your pantry into delicious
                  meals from around the world. Whether you have leftover rice, some chicken, or just a few vegetables,
                  we'll help you discover recipes you never knew existed.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Solve ingredient cravings:</strong> Don't know what to cook? Just enter what you have, and
                  we'll show you the possibilities. <strong>Explore world cuisines:</strong> Learn how your everyday
                  ingredients are used in Indian, Japanese, Mexican, Chinese, and Mediterranean cooking.
                </p>
                <p className="text-muted-foreground">
                  Our intelligent search prioritizes <strong>healthy</strong> and <strong>vegetarian</strong> options,
                  sorts by <strong>prep time</strong> so you can cook quickly, and even provides
                  <strong> nutrition analysis</strong> for health-conscious cooks. Stop wasting food and start your
                  culinary adventure with Dishtail!
                </p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="mb-2">
            © {new Date().getFullYear()} Dishtail — Find Recipes by Ingredients | Explore World Cuisines
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
