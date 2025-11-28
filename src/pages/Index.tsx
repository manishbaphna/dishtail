import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { IngredientInput } from "@/components/IngredientInput";
import { RecipeDisplay } from "@/components/RecipeDisplay";
import { searchRecipes } from "@/utils/recipeSearch";
import { Recipe } from "@/types/recipe";
import { Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
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

  const handleSearch = async () => {
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
    setSelectedRecipe(null);

    try {
      const results = await searchRecipes(ingredients);
      
      if (results.length === 0) {
        toast({
          title: "No recipes found",
          description: "We couldn't find any recipes using all your ingredients. Try different combinations!",
        });
      } else {
        setRecipes(results);
        setSelectedRecipe(results[0]);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                Dishtail
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Tell us ingredients you fancy and we'll find a recipe for you
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://lovable.dev/settings/workspace/usage"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <span>Manage Credits</span>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="space-y-8">
          <section className="bg-card rounded-2xl p-6 shadow-soft border border-border">
            <IngredientInput
              ingredients={ingredients}
              setIngredients={setIngredients}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </section>

          {isSearching && (
            <div className="flex justify-center items-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Searching for delicious recipes...</p>
              </div>
            </div>
          )}

          {!isSearching && selectedRecipe && recipes.length > 0 && (
            <RecipeDisplay
              selectedRecipe={selectedRecipe}
              alternativeRecipes={recipes.slice(1, 6)}
              onSelectRecipe={setSelectedRecipe}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
