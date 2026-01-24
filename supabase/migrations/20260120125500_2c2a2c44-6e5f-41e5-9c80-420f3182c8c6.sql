-- Allow configurable duplicate registrations per event
ALTER TABLE public.event_registrations
  DROP CONSTRAINT IF EXISTS event_registrations_event_id_attendee_email_key;

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_email
  ON public.event_registrations (event_id, attendee_email);
