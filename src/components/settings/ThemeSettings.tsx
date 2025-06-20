import React from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const ThemeSettings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Label htmlFor="theme-toggle">Tema Escuro</Label>
          <span className="text-sm text-muted-foreground">
            Alterna entre tema claro e escuro
          </span>
        </div>
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </div>
    </div>
  );
};
