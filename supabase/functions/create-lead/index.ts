import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pageOwnerId, name, email, phone, source, notes, metadata } = await req.json();

    if (!pageOwnerId || !name) {
      return new Response(
        JSON.stringify({ error: "pageOwnerId and name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate pageOwnerId is a valid UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(pageOwnerId)) {
      return new Response(
        JSON.stringify({ error: "Invalid pageOwnerId format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify that the page owner exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', pageOwnerId)
      .maybeSingle();

    if (profileError || !profile) {
      console.error('Invalid page owner:', pageOwnerId);
      return new Response(
        JSON.stringify({ error: "Invalid page owner" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the lead
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        user_id: pageOwnerId,
        name: name.trim().substring(0, 255),
        email: email?.trim().substring(0, 255) || null,
        phone: phone?.trim().substring(0, 50) || null,
        source: source || 'form',
        status: 'new',
        notes: notes?.substring(0, 1000) || null,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      return new Response(
        JSON.stringify({ error: "Failed to create lead" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Lead created for user ${pageOwnerId}: ${lead.id}`);

    return new Response(
      JSON.stringify({ success: true, leadId: lead.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in create-lead:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
