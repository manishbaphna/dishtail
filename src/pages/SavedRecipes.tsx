import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Trash2, Clock, Users, Leaf, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SavedRecipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: string[];
  instructions: string[];
  prep_time: string | null;
  is_vegetarian: boolean | null;
  is_healthy: boolean | null;
  serving_size: number | null;
  created_at: string;
}

const SavedRecipes = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchSavedRecipes();
    }
  }, [user]);

  const fetchSavedRecipes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_recipes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      toast({ title: "Failed to load recipes", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { error } = await supabase.from("saved_recipes").delete().eq("id", id);
      if (error) throw error;
      setRecipes(recipes.filter(r => r.id !== id));
      toast({ title: "Recipe deleted" });
    } catch (error: any) {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Saved Recipes</h1>
              <p className="text-sm text-muted-foreground">{recipes.length} recipes saved</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No saved recipes yet</p>
            <Button onClick={() => navigate("/")}>Find Recipes</Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg">{recipe.title}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(recipe.id)}
                      disabled={deletingId === recipe.id}
                    >
                      {deletingId === recipe.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                  {recipe.description && (
                    <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {recipe.prep_time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {recipe.prep_time}
                      </div>
                    )}
                    {recipe.serving_size && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        Serves {recipe.serving_size}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.is_vegetarian && (
                      <Badge variant="outline" className="text-xs">
                        <Leaf className="w-3 h-3 mr-1" />
                        Vegetarian
                      </Badge>
                    )}
                    {recipe.is_healthy && (
                      <Badge variant="outline" className="text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        Healthy
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedRecipes;