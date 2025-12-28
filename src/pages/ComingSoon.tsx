import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ChefHat, Utensils, Timer, Sparkles } from "lucide-react";

const ComingSoon = () => {
  const [searchParams] = useSearchParams();
  const feature = searchParams.get("feature") || "this feature";

  const featureNames: Record<string, string> = {
    "buy-ingredients": "Buy Ingredients",
    "order-dish": "Order Dish",
  };

  const displayFeature = featureNames[feature] || feature;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-primary/20 shadow-soft overflow-hidden">
        <div className="bg-gradient-warm p-6 text-center">
          <div className="flex justify-center gap-2 mb-4">
            <ChefHat className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: "0ms" }} />
            <Utensils className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: "150ms" }} />
            <Timer className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            🍳 Page is Cooking! 🍳
          </h1>
          <p className="text-white/90 text-lg">
            {displayFeature} is simmering on the stove...
          </p>
        </div>
        
        <CardContent className="p-6 sm:p-8 text-center space-y-6">
          <div className="relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            
            <p className="text-muted-foreground text-lg leading-relaxed pt-4">
              The feature behind this button is on the stove right now – we're chopping features,
              stirring in ideas, and tasting the UX.
            </p>
            
            <p className="text-foreground font-medium mt-4">
              Soon you'll be able to <span className="text-primary font-bold">buy ingredients</span> and{" "}
              <span className="text-primary font-bold">order dishes</span> straight from DishTail!
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              <span className="text-2xl">👨‍🍳</span>
              <span>Our chef-developers are working hard to bring you this delicious feature!</span>
              <span className="text-2xl">👩‍🍳</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link to="/">
              <Button className="bg-gradient-warm hover:opacity-90 gap-2">
                <Home className="w-4 h-4" />
                Back to Recipes
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="gap-2">
                Got Ideas? Contact Us
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComingSoon;
