import { supabase } from '@/platform/supabase/client';
import type { EventBlock } from '@/types/page';

const mapEventBlockToRecord = (block: EventBlock, pageId: string, ownerId: string) => ({
  id: block.eventId,
  block_id: block.id,
  page_id: pageId,
  owner_id: ownerId,
  title_i18n_json: block.title,
  description_i18n_json: block.description || {},
  cover_url: block.coverUrl || null,
  start_at: block.startAt || null,
  end_at: block.endAt || null,
  timezone: block.timezone || null,
  registration_closes_at: block.registrationClosesAt || null,
  location_type: block.locationType || null,
  location_value: block.locationValue || null,
  is_paid: Boolean(block.isPaid),
  price_amount: block.price ?? null,
  currency: block.currency || null,
  capacity: block.capacity ?? null,
  status: block.status || 'draft',
  form_schema_json: block.formFields || [],
  settings_json: block.settings || {},
});

export async function syncEventBlock(block: EventBlock, pageId?: string, ownerId?: string) {
  if (!pageId || !ownerId) return;
  try {
    await supabase.from('events').upsert(mapEventBlockToRecord(block, pageId, ownerId));
  } catch (error) {
    console.error('Failed to sync event block', error);
  }
}

export async function deleteEventBlock(eventId?: string, ownerId?: string) {
  if (!eventId || !ownerId) return;
  try {
    await supabase.from('events').delete().eq('id', eventId).eq('owner_id', ownerId);
  } catch (error) {
    console.error('Failed to delete event block', error);
  }
}
