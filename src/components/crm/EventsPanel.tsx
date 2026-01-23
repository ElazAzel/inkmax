import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/platform/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { ru, kk, enUS } from 'date-fns/locale';
import { CalendarDays, Download, Ticket, Users } from 'lucide-react';
import { toast } from 'sonner';
import { getTranslatedString, type SupportedLanguage } from '@/lib/i18n-helpers';

interface EventRecord {
  id: string;
  title_i18n_json: any;
  start_at: string | null;
  status: string;
  registration_closes_at: string | null;
  form_schema_json: any[];
}

interface EventRegistration {
  id: string;
  attendee_name: string;
  attendee_email: string;
  attendee_phone: string | null;
  status: string;
  payment_status: string;
  created_at: string;
  answers_json: Record<string, any>;
  event_tickets: { ticket_code: string }[] | null;
}

export function EventsPanel() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);

  const locale = i18n.language === 'ru' ? ru : i18n.language === 'kk' ? kk : enUS;
  const language = i18n.language as SupportedLanguage;

  const fetchEvents = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('id, title_i18n_json, start_at, status, registration_closes_at, form_schema_json')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(t('events.fetchError', 'Не удалось загрузить ивенты'));
    } else {
      setEvents(data || []);
      if (!selectedEventId && data && data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchRegistrations = async (eventId: string) => {
    if (!user || !eventId) return;
    setLoadingRegistrations(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('id, attendee_name, attendee_email, attendee_phone, status, payment_status, created_at, answers_json, event_tickets(ticket_code)')
      .eq('owner_id', user.id)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(t('events.fetchRegistrationsError', 'Не удалось загрузить регистрации'));
    } else {
      setRegistrations((data as EventRegistration[]) || []);
    }
    setLoadingRegistrations(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [user]);

  useEffect(() => {
    if (selectedEventId) {
      fetchRegistrations(selectedEventId);
    }
  }, [selectedEventId]);

  const selectedEvent = events.find((event) => event.id === selectedEventId);

  const stats = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter((r) => r.status === 'confirmed').length;
    return { total, confirmed };
  }, [registrations]);

  const exportToCSV = () => {
    if (!selectedEvent || registrations.length === 0) {
      toast.error(t('events.noRegistrationsToExport', 'Нет регистраций для экспорта'));
      return;
    }

    const fields = selectedEvent.form_schema_json || [];
    const dynamicHeaders = fields.map((field: any) =>
      getTranslatedString(field.label_i18n, language) || field.id
    );

    const headers = [
      'Name',
      'Email',
      'Phone',
      'Status',
      'Payment',
      'Ticket',
      'Created',
      ...dynamicHeaders,
    ];

    const rows = registrations.map((registration) => {
      const answers = registration.answers_json || {};
      const values = fields.map((field: any) => {
        const value = answers[field.id];
        return Array.isArray(value) ? value.join(', ') : value ?? '';
      });
      const ticketCode = registration.event_tickets?.[0]?.ticket_code || '';
      return [
        registration.attendee_name,
        registration.attendee_email,
        registration.attendee_phone || '',
        registration.status,
        registration.payment_status,
        ticketCode,
        new Date(registration.created_at).toISOString().split('T')[0],
        ...values,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `event-${selectedEvent.id}-registrations.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success(t('events.exportSuccess', 'Экспорт завершен'));
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        {t('events.loading', 'Загружаем события...')}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        {t('events.empty', 'Событий пока нет.')}
      </div>
    );
  }

  return (
    <div className="px-5 py-4 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger className="min-w-[220px] rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {events.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {getTranslatedString(event.title_i18n_json, language) || t('events.event', 'Ивент')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          {t('events.exportCsv', 'Экспорт CSV')}
        </Button>
      </div>

      {selectedEvent && (
        <Card className="p-4 space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary">{selectedEvent.status}</Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              {selectedEvent.start_at
                ? format(parseISO(selectedEvent.start_at), 'dd MMMM yyyy, HH:mm', { locale })
                : t('events.noDate', 'Дата не задана')}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('events.totalRegistrations', 'Всего')}: {stats.total}
            </span>
            <span className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              {t('events.confirmedRegistrations', 'Подтверждено')}: {stats.confirmed}
            </span>
          </div>
        </Card>
      )}

      <ScrollArea className="h-[calc(100vh-420px)]">
        {loadingRegistrations ? (
          <div className="p-6 text-sm text-muted-foreground">
            {t('events.loadingRegistrations', 'Загружаем регистрации...')}
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((registration) => (
              <Card key={registration.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{registration.attendee_name}</div>
                    <div className="text-xs text-muted-foreground">{registration.attendee_email}</div>
                  </div>
                  <Badge variant="secondary">{registration.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('events.registeredAt', 'Регистрация')}: {new Date(registration.created_at).toLocaleString()}
                </div>
                {registration.attendee_phone && (
                  <div className="text-xs text-muted-foreground">
                    {t('events.phone', 'Телефон')}: {registration.attendee_phone}
                  </div>
                )}
                {registration.event_tickets?.[0]?.ticket_code && (
                  <div className="text-xs text-muted-foreground">
                    {t('events.ticketCode', 'Код билета')}: {registration.event_tickets[0].ticket_code}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
