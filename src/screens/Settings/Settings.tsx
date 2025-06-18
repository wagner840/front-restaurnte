import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useTheme } from "../../contexts/ThemeContext";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Configurações
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Personalize as configurações do seu restaurante
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-switch">Tema Escuro</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ative para uma experiência com menos brilho.
                </p>
              </div>
              <Switch
                id="theme-switch"
                checked={theme === "dark"}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
