import { useState, useEffect } from "react";
import { Palette, Sun, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "festive";

const themes = [
  { id: "light" as Theme, name: "Light", icon: Sun, description: "Warm orange" },
  { id: "dark" as Theme, name: "Dark", icon: Moon, description: "Dark mode" },
  { id: "festive" as Theme, name: "Festive", icon: Sparkles, description: "Green & red" },
];

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("dishtail-theme") as Theme | null;
    if (savedTheme && ["light", "dark", "festive"].includes(savedTheme)) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("dark", "theme-festive");
    
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "festive") {
      root.classList.add("theme-festive");
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("dishtail-theme", newTheme);
    applyTheme(newTheme);
  };

  const currentTheme = themes.find((t) => t.id === theme);
  const CurrentIcon = currentTheme?.icon || Palette;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <CurrentIcon className="w-4 h-4" />
          <span className="hidden sm:inline sr-only">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => handleThemeChange(t.id)}
            className={`flex items-center gap-2 cursor-pointer ${
              theme === t.id ? "bg-primary/10 text-primary" : ""
            }`}
          >
            <t.icon className="w-4 h-4" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{t.name}</span>
              <span className="text-xs text-muted-foreground">{t.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
