import React, { useState } from 'react';
import { CalendarEvent } from '../../types/google-calendar';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useGoogleCalendar } from '../../hooks/useGoogleCalendar';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface GoogleCalendarEventCardProps {
  event: CalendarEvent;
}

export const GoogleCalendarEventCard: React.FC<GoogleCalendarEventCardProps> = ({ event }) => {
  const { updateBirthdayEvent, deleteEvent, isLoading } = useGoogleCalendar();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Check if this is a Google birthday event (has restrictions)
  const isBirthdayEvent = event.id?.includes('_') && event.created && event.creator?.email?.includes('calendar-notification@google.com');
  const [editedSummary, setEditedSummary] = useState(event.summary || '');
  const [editedDescription, setEditedDescription] = useState(event.description || '');
  const [editedTime, setEditedTime] = useState('');
  const [editedDate, setEditedDate] = useState('');

  React.useEffect(() => {
    if (event.start?.dateTime) {
      const startDate = parseISO(event.start.dateTime);
      setEditedDate(format(startDate, 'yyyy-MM-dd'));
      setEditedTime(format(startDate, 'HH:mm'));
    }
  }, [event]);

  const formatEventDateTime = (dateTime?: string, date?: string): string => {
    if (dateTime) {
      const eventDate = parseISO(dateTime);
      return format(eventDate, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
    }
    if (date) {
      const eventDate = parseISO(date);
      return format(eventDate, "d 'de' MMMM", { locale: ptBR });
    }
    return 'Data não definida';
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Confirmado</Badge>;
      case 'tentative':
        return <Badge variant="secondary">Tentativo</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const handleSave = async () => {
    if (!editedDate || !editedTime) return;

    const startDateTime = new Date(`${editedDate}T${editedTime}:00`);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1); // 1 hour duration

    const success = await updateBirthdayEvent({
      eventId: event.id,
      summary: editedSummary,
      description: editedDescription,
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    });

    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const success = await deleteEvent(event.id);
    if (success) {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setEditedSummary(event.summary || '');
    setEditedDescription(event.description || '');
    if (event.start?.dateTime) {
      const startDate = parseISO(event.start.dateTime);
      setEditedDate(format(startDate, 'yyyy-MM-dd'));
      setEditedTime(format(startDate, 'HH:mm'));
    }
    setIsEditing(false);
  };

  return (
    <>
      <Card className="w-full transition-all duration-200 hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="font-semibold text-lg"
                  placeholder="Título do evento"
                />
              ) : (
                <CardTitle className="text-lg flex items-center gap-2">
                  {event.summary}
                  {getStatusBadge(event.status)}
                </CardTitle>
              )}
            </div>
            <div className="flex gap-2 ml-3">
              {!isBirthdayEvent && (
                isEditing ? (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSave}
                      disabled={isLoading || !editedDate || !editedTime}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      disabled={isLoading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      disabled={isLoading}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )
              )}
              {isBirthdayEvent && (
                <Badge variant="secondary" className="text-xs">
                  Evento Google
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                    className="w-auto"
                  />
                  <Input
                    type="time"
                    value={editedTime}
                    onChange={(e) => setEditedTime(e.target.value)}
                    className="w-auto"
                  />
                </div>
              ) : (
                <span>{formatEventDateTime(event.start?.dateTime, event.start?.date)}</span>
              )}
            </div>
            
            {event.created && !isEditing && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3" />
                <span>Criado em {format(parseISO(event.created), 'd/MM/yy', { locale: ptBR })}</span>
              </div>
            )}
          </div>

          {(event.description || isEditing) && (
            <div className="space-y-2">
              <CardDescription className="font-medium">Observações:</CardDescription>
              {isEditing ? (
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Adicione observações sobre o aniversário..."
                  rows={3}
                />
              ) : (
                <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
                  {event.description || 'Nenhuma observação'}
                </p>
              )}
            </div>
          )}

          {event.organizer && !isEditing && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <span>Organizado por: {event.organizer.displayName || event.organizer.email}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Excluir Evento
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o evento "{event.summary}"? Esta ação não pode ser desfeita e o evento será removido do Google Calendar.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};