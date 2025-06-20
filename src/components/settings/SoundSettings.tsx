import React, { useState } from "react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

import { useTheme } from "../../contexts/ThemeContext";
import { testNotificationSound } from "../../lib/sounds";
import { Volume2, VolumeX, Play, CheckCircle, XCircle } from "lucide-react";

export const SoundSettings: React.FC = () => {
  const { soundEnabled, setSoundEnabled } = useTheme();
  const [isTestingSound, setIsTestingSound] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestSound = async () => {
    setIsTestingSound(true);
    setTestResult(null);
    
    try {
      const success = await testNotificationSound();
      setTestResult(success ? 'success' : 'error');
      
      // Limpar o resultado após 3 segundos
      setTimeout(() => setTestResult(null), 3000);
    } catch (error) {
      console.error('Erro ao testar som:', error);
      setTestResult('error');
      setTimeout(() => setTestResult(null), 3000);
    } finally {
      setIsTestingSound(false);
    }
  };

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
      
      {soundEnabled && (
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Testar Som</span>
            <span className="text-xs text-muted-foreground">
              Clique para testar se o som está funcionando corretamente
            </span>
          </div>
          <div className="flex items-center gap-2">
            {testResult === 'success' && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {testResult === 'error' && (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <button
              type="button"
              onClick={handleTestSound}
              disabled={isTestingSound}
              className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
            >
              <Play className="h-3 w-3" />
              {isTestingSound ? 'Testando...' : 'Testar Som'}
            </button>
          </div>
        </div>
      )}
      
      {testResult === 'error' && (
        <div className="p-3 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-200">
            <strong>Problema detectado:</strong> O som não pôde ser reproduzido. 
            Verifique se o volume do seu dispositivo está ativado e se o navegador 
            permite reprodução de áudio. Talvez seja necessário interagir com a página primeiro.
          </p>
        </div>
      )}
      
      {testResult === 'success' && (
        <div className="p-3 border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Teste bem-sucedido:</strong> O som está funcionando corretamente!
          </p>
        </div>
      )}
    </div>
  );
};
