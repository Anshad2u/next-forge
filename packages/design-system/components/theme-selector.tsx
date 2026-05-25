"use client";

import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";

const themes = [
  { value: "default", label: "Default" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "violet", label: "Violet" },
  { value: "orange", label: "Orange" },
  { value: "rose", label: "Rose" },
];

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const currentColor =
    themes.find((t) => theme?.includes(t.value))?.value || "default";

  const handleThemeChange = (newTheme: string) => {
    const isDark = theme?.includes("dark") || theme === "dark";
    setTheme(isDark ? `${newTheme}-dark` : newTheme);
  };

  return (
    <Select value={currentColor} onValueChange={handleThemeChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {themes.map((t) => (
          <SelectItem key={t.value} value={t.value}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
