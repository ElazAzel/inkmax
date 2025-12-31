import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const telegramBotToken = Deno.env.get("TELEGRAM_BOT_TOKEN");

    if (!telegramBotToken) {
      console.error("TELEGRAM_BOT_TOKEN not configured");
      return new Response(
        JSON.stringify({ success: false, error: "Telegram not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    console.log(`Checking bookings for date: ${todayStr}`);

    // Get all bookings for today with their owners
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(`
        id,
        client_name,
        client_phone,
        slot_time,
        slot_end_time,
        owner_id,
        block_id,
        page_id,
        status
      `)
      .eq("slot_date", todayStr)
      .in("status", ["confirmed", "pending"]);

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      throw new Error("Failed to fetch bookings");
    }

    if (!bookings || bookings.length === 0) {
      console.log("No bookings for today");
      return new Response(
        JSON.stringify({ success: true, message: "No bookings for today", sent: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${bookings.length} bookings for today`);

    // Group bookings by owner
    const bookingsByOwner = new Map<string, typeof bookings>();
    for (const booking of bookings) {
      const ownerBookings = bookingsByOwner.get(booking.owner_id) || [];
      ownerBookings.push(booking);
      bookingsByOwner.set(booking.owner_id, ownerBookings);
    }

    // Get owner profiles with Telegram settings
    const ownerIds = Array.from(bookingsByOwner.keys());
    const { data: owners, error: ownersError } = await supabase
      .from("user_profiles")
      .select("id, telegram_chat_id, telegram_notifications_enabled, telegram_language, display_name")
      .in("id", ownerIds);

    if (ownersError) {
      console.error("Error fetching owners:", ownersError);
      throw new Error("Failed to fetch owner profiles");
    }

    // Get blocks to check if daily reminder is enabled
    const blockIds = [...new Set(bookings.map(b => b.block_id))];
    const pageIds = [...new Set(bookings.map(b => b.page_id))];
    
    const { data: blocks, error: blocksError } = await supabase
      .from("blocks")
      .select("id, content, page_id")
      .in("page_id", pageIds)
      .eq("type", "booking");

    if (blocksError) {
      console.error("Error fetching blocks:", blocksError);
    }

    // Create a map of block settings
    const blockSettings = new Map<string, boolean>();
    if (blocks) {
      for (const block of blocks) {
        const content = block.content as Record<string, unknown>;
        blockSettings.set(block.id, content?.dailyReminderEnabled === true);
      }
    }

    let sentCount = 0;

    for (const owner of owners || []) {
      if (!owner.telegram_notifications_enabled || !owner.telegram_chat_id) {
        console.log(`Skipping owner ${owner.id}: Telegram not enabled`);
        continue;
      }

      const ownerBookings = bookingsByOwner.get(owner.id) || [];
      
      // Filter bookings where dailyReminderEnabled is true for the block
      const enabledBookings = ownerBookings.filter(b => {
        // Find block for this booking
        const block = blocks?.find(bl => bl.page_id === b.page_id);
        if (!block) return false;
        const content = block.content as Record<string, unknown>;
        return content?.dailyReminderEnabled === true;
      });

      if (enabledBookings.length === 0) {
        console.log(`Skipping owner ${owner.id}: No bookings with reminder enabled`);
        continue;
      }

      // Format the message based on language
      const lang = owner.telegram_language || 'ru';
      const isRu = lang === 'ru' || lang === 'kk';
      
      const greeting = isRu ? 'Доброе утро' : 'Good morning';
      const todaySchedule = isRu ? 'Ваше расписание на сегодня' : 'Your schedule for today';
      const bookingsWord = isRu ? 'записей' : 'appointments';
      
      // Sort bookings by time
      enabledBookings.sort((a, b) => a.slot_time.localeCompare(b.slot_time));
      
      let message = `☀️ *${greeting}${owner.display_name ? `, ${owner.display_name}` : ''}!*\n\n`;
      message += `📋 *${todaySchedule}:*\n`;
      message += `_${enabledBookings.length} ${bookingsWord}_\n\n`;
      
      for (let i = 0; i < enabledBookings.length; i++) {
        const booking = enabledBookings[i];
        const timeStr = booking.slot_time.substring(0, 5);
        const endTimeStr = booking.slot_end_time ? ` - ${booking.slot_end_time.substring(0, 5)}` : '';
        
        message += `${i + 1}. *${timeStr}${endTimeStr}*\n`;
        message += `   👤 ${booking.client_name}\n`;
        if (booking.client_phone) {
          message += `   📞 ${booking.client_phone}\n`;
        }
        message += '\n';
      }
      
      const successWish = isRu ? '✨ Удачного дня!' : '✨ Have a great day!';
      message += successWish;

      try {
        const telegramResponse = await fetch(
          `https://api.telegram.org/bot${telegramBotToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: owner.telegram_chat_id,
              text: message,
              parse_mode: "Markdown",
            }),
          }
        );

        if (!telegramResponse.ok) {
          const errorData = await telegramResponse.text();
          console.error(`Telegram API error for owner ${owner.id}:`, errorData);
        } else {
          console.log(`Reminder sent to owner ${owner.id}`);
          sentCount++;
        }
      } catch (telegramError) {
        console.error(`Error sending Telegram to owner ${owner.id}:`, telegramError);
      }
    }

    console.log(`Daily reminder completed. Sent ${sentCount} notifications.`);

    return new Response(
      JSON.stringify({ success: true, sent: sentCount }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-booking-reminder:", errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
