import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW = 60;

async function checkRateLimit(supabase: SupabaseClient, ipAddress: string, endpoint: string): Promise<boolean> {
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW * 1000);
  await supabase
    .from('rate_limits')
    .delete()
    .lt('window_start', windowStart.toISOString());

  const { data: existing } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('ip_address', ipAddress)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (existing) {
    if (existing.request_count >= RATE_LIMIT_REQUESTS) {
      return false;
    }

    await supabase
      .from('rate_limits')
      .update({ request_count: existing.request_count + 1 })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('rate_limits')
      .insert({
        ip_address: ipAddress,
        endpoint,
        request_count: 1,
        window_start: new Date().toISOString(),
      });
  }

  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ipAddress =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceClient = createClient(supabaseUrl, serviceKey);

    const allowed = await checkRateLimit(serviceClient, ipAddress, 'register-event');
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const {
      eventId,
      blockId,
      pageId,
      ownerId,
      attendeeEmail,
      attendeeName,
      attendeePhone,
      answers,
      utm,
    } = await req.json();

    if (!eventId || !blockId || !pageId || !ownerId || !attendeeEmail) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const email = String(attendeeEmail).trim().toLowerCase();
    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Invalid email' }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authHeader = req.headers.get('Authorization') || '';
    let userId: string | null = null;
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: authData } = await authClient.auth.getUser();
    if (authData?.user?.id) {
      userId = authData.user.id;
    }

    const { data: event, error: eventError } = await serviceClient
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('owner_id', ownerId)
      .eq('page_id', pageId)
      .eq('block_id', blockId)
      .maybeSingle();

    if (eventError || !event) {
      return new Response(
        JSON.stringify({ error: 'Event not found' }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (event.status !== 'published') {
      return new Response(
        JSON.stringify({ error: 'Event is not published' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (event.registration_closes_at && new Date(event.registration_closes_at) <= new Date()) {
      return new Response(
        JSON.stringify({ error: 'Registration closed' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (event.capacity) {
      const { count } = await serviceClient
        .from('event_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .in('status', ['confirmed', 'pending']);

      if (typeof count === 'number' && count >= event.capacity) {
        return new Response(
          JSON.stringify({ error: 'Capacity reached' }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (event.is_paid) {
      return new Response(
        JSON.stringify({ error: 'Payment required' }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: ownerProfile } = await serviceClient
      .from('user_profiles')
      .select('is_premium, trial_ends_at')
      .eq('id', ownerId)
      .maybeSingle();

    const isOwnerPremium =
      ownerProfile?.is_premium ||
      (ownerProfile?.trial_ends_at && new Date(ownerProfile.trial_ends_at) > new Date());

    const requireApproval = Boolean(event.settings_json?.requireApproval);
    const allowDuplicateEmail = Boolean(event.settings_json?.allowDuplicateEmail);

    if (!allowDuplicateEmail) {
      const { data: existing } = await serviceClient
        .from('event_registrations')
        .select('id')
        .eq('event_id', eventId)
        .eq('attendee_email', email)
        .maybeSingle();

      if (existing?.id) {
        return new Response(
          JSON.stringify({ error: 'Duplicate registration', code: 'duplicate' }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const { data: registration, error: registrationError } = await serviceClient
      .from('event_registrations')
      .insert({
        event_id: eventId,
        block_id: blockId,
        page_id: pageId,
        owner_id: ownerId,
        user_id: userId,
        attendee_name: attendeeName || email.split('@')[0] || 'Guest',
        attendee_email: email,
        attendee_phone: attendeePhone || null,
        answers_json: answers || {},
        status: requireApproval ? 'pending' : 'confirmed',
        payment_status: 'none',
        utm_json: isOwnerPremium ? (utm || {}) : {},
      })
      .select('id')
      .single();

    if (registrationError) {
      const code = registrationError.code === '23505' ? 'duplicate' : 'failed';
      return new Response(
        JSON.stringify({ error: registrationError.message, code }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: ticket } = await serviceClient
      .from('event_tickets')
      .select('ticket_code')
      .eq('registration_id', registration.id)
      .maybeSingle();

    return new Response(
      JSON.stringify({ success: true, ticketCode: ticket?.ticket_code || null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in register-event:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
