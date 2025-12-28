import { useEffect, useState } from "react";

const floatingFoodEmojis = ["🥕", "🍅", "🥑", "🍋", "🌶️", "🥦", "🍆", "🥭", "🍄", "🧄", "🌽", "🥒"];

interface FloatingFood {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export const FloatingFoods = ({ enabled }: { enabled: boolean }) => {
  const [foods, setFoods] = useState<FloatingFood[]>([]);

  useEffect(() => {
    if (!enabled) {
      setFoods([]);
      return;
    }

    // Create 8 floating food items
    const newFoods: FloatingFood[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      emoji: floatingFoodEmojis[Math.floor(Math.random() * floatingFoodEmojis.length)],
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 20 + Math.random() * 15,
      size: 16 + Math.random() * 12,
    }));
    setFoods(newFoods);
  }, [enabled]);

  if (!enabled || foods.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {foods.map((food) => (
        <div
          key={food.id}
          className="absolute animate-float-food opacity-[0.08]"
          style={{
            left: `${food.left}%`,
            animationDelay: `${food.delay}s`,
            animationDuration: `${food.duration}s`,
            fontSize: `${food.size}px`,
          }}
        >
          {food.emoji}
        </div>
      ))}
    </div>
  );
};
