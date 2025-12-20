import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Generate or retrieve a persistent session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("dishtail-session-id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("dishtail-session-id", sessionId);
  }
  return sessionId;
};

interface TrackEventOptions {
  eventType: string;
  eventData?: Record<string, any>;
  pagePath?: string;
}

export const useAnalytics = () => {
  const sessionId = useRef(getSessionId());
  const hasTrackedPageView = useRef(false);

  const trackEvent = useCallback(async ({ eventType, eventData = {}, pagePath }: TrackEventOptions) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("site_analytics").insert({
        event_type: eventType,
        event_data: eventData,
        session_id: sessionId.current,
        user_id: user?.id || null,
        page_path: pagePath || window.location.pathname,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
      });
    } catch (error) {
      // Silently fail - don't break the app for analytics
      console.error("Analytics tracking failed:", error);
    }
  }, []);

  const trackPageView = useCallback((pagePath?: string) => {
    trackEvent({
      eventType: "page_view",
      pagePath: pagePath || window.location.pathname,
    });
  }, [trackEvent]);

  const trackSearch = useCallback((ingredients: string[], cuisine: string) => {
    trackEvent({
      eventType: "recipe_search",
      eventData: { ingredients, cuisine, ingredientCount: ingredients.length },
    });
  }, [trackEvent]);

  const trackRecipeView = useCallback((recipeTitle: string) => {
    trackEvent({
      eventType: "recipe_view",
      eventData: { recipeTitle },
    });
  }, [trackEvent]);

  const trackRecipeSave = useCallback((recipeTitle: string) => {
    trackEvent({
      eventType: "recipe_save",
      eventData: { recipeTitle },
    });
  }, [trackEvent]);

  const trackNutritionAnalysis = useCallback((recipeTitle: string) => {
    trackEvent({
      eventType: "nutrition_analysis",
      eventData: { recipeTitle },
    });
  }, [trackEvent]);

  // Auto-track page view on mount (once per component instance)
  useEffect(() => {
    if (!hasTrackedPageView.current) {
      hasTrackedPageView.current = true;
      trackPageView();
    }
  }, [trackPageView]);

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackRecipeView,
    trackRecipeSave,
    trackNutritionAnalysis,
  };
};
