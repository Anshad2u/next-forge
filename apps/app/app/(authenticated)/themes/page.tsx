"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { cn } from "@repo/design-system/lib/utils";
import { CheckIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

const THEMES = [
  { name: "Default", value: "default", color: "oklch(0.488 0.243 264.376)" },
  { name: "Blue", value: "theme-blue", color: "oklch(0.55 0.2 260)" },
  { name: "Green", value: "theme-green", color: "oklch(0.55 0.18 155)" },
  { name: "Violet", value: "theme-violet", color: "oklch(0.55 0.22 290)" },
  { name: "Orange", value: "theme-orange", color: "oklch(0.65 0.2 50)" },
  { name: "Rose", value: "theme-rose", color: "oklch(0.55 0.22 15)" },
];

const ThemesPage = () => {
  const { theme, setTheme } = useTheme();
  const [colorTheme, setColorTheme] = useState("default");

  useEffect(() => {
    const saved = localStorage.getItem("color-theme");
    if (saved) {
      setColorTheme(saved);
      if (saved !== "default") {
        document.documentElement.classList.add(saved);
      }
    }
  }, []);

  const handleColorTheme = useCallback((value: string) => {
    setColorTheme(value);
    const root = document.documentElement;
    for (const t of THEMES) {
      if (t.value !== "default") {
        root.classList.remove(t.value);
      }
    }
    if (value !== "default") {
      root.classList.add(value);
    }
    localStorage.setItem("color-theme", value);
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Themes</h1>
        <p className="text-muted-foreground">
          Customize the look and feel of your dashboard.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mode</CardTitle>
          <CardDescription>Switch between light and dark mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
            >
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
            >
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              onClick={() => setTheme("system")}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <CardDescription>
            Choose a color theme for the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 text-left transition-all hover:shadow-md",
                  colorTheme === t.value &&
                    "border-primary ring-2 ring-primary"
                )}
                onClick={() => handleColorTheme(t.value)}
                type="button"
              >
                <div
                  className="h-8 w-8 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                <p className="text-sm font-medium">{t.name}</p>
                {colorTheme === t.value && (
                  <CheckIcon className="ml-auto h-4 w-4 text-primary" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemesPage;
