import { CalendarEvent, CreateEventRequest, UpdateEventRequest } from '../types/google-calendar';
import { googleAuthService } from './google-auth';

declare global {
  interface Window {
    gapi: any;
  }
}

class GoogleCalendarService {
  private readonly CALENDAR_ID = 'e55f85ed9e44ed44ceefa973315d0de21852d611b91db8f2dc35d36d39db6576@group.calendar.google.com';

  private async ensureAuthenticated(): Promise<void> {
    const authState = googleAuthService.getAuthState();
    if (!authState.isSignedIn || !authState.accessToken) {
      throw new Error('User not authenticated with Google');
    }

    // Set the access token for gapi client
    window.gapi.client.setToken({
      access_token: authState.accessToken
    });

    if (googleAuthService.isTokenExpired()) {
      const newToken = await googleAuthService.refreshToken();
      if (newToken) {
        window.gapi.client.setToken({
          access_token: newToken
        });
      }
    }
  }

  async listBirthdayEvents(
    timeMin?: string, 
    timeMax?: string
  ): Promise<CalendarEvent[]> {
    await this.ensureAuthenticated();

    try {
      // Get all events first, then filter them
      const response = await window.gapi.client.calendar.events.list({
        calendarId: this.CALENDAR_ID,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250 // Get more events to filter
      });

      const allEvents = response.result.items || [];
      return this.filterBirthdayEvents(allEvents);
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async getAllEvents(
    timeMin?: string, 
    timeMax?: string
  ): Promise<CalendarEvent[]> {
    await this.ensureAuthenticated();

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: this.CALENDAR_ID,
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250
      });

      return response.result.items || [];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      throw new Error('Failed to fetch calendar events');
    }
  }

  async createBirthdayEvent(request: CreateEventRequest): Promise<CalendarEvent> {
    await this.ensureAuthenticated();

    const event = {
      summary: request.summary,
      description: request.description || '',
      start: {
        dateTime: request.startDateTime,
        timeZone: request.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: request.endDateTime,
        timeZone: request.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    };

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: this.CALENDAR_ID,
        resource: event,
      });

      return response.result;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      throw new Error('Failed to create calendar event');
    }
  }

  async updateBirthdayEvent(request: UpdateEventRequest): Promise<CalendarEvent> {
    await this.ensureAuthenticated();

    try {
      // First, get the existing event
      const existingEvent = await window.gapi.client.calendar.events.get({
        calendarId: this.CALENDAR_ID,
        eventId: request.eventId,
      });

      const updatedEvent = {
        ...existingEvent.result,
        summary: request.summary || existingEvent.result.summary,
        description: request.description !== undefined ? request.description : existingEvent.result.description,
      };

      // Update start and end times if provided
      if (request.startDateTime) {
        updatedEvent.start = {
          dateTime: request.startDateTime,
          timeZone: request.timeZone || existingEvent.result.start.timeZone,
        };
      }

      if (request.endDateTime) {
        updatedEvent.end = {
          dateTime: request.endDateTime,
          timeZone: request.timeZone || existingEvent.result.end.timeZone,
        };
      }

      const response = await window.gapi.client.calendar.events.update({
        calendarId: this.CALENDAR_ID,
        eventId: request.eventId,
        resource: updatedEvent,
      });

      return response.result;
    } catch (error: any) {
      console.error('Failed to update calendar event:', error);
      
      // Check if it's a birthday event restriction
      if (error?.result?.error?.errors?.[0]?.reason === 'eventTypeRestriction') {
        throw new Error('Eventos de aniversário do Google têm restrições de edição. Algumas propriedades não podem ser alteradas.');
      }
      
      throw new Error('Failed to update calendar event');
    }
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.ensureAuthenticated();

    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: this.CALENDAR_ID,
        eventId: eventId,
      });
    } catch (error: any) {
      console.error('Failed to delete calendar event:', error);
      
      // Check if it's a birthday event restriction
      if (error?.result?.error?.errors?.[0]?.reason === 'eventTypeRestriction') {
        throw new Error('Não é possível excluir eventos de aniversário do Google. Você pode editá-los, mas não excluí-los.');
      }
      
      throw new Error('Failed to delete calendar event');
    }
  }

  async getEvent(eventId: string): Promise<CalendarEvent> {
    await this.ensureAuthenticated();

    try {
      const response = await window.gapi.client.calendar.events.get({
        calendarId: this.CALENDAR_ID,
        eventId: eventId,
      });

      return response.result;
    } catch (error) {
      console.error('Failed to get calendar event:', error);
      throw new Error('Failed to get calendar event');
    }
  }

  // Utility method to create birthday event from customer data
  async createBirthdayEventFromCustomer(
    customerName: string,
    birthday: string,
    customTime?: string,
    notes?: string
  ): Promise<CalendarEvent> {
    const birthdayDate = new Date(birthday);
    const currentYear = new Date().getFullYear();
    
    // Set the birthday for the current year
    birthdayDate.setFullYear(currentYear);
    
    // If the birthday has already passed this year, set it for next year
    if (birthdayDate < new Date()) {
      birthdayDate.setFullYear(currentYear + 1);
    }

    // Set time (default to 10:00 AM if not specified)
    const timeToSet = customTime || '10:00';
    const [hours, minutes] = timeToSet.split(':').map(Number);
    birthdayDate.setHours(hours, minutes, 0, 0);

    const endTime = new Date(birthdayDate);
    endTime.setHours(hours + 1, minutes, 0, 0); // 1 hour duration

    const request: CreateEventRequest = {
      summary: `🎂 Aniversário de ${customerName}`,
      description: notes ? `Observações: ${notes}` : `Aniversário do cliente ${customerName}`,
      startDateTime: birthdayDate.toISOString(),
      endDateTime: endTime.toISOString(),
    };

    return await this.createBirthdayEvent(request);
  }

  // Filter events to find birthday-related ones
  filterBirthdayEvents(events: CalendarEvent[]): CalendarEvent[] {
    const birthdayKeywords = [
      'aniversário', 'aniversario', 'birthday', '🎂', 
      'aniver', 'niver', 'bday', 'parabéns', 'parabens',
      'anniversary', 'festa', 'celebração', 'celebracao'
    ];
    
    return events.filter(event => {
      const summary = (event.summary || '').toLowerCase();
      const description = (event.description || '').toLowerCase();
      
      return birthdayKeywords.some(keyword => 
        summary.includes(keyword.toLowerCase()) || 
        description.includes(keyword.toLowerCase())
      );
    });
  }

  // Get upcoming birthday events in the next 90 days (extended range)
  async getUpcomingBirthdays(): Promise<CalendarEvent[]> {
    const now = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(now.getDate() + 90); // Extended to 90 days to catch Sept 12

    const events = await this.listBirthdayEvents(
      now.toISOString(),
      ninetyDaysFromNow.toISOString()
    );

    return events; // Already filtered in listBirthdayEvents
  }
}

export const googleCalendarService = new GoogleCalendarService();