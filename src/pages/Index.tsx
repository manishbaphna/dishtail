import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { searchRecipes } from "@/utils/recipeSearch";
import { Recipe } from "@/types/recipe";
import { Loader2, LogOut, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [servingSize, setServingSize] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsCheckingAuth(false);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
    navigate("/auth");
  };

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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const selectedRecipe = recipes[currentRecipeIndex];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                Dishtail
              </h1>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1 line-clamp-2">
                Tell us ingredients you fancy and we'll find a recipe for you
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link to="/saved">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2 sm:px-3">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Saved</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        <div className="space-y-6 sm:space-y-8">
          <section className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-border">
            <IngredientInput
              ingredients={ingredients}
              setIngredients={setIngredients}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </section>

          {isSearching && (
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-10 sm:w-12 h-10 sm:h-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground text-sm sm:text-base">Searching for delicious recipes...</p>
              </div>
            </div>
          )}

          {!isSearching && selectedRecipe && recipes.length > 0 && (
            <RecipeDisplay
              selectedRecipe={selectedRecipe}
              recipes={recipes}
              currentIndex={currentRecipeIndex}
              onNavigate={handleNavigate}
              servingSize={servingSize}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
