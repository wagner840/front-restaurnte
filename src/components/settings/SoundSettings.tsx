import React from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useTheme } from "../../contexts/ThemeContext";
import { Volume2, VolumeX } from "lucide-react";

export const SoundSettings: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useTheme();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Label htmlFor="sound-toggle">Efeitos Sonoros</Label>
          <span className="text-sm text-muted-foreground">
            Ativa/desativa sons de notificação para novos pedidos
          </span>
        </div>
        <div className="flex items-center gap-2">
          {soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          <Switch
            id="sound-toggle"
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
        </div>
      </div>
    </div>
  );
};
