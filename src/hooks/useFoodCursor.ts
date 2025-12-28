import { useState, useEffect, useCallback } from "react";
import { getRandomFoodCursor } from "@/components/FoodCursors";

export const useFoodCursor = (enabled: boolean) => {
  const [currentCursor, setCurrentCursor] = useState<string>("");

  const changeCursor = useCallback(() => {
    if (!enabled) return;
    const newCursor = getRandomFoodCursor();
    setCurrentCursor(newCursor);
  }, [enabled]);

  // Initial cursor and rotation every 8 seconds
  useEffect(() => {
    if (!enabled) {
      setCurrentCursor("");
      return;
    }

    changeCursor();
    const interval = setInterval(changeCursor, 8000);
    return () => clearInterval(interval);
  }, [enabled, changeCursor]);

  // Change cursor on click
  useEffect(() => {
    if (!enabled) return;

    const handleClick = () => {
      changeCursor();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [enabled, changeCursor]);

  // Apply cursor to document
  useEffect(() => {
    if (!enabled || !currentCursor) {
      document.documentElement.style.removeProperty("--food-cursor");
      return;
    }

    document.documentElement.style.setProperty("--food-cursor", currentCursor);
  }, [enabled, currentCursor]);

  return { currentCursor, changeCursor };
};
