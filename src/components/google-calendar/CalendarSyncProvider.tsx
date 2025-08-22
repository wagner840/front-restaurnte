import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CalendarEvent } from '../../types/google-calendar';
import { useCalendarSync } from '../../hooks/useCalendarSync';
import { toast } from 'sonner';

interface CalendarSyncContextType {
  events: CalendarEvent[];
  lastSyncTime: Date | null;
  isSyncing: boolean;
  syncError: string | null;
  manualSync: () => Promise<CalendarEvent[]>;
  refreshEvents: () => void;
  isAutoSyncEnabled: boolean;
  toggleAutoSync: () => void;
}

const CalendarSyncContext = createContext<CalendarSyncContextType | undefined>(undefined);

interface CalendarSyncProviderProps {
  children: ReactNode;
  autoSyncInterval?: number;
}

export const CalendarSyncProvider: React.FC<CalendarSyncProviderProps> = ({ 
  children, 
  autoSyncInterval = 30000 // Default: 30 seconds
}) => {
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);

  const {
    events,
    lastSyncTime,
    isSyncing,
    syncError,
    manualSync,
    clearError
  } = useCalendarSync({
    enableAutoSync: isAutoSyncEnabled,
    syncInterval: autoSyncInterval,
    onEventsUpdated: (updatedEvents) => {
      // Show toast notification for new events
      const eventCount = updatedEvents.length;
      if (eventCount > 0) {
        toast.success(`Sincronização concluída: ${eventCount} evento(s) encontrado(s)`);
      }
    },
    onSyncError: (error) => {
      toast.error(`Erro na sincronização: ${error}`);
    }
  });

  const handleManualSync = async (): Promise<CalendarEvent[]> => {
    try {
      clearError();
      const result = await manualSync();
      toast.success('Sincronização manual concluída');
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na sincronização';
      toast.error(`Erro na sincronização: ${errorMessage}`);
      throw error;
    }
  };

  const refreshEvents = () => {
    handleManualSync().catch(console.error);
  };

  const toggleAutoSync = () => {
    setIsAutoSyncEnabled(prev => {
      const newState = !prev;
      toast.info(newState ? 'Sincronização automática ativada' : 'Sincronização automática desativada');
      return newState;
    });
  };

  const contextValue: CalendarSyncContextType = {
    events,
    lastSyncTime,
    isSyncing,
    syncError,
    manualSync: handleManualSync,
    refreshEvents,
    isAutoSyncEnabled,
    toggleAutoSync
  };

  return (
    <CalendarSyncContext.Provider value={contextValue}>
      {children}
    </CalendarSyncContext.Provider>
  );
};

export const useCalendarSyncContext = (): CalendarSyncContextType => {
  const context = useContext(CalendarSyncContext);
  if (!context) {
    throw new Error('useCalendarSyncContext must be used within a CalendarSyncProvider');
  }
  return context;
};