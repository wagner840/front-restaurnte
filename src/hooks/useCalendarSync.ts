import { useState, useEffect, useRef } from 'react';
import { CalendarEvent } from '../types/google-calendar';
import { googleCalendarService } from '../services/google-calendar';
import { useGoogleAuth } from './useGoogleAuth';

interface CalendarSyncConfig {
  enableAutoSync: boolean;
  syncInterval: number; // in milliseconds
  onEventsUpdated?: (events: CalendarEvent[]) => void;
  onSyncError?: (error: string) => void;
}

export const useCalendarSync = (config: CalendarSyncConfig) => {
  const { isAuthenticated } = useGoogleAuth();
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncRef = useRef<string | null>(null);

  const performSync = async (): Promise<CalendarEvent[]> => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }

    setIsSyncing(true);
    setSyncError(null);

    try {
      // Get upcoming birthday events
      const latestEvents = await googleCalendarService.getUpcomingBirthdays();
      
      // Check if events have changed by comparing JSON strings
      const eventsJson = JSON.stringify(latestEvents.map(e => ({
        id: e.id,
        summary: e.summary,
        updated: e.updated,
        status: e.status
      })));

      if (eventsJson !== lastSyncRef.current) {
        setEvents(latestEvents);
        setLastSyncTime(new Date());
        lastSyncRef.current = eventsJson;
        
        // Notify parent component of updates
        config.onEventsUpdated?.(latestEvents);
      }

      return latestEvents;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      setSyncError(errorMessage);
      config.onSyncError?.(errorMessage);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const startAutoSync = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (config.enableAutoSync && isAuthenticated) {
      // Perform initial sync
      performSync().catch(console.error);

      // Set up periodic sync
      intervalRef.current = setInterval(() => {
        performSync().catch(console.error);
      }, config.syncInterval);
    }
  };

  const stopAutoSync = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const manualSync = async (): Promise<CalendarEvent[]> => {
    return await performSync();
  };

  // Start/stop sync based on authentication and config
  useEffect(() => {
    if (isAuthenticated && config.enableAutoSync) {
      startAutoSync();
    } else {
      stopAutoSync();
    }

    return () => stopAutoSync();
  }, [isAuthenticated, config.enableAutoSync, config.syncInterval]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAutoSync();
  }, []);

  return {
    events,
    lastSyncTime,
    isSyncing,
    syncError,
    manualSync,
    startAutoSync,
    stopAutoSync,
    clearError: () => setSyncError(null)
  };
};