import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChefHat, BarChart3, Users, Search, Eye, Bookmark, 
  Activity, ArrowLeft, Loader2, TrendingUp, Calendar,
  Home
} from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import dishtailLogo from "@/assets/dishtail-logo.png";

interface AnalyticsSummary {
  totalPageViews: number;
  uniqueSessions: number;
  totalSearches: number;
  totalRecipeSaves: number;
  totalNutritionAnalyses: number;
  topIngredients: { ingredient: string; count: number }[];
  recentEvents: any[];
}

const AdminStats = () => {
  const { isAdmin, isLoading: isCheckingAdmin, user } = useAdminCheck();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("week");

  useEffect(() => {
    if (!isCheckingAdmin && !isAdmin) {
      navigate("/auth");
    }
  }, [isCheckingAdmin, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
    }
  }, [isAdmin, dateRange]);

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case "today":
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case "week":
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      default:
        return null;
    }
  };

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const dateFilter = getDateFilter();
      
      let query = supabase.from("site_analytics").select("*");
      if (dateFilter) {
        query = query.gte("created_at", dateFilter);
      }
      
      const { data: events, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      // Process analytics
      const pageViews = events?.filter(e => e.event_type === "page_view").length || 0;
      const uniqueSessions = new Set(events?.map(e => e.session_id)).size;
      const searches = events?.filter(e => e.event_type === "recipe_search") || [];
      const saves = events?.filter(e => e.event_type === "recipe_save").length || 0;
      const nutritionAnalyses = events?.filter(e => e.event_type === "nutrition_analysis").length || 0;

      // Extract top ingredients from searches
      const ingredientCounts: Record<string, number> = {};
      searches.forEach(search => {
        const eventData = search.event_data as Record<string, any> | null;
        const ingredients = eventData?.ingredients || [];
        if (Array.isArray(ingredients)) {
          ingredients.forEach((ing: string) => {
            ingredientCounts[ing.toLowerCase()] = (ingredientCounts[ing.toLowerCase()] || 0) + 1;
          });
        }
      });

      const topIngredients = Object.entries(ingredientCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([ingredient, count]) => ({ ingredient, count }));

      setAnalytics({
        totalPageViews: pageViews,
        uniqueSessions: uniqueSessions,
        totalSearches: searches.length,
        totalRecipeSaves: saves,
        totalNutritionAnalyses: nutritionAnalyses,
        topIngredients,
        recentEvents: events?.slice(0, 20) || [],
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src={dishtailLogo} alt="Dishtail" className="w-8 h-8 object-contain" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-warm bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-xs">Site Analytics</p>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Date Range Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={dateRange === "today" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("today")}
          >
            Today
          </Button>
          <Button
            variant={dateRange === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("week")}
          >
            Last 7 Days
          </Button>
          <Button
            variant={dateRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("month")}
          >
            Last 30 Days
          </Button>
          <Button
            variant={dateRange === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange("all")}
          >
            All Time
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : analytics ? (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analytics.totalPageViews}</p>
                  <p className="text-sm text-muted-foreground">Page Views</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analytics.uniqueSessions}</p>
                  <p className="text-sm text-muted-foreground">Unique Sessions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Search className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analytics.totalSearches}</p>
                  <p className="text-sm text-muted-foreground">Searches</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Bookmark className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analytics.totalRecipeSaves}</p>
                  <p className="text-sm text-muted-foreground">Recipes Saved</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{analytics.totalNutritionAnalyses}</p>
                  <p className="text-sm text-muted-foreground">Nutrition Analyses</p>
                </CardContent>
              </Card>
            </div>

            {/* Top Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Top Searched Ingredients
                </CardTitle>
                <CardDescription>Most popular ingredients in recipe searches</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topIngredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analytics.topIngredients.map((item, index) => (
                      <div
                        key={item.ingredient}
                        className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1"
                      >
                        <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                        <span className="text-sm font-medium">{item.ingredient}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No search data yet</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest events on the site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {analytics.recentEvents.map((event, index) => (
                    <div
                      key={event.id || index}
                      className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          event.event_type === "page_view" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" :
                          event.event_type === "recipe_search" ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300" :
                          event.event_type === "recipe_save" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" :
                          "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                        }`}>
                          {event.event_type.replace("_", " ")}
                        </span>
                        <span className="text-muted-foreground truncate max-w-xs">
                          {event.page_path}
                          {(() => {
                            const eventData = event.event_data as Record<string, any> | null;
                            if (eventData?.ingredients && Array.isArray(eventData.ingredients)) {
                              return ` - ${eventData.ingredients.join(", ")}`;
                            }
                            if (eventData?.recipeTitle) {
                              return ` - ${eventData.recipeTitle}`;
                            }
                            return null;
                          })()}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Failed to load analytics</p>
        )}
      </main>
    </div>
  );
};

export default AdminStats;
