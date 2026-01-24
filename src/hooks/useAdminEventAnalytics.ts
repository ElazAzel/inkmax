import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/platform/supabase/client';
import { format, eachDayOfInterval } from 'date-fns';

export interface EventAnalyticsSummary {
  totalEvents: number;
  publishedEvents: number;
  completedEvents: number;
  totalParticipants: number;
  averageParticipants: number;
  totalRevenue: number;
  refundsCount: number;
  refundsAmount: number;
  freeEvents: number;
  paidEvents: number;
  proAdoption: number;
}

export interface EventAnalyticsSeriesPoint {
  date: string;
  created: number;
  published: number;
  completed: number;
  participants: number;
  revenue: number;
}

export interface EventOwnerStat {
  ownerId: string;
  events: number;
  participants: number;
}

export interface EventAnalyticsData {
  summary: EventAnalyticsSummary;
  series: EventAnalyticsSeriesPoint[];
  topOwners: EventOwnerStat[];
}

const isEventCompleted = (event: any, now: Date) => {
  if (event.registration_closes_at && new Date(event.registration_closes_at) <= now) return true;
  if (!event.registration_closes_at && event.end_at && new Date(event.end_at) <= now) return true;
  if (!event.registration_closes_at && !event.end_at && event.status === 'closed') return true;
  return false;
};

const eventHasProFields = (formSchema: any[]) =>
  Array.isArray(formSchema) && formSchema.some((field) => field.type === 'media' || field.type === 'file');

async function fetchEventAnalytics(from?: string, to?: string): Promise<EventAnalyticsData> {
  const now = new Date();
  const startDate = from ? new Date(from) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  const endDate = to ? new Date(to) : now;

  const [{ data: events }, { data: registrations }] = await Promise.all([
    supabase
      .from('events')
      .select('id, owner_id, status, is_paid, registration_closes_at, end_at, created_at, form_schema_json, price_amount, currency')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
    supabase
      .from('event_registrations')
      .select('id, event_id, status, payment_status, paid_amount, currency, created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString()),
  ]);

  const eventsList = events || [];
  const registrationsList = registrations || [];
  const eventMap = new Map(eventsList.map((event) => [event.id, event]));

  const totalEvents = eventsList.length;
  const publishedEvents = eventsList.filter((event) => event.status === 'published').length;
  const completedEvents = eventsList.filter((event) => isEventCompleted(event, now)).length;
  const freeEvents = eventsList.filter((event) => !event.is_paid).length;
  const paidEvents = eventsList.filter((event) => event.is_paid).length;
  const proAdoption = eventsList.filter((event) => event.is_paid || eventHasProFields(event.form_schema_json)).length;

  const confirmedRegistrations = registrationsList.filter((registration) => {
    if (registration.status !== 'confirmed') return false;
    const event = eventMap.get(registration.event_id);
    if (!event) return false;
    if (event.is_paid) return registration.payment_status === 'paid';
    return true;
  });

  const totalParticipants = confirmedRegistrations.length;
  const totalRevenue = registrationsList.reduce((sum, registration) => {
    if (registration.payment_status === 'paid') {
      return sum + Number(registration.paid_amount || 0);
    }
    return sum;
  }, 0);

  const refunds = registrationsList.filter((registration) => registration.payment_status === 'refunded');
  const refundsCount = refunds.length;
  const refundsAmount = refunds.reduce((sum, registration) => sum + Number(registration.paid_amount || 0), 0);

  const averageParticipants = completedEvents > 0 ? Math.round(totalParticipants / completedEvents) : 0;

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  const series = dateRange.map((date) => {
    const dayKey = format(date, 'yyyy-MM-dd');
    const dayEvents = eventsList.filter((event) => event.created_at?.startsWith(dayKey));
    const dayRegistrations = registrationsList.filter((reg) => reg.created_at?.startsWith(dayKey));
    const dayParticipants = dayRegistrations.filter((reg) => {
      if (reg.status !== 'confirmed') return false;
      const event = eventMap.get(reg.event_id);
      if (!event) return false;
      if (event.is_paid) return reg.payment_status === 'paid';
      return true;
    });
    const dayRevenue = dayRegistrations.reduce((sum, reg) => {
      if (reg.payment_status === 'paid') return sum + Number(reg.paid_amount || 0);
      return sum;
    }, 0);

    return {
      date: format(date, 'dd.MM'),
      created: dayEvents.length,
      published: dayEvents.filter((event) => event.status === 'published').length,
      completed: dayEvents.filter((event) => isEventCompleted(event, now)).length,
      participants: dayParticipants.length,
      revenue: dayRevenue,
    };
  });

  const ownerStatsMap = new Map<string, EventOwnerStat>();
  eventsList.forEach((event) => {
    const existing = ownerStatsMap.get(event.owner_id) || { ownerId: event.owner_id, events: 0, participants: 0 };
    existing.events += 1;
    ownerStatsMap.set(event.owner_id, existing);
  });
  confirmedRegistrations.forEach((registration) => {
    const event = eventMap.get(registration.event_id);
    if (!event) return;
    const existing = ownerStatsMap.get(event.owner_id) || { ownerId: event.owner_id, events: 0, participants: 0 };
    existing.participants += 1;
    ownerStatsMap.set(event.owner_id, existing);
  });

  const topOwners = Array.from(ownerStatsMap.values())
    .sort((a, b) => b.participants - a.participants)
    .slice(0, 5);

  return {
    summary: {
      totalEvents,
      publishedEvents,
      completedEvents,
      totalParticipants,
      averageParticipants,
      totalRevenue,
      refundsCount,
      refundsAmount,
      freeEvents,
      paidEvents,
      proAdoption,
    },
    series,
    topOwners,
  };
}

export function useAdminEventAnalytics(from?: string, to?: string) {
  return useQuery({
    queryKey: ['admin-event-analytics', from, to],
    queryFn: () => fetchEventAnalytics(from, to),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
}
