import { useState, useEffect } from 'react';
import { CalendarEvent, CreateEventRequest, UpdateEventRequest } from '../types/google-calendar';
import { googleCalendarService } from '../services/google-calendar';
import { useGoogleAuth } from './useGoogleAuth';

export const useGoogleCalendar = () => {
  const { isAuthenticated } = useGoogleAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBirthdayEvents = async (timeMin?: string, timeMax?: string) => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const birthdayEvents = await googleCalendarService.listBirthdayEvents(timeMin, timeMax);
      setEvents(birthdayEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch birthday events';
      setError(errorMessage);
      console.error('Error fetching birthday events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcomingBirthdays = async () => {
    if (!isAuthenticated) return;

    try {
      setIsLoading(true);
      setError(null);
      const upcomingEvents = await googleCalendarService.getUpcomingBirthdays();
      setEvents(upcomingEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch upcoming birthdays';
      setError(errorMessage);
      console.error('Error fetching upcoming birthdays:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createBirthdayEvent = async (request: CreateEventRequest): Promise<CalendarEvent | null> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const newEvent = await googleCalendarService.createBirthdayEvent(request);
      
      // Add the new event to the current events list
      setEvents(prev => [...prev, newEvent]);
      
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create birthday event';
      setError(errorMessage);
      console.error('Error creating birthday event:', err);
      return null;
    }
  };

  const createBirthdayEventFromCustomer = async (
    customerName: string,
    birthday: string,
    customTime?: string,
    notes?: string
  ): Promise<CalendarEvent | null> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const newEvent = await googleCalendarService.createBirthdayEventFromCustomer(
        customerName,
        birthday,
        customTime,
        notes
      );
      
      // Add the new event to the current events list
      setEvents(prev => [...prev, newEvent]);
      
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create birthday event';
      setError(errorMessage);
      console.error('Error creating birthday event from customer:', err);
      return null;
    }
  };

  const updateBirthdayEvent = async (request: UpdateEventRequest): Promise<CalendarEvent | null> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const updatedEvent = await googleCalendarService.updateBirthdayEvent(request);
      
      // Update the event in the current events list
      setEvents(prev => prev.map(event => 
        event.id === request.eventId ? updatedEvent : event
      ));
      
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update birthday event';
      setError(errorMessage);
      console.error('Error updating birthday event:', err);
      return null;
    }
  };

  const deleteEvent = async (eventId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return false;
    }

    try {
      setError(null);
      await googleCalendarService.deleteEvent(eventId);
      
      // Remove the event from the current events list
      setEvents(prev => prev.filter(event => event.id !== eventId));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      setError(errorMessage);
      console.error('Error deleting event:', err);
      return false;
    }
  };

  const getEvent = async (eventId: string): Promise<CalendarEvent | null> => {
    if (!isAuthenticated) {
      setError('User not authenticated');
      return null;
    }

    try {
      setError(null);
      const event = await googleCalendarService.getEvent(eventId);
      return event;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get event';
      setError(errorMessage);
      console.error('Error getting event:', err);
      return null;
    }
  };

  const refreshEvents = async () => {
    await fetchUpcomingBirthdays();
  };

  // Auto-fetch events when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUpcomingBirthdays();
    } else {
      setEvents([]);
      setError(null);
    }
  }, [isAuthenticated]);

  return {
    events,
    isLoading,
    error,
    fetchBirthdayEvents,
    fetchUpcomingBirthdays,
    createBirthdayEvent,
    createBirthdayEventFromCustomer,
    updateBirthdayEvent,
    deleteEvent,
    getEvent,
    refreshEvents,
    clearError: () => setError(null)
  };
};