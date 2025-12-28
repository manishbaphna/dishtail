import { useEffect, useState, useCallback } from "react";

const foodEmojis = ["🥕", "🍅", "🥑", "🍋", "🌶️", "🥦", "🍆", "🥭", "🍄", "🧄"];

interface FoodBurst {
  id: number;
  x: number;
  y: number;
  emojis: { emoji: string; angle: number; distance: number }[];
}

export const FoodClickEffect = ({ enabled }: { enabled: boolean }) => {
  const [bursts, setBursts] = useState<FoodBurst[]>([]);

  const createBurst = useCallback((e: MouseEvent) => {
    if (!enabled) return;

    const id = Date.now();
    const numEmojis = 4 + Math.floor(Math.random() * 3); // 4-6 emojis
    const emojis = Array.from({ length: numEmojis }, (_, i) => ({
      emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
      angle: (360 / numEmojis) * i + Math.random() * 30,
      distance: 30 + Math.random() * 40,
    }));

    setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY, emojis }]);

    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 600);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("click", createBurst);
    return () => document.removeEventListener("click", createBurst);
  }, [enabled, createBurst]);

  if (!enabled) return null;

  return (
    <>
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="fixed pointer-events-none z-[9999]"
          style={{ left: burst.x, top: burst.y }}
        >
          {burst.emojis.map((item, i) => (
            <span
              key={i}
              className="absolute animate-food-burst text-lg"
              style={{
                "--burst-angle": `${item.angle}deg`,
                "--burst-distance": `${item.distance}px`,
              } as React.CSSProperties}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      ))}
    </>
  );
};
