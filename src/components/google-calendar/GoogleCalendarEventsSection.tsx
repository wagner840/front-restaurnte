import React, { useState } from 'react';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { useCalendarSyncContext } from './CalendarSyncProvider';
import { GoogleCalendarEventCard } from './GoogleCalendarEventCard';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { AlertTriangle, Calendar, RefreshCw, Bug, Zap, ZapOff } from 'lucide-react';
import { googleCalendarService } from '../../services/google-calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface GoogleCalendarEventsSectionProps {
  className?: string;
}

export const GoogleCalendarEventsSection: React.FC<GoogleCalendarEventsSectionProps> = ({ 
  className 
}) => {
  const { isAuthenticated } = useGoogleAuth();
  const { 
    events, 
    lastSyncTime,
    isSyncing,
    syncError,
    refreshEvents,
    isAutoSyncEnabled,
    toggleAutoSync
  } = useCalendarSyncContext();
  const [debugMode, setDebugMode] = useState(false);
  const [allEvents, setAllEvents] = useState<any[]>([]);

  const handleRefresh = () => {
    refreshEvents();
  };

  const handleDebugAllEvents = async () => {
    try {
      const now = new Date();
      const future = new Date();
      future.setMonth(future.getMonth() + 3); // Next 3 months
      
      const allCalendarEvents = await googleCalendarService.getAllEvents(
        now.toISOString(),
        future.toISOString()
      );
      
      setAllEvents(allCalendarEvents);
      setDebugMode(true);
      console.log('All events:', allCalendarEvents);
    } catch (error) {
      console.error('Failed to fetch all events:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`${className} space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Eventos do Google Calendar
          </h2>
        </div>
        <div className="bg-muted/30 p-6 rounded-lg text-center">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">
            Conecte-se ao Google Calendar para visualizar e gerenciar eventos de aniversários
          </p>
        </div>
      </div>
    );
  }

  if (syncError) {
    return (
      <div className={`${className} space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Eventos do Google Calendar
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
        <div className="bg-destructive/10 p-6 rounded-lg">
          <div className="flex items-center gap-3 text-destructive mb-3">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Erro ao carregar eventos</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{syncError}</p>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (isSyncing && events.length === 0) {
    return (
      <div className={`${className} space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Eventos do Google Calendar
          </h2>
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="grid gap-4 sm:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Eventos do Google Calendar
          {events.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({events.length} {events.length === 1 ? 'evento' : 'eventos'})
            </span>
          )}
        </h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleAutoSync}
              disabled={isSyncing}
            >
              {isAutoSyncEnabled ? (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Auto-Sync
                </>
              ) : (
                <>
                  <ZapOff className="h-4 w-4 mr-2" />
                  Manual
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDebugAllEvents}
              disabled={isSyncing}
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug
            </Button>
          </div>
          
          {/* Sync Status */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {isSyncing && (
              <Badge variant="secondary" className="animate-pulse">
                Sincronizando...
              </Badge>
            )}
            {lastSyncTime && !isSyncing && (
              <Badge variant="outline">
                Última sync: {format(lastSyncTime, 'HH:mm:ss', { locale: ptBR })}
              </Badge>
            )}
            {isAutoSyncEnabled && !isSyncing && (
              <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Auto-sync ativo
              </Badge>
            )}
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-card/50 p-8 rounded-lg text-center border-2 border-dashed border-muted">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            Não há eventos de aniversário agendados no seu Google Calendar para os próximos 30 dias.
          </p>
          <Button variant="outline" onClick={handleRefresh} disabled={isSyncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            Verificar novamente
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
          {events.map((event) => (
            <GoogleCalendarEventCard
              key={event.id}
              event={event}
            />
          ))}
        </div>
      )}

      {isSyncing && events.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Atualizando eventos...
          </div>
        </div>
      )}

      {/* Debug Section */}
      {debugMode && (
        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Debug: Todos os Eventos</h3>
            <Button variant="outline" size="sm" onClick={() => setDebugMode(false)}>
              Fechar Debug
            </Button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {allEvents.map((event, index) => (
              <div key={index} className="bg-background p-3 rounded border text-sm">
                <div><strong>Título:</strong> {event.summary || 'Sem título'}</div>
                <div><strong>Data:</strong> {event.start?.dateTime || event.start?.date || 'Sem data'}</div>
                <div><strong>Descrição:</strong> {event.description || 'Sem descrição'}</div>
                <div><strong>ID:</strong> {event.id}</div>
              </div>
            ))}
            {allEvents.length === 0 && (
              <p className="text-muted-foreground">Nenhum evento encontrado no debug.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};